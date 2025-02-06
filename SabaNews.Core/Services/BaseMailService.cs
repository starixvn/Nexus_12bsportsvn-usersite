namespace SabaNews.Core.Services;

using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using System;
using System.IO;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

public interface IBaseMailService
{
    Task<CommandResult> SendMailAsync(MailModel email);

    string ReadTextFile(string filePath);
}

public class BaseMailService(
    IConfiguration configuration,
    ILogServiceProvider logService)
    : IBaseMailService
{
    private const string MailConfigsForBroadcast = "MailConfigsForBroadcast";
    private const string MailConfigsForTransactional = "MailConfigsForTransactional";

    public async Task<CommandResult> SendMailAsync(MailModel email)
    {
        var mailConfigsKey = email.IsSendEDM ? MailConfigsForBroadcast : MailConfigsForTransactional;
        var mailConfigs = configuration.GetSection(mailConfigsKey).Get<MailConfigs>();
            
        if (!IsValidEmail(email.ReceiverEmail) || !mailConfigs.Enabled)
        {
            return new CommandResult { Message = Message.InvalidEmail };
        }

        CommandResult result;
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(mailConfigs.SenderName, mailConfigs.MailFrom));
        message.To.Add(new MailboxAddress(string.Empty, email.ReceiverEmail));
        message.Subject = email.Subject;
        var builder = new BodyBuilder
        {
            HtmlBody = email.Body
        };
        message.Body = builder.ToMessageBody();

        using var mailclient = new SmtpClient();
        try
        {
            mailclient.ServerCertificateValidationCallback = ValidateRemoteCertificate;
            mailclient.CheckCertificateRevocation = false;
            mailclient.Connect(mailConfigs.SmtpServer, mailConfigs.SmtpPort, mailConfigs.EnableSsl);
            if (mailConfigs.IsAuthenticate)
            {
                mailclient.Authenticate(mailConfigs.Username, mailConfigs.Password);
            }
            await mailclient.SendAsync(message);
            mailclient.Disconnect(true);
            result = new CommandResult { Code = Constants.SuccessCode, Message = Message.SendEmailSuccessfully };
            logService.WriteLogFileInfo($"Receiver: {email.ReceiverEmail} - Subject: {email.Subject} - Message: {Message.SendEmailSuccessfully}"  );
        }

        catch (Exception ex)
        {
            logService.WriteLogFileInfo($"Receiver: {email.ReceiverEmail} - Subject: {email.Subject} - Message: {ex.Message}");
            result = new CommandResult { Message = ex.Message };
        }
            
        return result;
    }

    public string ReadTextFile(string filePath)
    {
        using var sr = new StreamReader(filePath);
        return sr.ReadToEnd();
    }

    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return false;
        }

        var regex = new Regex(@"\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*");
        return regex.IsMatch(email);
    }

    private bool ValidateRemoteCertificate(object sender, X509Certificate cert, X509Chain chain, SslPolicyErrors policyErrors)
    {
        return policyErrors == SslPolicyErrors.None;
    }
}