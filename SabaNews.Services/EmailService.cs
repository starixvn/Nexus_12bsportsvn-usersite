namespace SabaNews.Services;

using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Email;
using SabaNews.Models.Email;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

public class EmailService(
    IBaseService baseService,
    IBaseMailService baseMailService,
    IPathService pathService)
    : IEmailService
{
    public async Task<CommandResult> CreateEmailAsync(EmailModel model)
    {
        var command = new CreateEmailCriteria
        {
            EmailTitle = model.EmailTitle,
            EmailContent = model.EmailContent,
            EmbeddedLink = model.EmbeddedLink,
            SendDate = DateTimeUtilize.UtcNow(),
            CreatedBy = model.CreatedBy,
            Status = model.Status,
            CreatedDate = DateTimeUtilize.UtcNow(),
            Users  = model.Users
        };
        var result =  await baseService.ExecuteNonQueryAsync(command);
        model.Id = command.Id;
        return result;
    }

    public async Task<CommandResult> CreateEmailDetailAsync(EmailDetailModel model)
    {
        var command = new CreateEmailDetailCriteria
        {
            EmailId = model.EmailId,
            UserId = model.UserId,
            TokenId = model.TokenId,
            EmailTitle = model.EmailTitle,
            EmailContent = model.EmailContent,
            EmailAddress = model.EmailAddress,
            SendTime = DateTimeUtilize.UtcNow(),
            Status = model.Status
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<IEnumerable<EmailModel>> GetEmailByUserAsync(GetEmailByUserCriteria criteria)
    {
        return await baseService.GetDataAsync<EmailModel>(criteria);
    }

    public async Task<IEnumerable<EmailModel>> GetEmailsAsync(GetEmailsCriteria criteria)
    {
        return await baseService.GetDataAsync<EmailModel>(criteria);
    }

    public async Task<IEnumerable<EmailDetailModel>> FilterEmailDetailAsync(FilterEmailDetailCriteria criteria)
    {
        return await baseService.GetDataAsync<EmailDetailModel>(criteria);
    }

    public async Task<CommandResult> VerifyTokenEmailDetailAsync(VerifyTokenEmailDetailCommand command)
    {
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> UpdateEmailStatusAsync(UpdateEmailStatusCommand command)
    {
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<EmailDetailModel> GetEmailDetailAsync(GetDetailEmailDetailCriteria criteria)
    {
        return await baseService.GetDataEntityAsync<EmailDetailModel>(criteria);
    }

    public async Task<EmailModel> GetEmailByIdAsync(GetEmailByIdCriteria criteria)
    {
        return await baseService.GetDataEntityAsync<EmailModel>(criteria);
    }

    public async Task<CommandResult> UpdateStatusAsync(UpdateStatusCommand criteria)
    {
        return await baseService.ExecuteNonQueryAsync(criteria);
    }

    public async Task<CommandResult> UpdateEmailAsync(EmailModel model)
    {
        var command = new UpdateEmailCommand
        {
            _EmailId = model.Id,
            EmailTitle = model.EmailTitle,
            EmailContent = model.EmailContent,
            EmbeddedLink = model.EmbeddedLink,
            Status = model.Status,
            CreatedBy = model.CreatedBy,
            SendDate = DateTimeUtilize.UtcNow(),
            Users = model.Users
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> UpdateEmailDetailAsync(UpdateEmailDetailCommand command)
    {
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<IEnumerable<EmailSendData>> GetEmailForSend(GetEmailForSendCriteria criteria)
    {
        return await baseService.GetDataAsync<EmailSendData>(criteria);
    }

    public async Task<CommandResult> RemoveEmailDetailAsync(RemoveEmailDetailCommand command)
    {
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> SendMailEDMWithTemplateAsync(SendEDMModel model)
    {
        var mailPath = pathService.MapPathContentRoot(model.EmailTemplatePath);
        var rawBody = baseMailService.ReadTextFile(mailPath);
        var body = rawBody.Replace("{content}", model.EmailContent)
            .Replace("{unsubscribeLink}", model.SubscribeLink)
            .Replace("{baseUrl}", model.BaseUrl);
        return await SendEDMAsync(model.EmailTitle, body, model.EmailAddress);
    }

    public async Task<CommandResult> SendEDMAsync(string subject, string body, string receiverEmail)
    {
        var email = new MailModel
        {
            Subject = subject,
            Body = body,
            ReceiverEmail = receiverEmail,
            IsSendEDM = true
        };
        return await baseMailService.SendMailAsync(email);
    }
}