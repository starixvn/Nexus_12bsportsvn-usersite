namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using SabaNews.Criteria.Email;
using SabaNews.Models.Email;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEmailService
{
    Task<CommandResult> CreateEmailAsync(EmailModel model);

    Task<CommandResult> CreateEmailDetailAsync(EmailDetailModel model);

    Task<CommandResult> VerifyTokenEmailDetailAsync(VerifyTokenEmailDetailCommand command);

    Task<IEnumerable<EmailModel>> GetEmailByUserAsync(GetEmailByUserCriteria criteria);

    Task<IEnumerable<EmailModel>> GetEmailsAsync(GetEmailsCriteria criteria);

    Task<IEnumerable<EmailDetailModel>> FilterEmailDetailAsync(FilterEmailDetailCriteria criteria);

    Task<CommandResult> UpdateEmailStatusAsync(UpdateEmailStatusCommand command);

    Task<EmailDetailModel> GetEmailDetailAsync(GetDetailEmailDetailCriteria criteria);

    Task<EmailModel> GetEmailByIdAsync(GetEmailByIdCriteria criteria);

    Task<CommandResult> SendMailEDMWithTemplateAsync(SendEDMModel model);

    Task<CommandResult> SendEDMAsync(string subject, string body, string receiverEmail);

    Task<CommandResult> UpdateStatusAsync(UpdateStatusCommand criteria);

    Task<CommandResult> UpdateEmailAsync(EmailModel model);

    Task<CommandResult> UpdateEmailDetailAsync(UpdateEmailDetailCommand command);

    Task<CommandResult> RemoveEmailDetailAsync(RemoveEmailDetailCommand command);

    Task<IEnumerable<EmailSendData>> GetEmailForSend(GetEmailForSendCriteria criteria);
}