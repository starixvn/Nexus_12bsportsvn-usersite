namespace SabaNews.Services;

using BCrypt.Net;
using Microsoft.AspNetCore.Hosting;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Auth;
using SabaNews.Models.Auth;
using SabaNews.Services.Interfaces;
using System.IO;
using System.Threading.Tasks;

public class AuthService(
    IBaseService baseService,
    IWebHostEnvironment webHostEnvironment,
    IBaseMailService mailService)
    : IAuthService
{
    private const string ConfirmEmailTemplates = "EmailTemplates//ConfirmEmail.txt";
    private const string ResetPasswordTemplates = "EmailTemplates//ResetPassword.txt";
    private const string SendMailEventTemplates = "EmailTemplates//SendMailEvent.txt";

    public async Task<UserSession> GetUserAsync(string email)
    {
        var criteria = new GetUserLoginCriteria
        {
            Email = email
        };
        return await baseService.GetDataEntityAsync<UserSession>(criteria);
    }

    public async Task<CommandResult> CreateUserAsync(RegisterModel model)
    {
        var command = new CreateUserCommand
        {
            _Email = model.Email,
            _Name = model.Name,
            _Phone = model.Phone,
            _Password = BCrypt.HashPassword(model.Password),
            _YearOfBirth = model.YearOfBirth
        };
        var result = await baseService.ExecuteNonQueryAsync(command);
        model.Id = command.UserId;
        return result;
    }

    public bool ComparePassword(string plainText, string encrypt)
    {
        return BCrypt.Verify(plainText, encrypt);
    }

    public async Task<CommandResult> CreateTokenConfirmEmail(ConfirmEmailModel model)
    {
        CreateTokenConfirmEmailCommand command = new()
        {
            Email = model.Email,
            Token = model.Token
        };
        var result =  await baseService.ExecuteNonQueryAsync(command);
        model.UserId = command.UserId;
        return result;

    }

    public async Task<CommandResult> ConfirmEmailAsync(int userId, string token)
    {
        var command = new ConfirmEmailCommand
        {
            Id = userId,
            Token = token
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> CreateTokenResetPassword(string email, string token)
    {
        var command = new CreateTokenResetPasswordCommand
        {
            Email = email,
            Token = token
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> VerifyTokenResetPasswordAsync(int userId, string token)
    {
        var command = new VerifyTokenResetPasswordCommand
        {
            Id = userId,
            Token = token
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> ResetPasswordAsync(ResetPasswordModel model)
    {
        var command = new ResetPasswordCommand
        {
            Id = model.Id,
            Token = model.Token,
            _Password = BCrypt.HashPassword(model.Password)
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> CreateUserSubscribeToken(CreateUserSubscribeTokenCommand command)
    {
        var result = await baseService.ExecuteNonQueryAsync(command);
        return result;
    }

    public async Task SendMailConfirmationAsync(string email, string url)
    {
        var mailPath = Path.Combine(webHostEnvironment.ContentRootPath, ConfirmEmailTemplates);
        const string subject = Constants.SubjectConfirmation;
        var body = string.Format(
            mailService.ReadTextFile(mailPath),
            email,
            url);
        await SendMailAsync(subject, body, email);
    }

    public async Task SendMailResetPasswordAsync(string email, string url)
    {
        var mailPath = Path.Combine(webHostEnvironment.ContentRootPath, ResetPasswordTemplates);
        const string subject = Constants.SubjectResetPassword;
        var body = string.Format(
            mailService.ReadTextFile(mailPath),
            email,
            url);
        await SendMailAsync(subject, body, email);
    }

    public async Task<CommandResult> SendMailEventAsync(string subject, string content, string email)
    {
        var mailPath = Path.Combine(webHostEnvironment.ContentRootPath, SendMailEventTemplates);
        var rawBody = mailService.ReadTextFile(mailPath);
        var body = rawBody.Replace("{0}", content);
        return await SendMailAsync(subject, body, email);
    }

    public async Task<CommandResult> SendMailAsync(string subject, string body, string receiverEmail)
    {
        var email = new MailModel
        {
            Subject = subject,
            Body = body,
            ReceiverEmail = receiverEmail
        };
        return await mailService.SendMailAsync(email);
    }
}