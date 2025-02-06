namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Email;
using SabaNews.Criteria.Logs;
using SabaNews.Criteria.User;
using SabaNews.Models.Email;
using SabaNews.Services.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

public class EmailController(
    IUserService userService,
    ISessionService sessionService,
    IEmailService emailService,
    IConfiguration configuration,
    ILogService logService)
    : AdminController
{
    private const string SendMailTemplate = "EmailTemplates//SendEDM.html";
    private const string verifySendEmailLink = "VerifySendEmailLink?{token}";
    private readonly string baseUrl = configuration.GetValue<string>("BaseUrl");

    public async Task<ActionResult> Index()
    {
        var users = await userService.GetAllUserAsync(new GetAllUserCriteria());
        var adminUsers = users.Where(item => !string.IsNullOrWhiteSpace(item.Metadata) && item.Metadata.Contains(Role.Administrator)).ToList();
        var model = new EmailFilterViewModel
        {
            FromDate = DateTimeUtilize.Now().AddMonths(-6),
            ToDate = DateTimeUtilize.Now(),
            Users = adminUsers
        };
        return View(model);
    }

    public async Task<ActionResult> GetListEmailData(EmailFilterViewModel param)
    {
        var perPage = param.PageSize;
        var start = (param.Page - 1) * perPage;
        var search = param.Search ??= "";
        var criteria = new GetEmailsCriteria 
        {
            Search = search, 
            FromDate = param.FromDate.DateTime,
            ToDate = param.ToDate.DateTime,
            Status = param.Status,
            CreatedBy = param.CreatedBy,
            End = perPage,
            Start = start 
        };
        var emails = await emailService.GetEmailsAsync(criteria);
        var paging = new PagingModel
        {
            CurrentPage = param.Page,
            PageSize = perPage,
            TotalPages = (int)Math.Ceiling(criteria.TotalItems / (double)param.PageSize)
        };
        var model = new EmailViewModel
        {
            Emails = emails,
            Paging = paging
        };
        return PartialView("_ListEmailData", model);
    }

    public async Task<ActionResult> Create()
    {
        var rawUrl = string.Concat($"{baseUrl}", verifySendEmailLink);
            
        var model = new EmaiCreateViewModel
        {
            UsersForTest = await userService.GetAllUserAsync(new GetAllUserCriteria()),
            UsersForSend = await userService.GetUserForSendEmail(new GetUserForSendEmailCriteria())
        };
        ViewBag.rawUrl = rawUrl;
        return View(model);
    }

    [HttpPost]
    public async Task<ActionResult> SaveAndSendCreate(EmailModel model)
    {
        model.CreatedBy = sessionService.User.Id;
        model.EmailContent = HttpUtility.HtmlDecode(model.EmailContent);
        model.Status = Constants.EmailSent;
        var userNumber = 0;
        var result = await emailService.CreateEmailAsync(model);

        if (result.IsSuccessful)
        {
            userNumber = await SendMultiple(model.Id);
        }
        var redirectLink = Url.Action("Index", Constants.Email);
        return Json(new { result, userNumber, redirectLink });
    }

        
    [HttpPost]
    public async Task<ActionResult> SaveCreate(EmailModel model)
    {
        model.CreatedBy = sessionService.User.Id;
        model.Status = Constants.EmailNew;
        model.EmailContent = HttpUtility.HtmlDecode(model.EmailContent);
        var result = await emailService.CreateEmailAsync(model);
        var redirectLink = Url.Action("Edit", Constants.Email, new { emailId = model.Id });
        return Json(new { result, redirectLink });
    }

    public async Task<ActionResult> Edit(int emailId)
    {
        var email = await emailService.GetEmailByIdAsync(new GetEmailByIdCriteria { Id = emailId });
        if (email == null || email.Status != Constants.EmailNew) {
            return Redirect(Url.Action("Index", Constants.Email));
        }
        var users = await userService.GetAllUserAsync(new GetAllUserCriteria());
        var originalUrl = "";
        if (email.EmbeddedLink != null && email.EmbeddedLink.Contains(Constants.ReturnUrl)) {
            originalUrl = email.EmbeddedLink[(email.EmbeddedLink.LastIndexOf(Constants.ReturnUrl, StringComparison.OrdinalIgnoreCase) + Constants.ReturnUrl.Length + 1)..];
        }
           
        var model = new EmailEditViewModel
        {
            Email = email,
            RawUrl = string.Concat($"{baseUrl}", verifySendEmailLink),
            OriginalUrl = originalUrl,
            UsersForTest = users,
            UsersForSend = await userService.GetUserForSendEmail(new GetUserForSendEmailCriteria()),
            UsersSelected = await emailService.GetEmailForSend(new GetEmailForSendCriteria{ EmailId = emailId })
        };

        return View(model);
    }

    public async Task<ActionResult> SaveAndSendEdit(EmailModel model)
    {
        var userNumber = 0;
        model.CreatedBy = sessionService.User.Id;
        model.EmailContent = HttpUtility.HtmlDecode(model.EmailContent);
        model.Status = Constants.EmailSent;
        var result = await emailService.UpdateEmailAsync(model);

        if (result.IsSuccessful)
        {
            userNumber = await SendMultiple(model.Id);
        }
        return Json(new { result, userNumber });
    }

    [HttpPost]
    public async Task<ActionResult> SaveEdit(EmailModel model)
    {
        model.CreatedBy = sessionService.User.Id;
        model.Status = Constants.EmailNew;
        model.EmailContent = HttpUtility.HtmlDecode(model.EmailContent);
        var result = await emailService.UpdateEmailAsync(model);
        return Json(new { result });
    }


    [HttpPost]
    public async Task<ActionResult> TestSendEmail(EmailReviewModel model)
    {
        var sendEmailModel = new SendEDMModel
        {
            EmailAddress = model.EmailAddress,
            EmailTemplatePath = SendMailTemplate,
            EmailTitle = model.EmailTitle,
            EmailContent = model.EmailContent,
            SubscribeLink = "#",
            BaseUrl = baseUrl
        };
        var resultSendMail = await emailService.SendMailEDMWithTemplateAsync(sendEmailModel);
        var logCommand = new WriteLogCommand
        {
            ActionId = LogAction.SendTestEDM,
            ActorId = sessionService.User.Id,
            Data = JsonConvert.SerializeObject(new { isSuccessful = resultSendMail.IsSuccessful, message = resultSendMail.Message, model.EmailAddress, model.EmailTitle, model.EmailContent })
        };
        await logService.WriteLog(logCommand);
        return Json(resultSendMail);
    }

    [HttpPost]
    public async Task<ActionResult> SendEmail(int emailId)
    {
        var result = await emailService.UpdateStatusAsync(new UpdateStatusCommand { EmailId = emailId, Status = Constants.EmailSent });
        var userNumber = 0;
            
        if (result.IsSuccessful)
        {
            userNumber = await SendMultiple(emailId);
        }
        return Json(new { result, userNumber });
    }

    [HttpPost]
    public async Task<ActionResult> Delete(int emailId)
    {
        var result = await emailService.UpdateStatusAsync(new UpdateStatusCommand { EmailId = emailId, Status = Constants.EmailDestroy });
        return Json(result);
    }

    public async Task<ActionResult> Detail(int emailId)
    {
        var email = await emailService.GetEmailByIdAsync(new GetEmailByIdCriteria { Id = emailId });
        if (email == null)
        {
            return Redirect(Url.Action("Index", Constants.Email));
        }
        var emailFailedParam = new FilterEmailDetailCriteria
        {
            EmailID = emailId,
            Status = EDMStatus.EmailDetailSentFailed,
            Start = Constants.FromFirstItem,
            End = Constants.Total
        };
        var listEmailFailed = await emailService.FilterEmailDetailAsync(emailFailedParam);
        var model = new EmailDetailViewModel
        {
            Email = email,
            NumberEmailFailed = listEmailFailed.Count()
        };
        return View(model);
    }

    public async Task<ActionResult> GetListEmailDetailData(EmailDetailFilterViewModel param)
    {
        var perPage = param.PageSize;
        var start = (param.Page - 1) * perPage;
        var search = param.Search ??= "";
        var criteria = new FilterEmailDetailCriteria
        {
            EmailID = param.EmailId,
            Search = search,
            IsClicked = param.FilterClicked,
            Status = param.Status,
            Start = start,
            End = perPage
        };
        var listEmailDetails = await emailService.FilterEmailDetailAsync(criteria);
        var paging = new PagingModel
        {
            CurrentPage = param.Page,
            PageSize = perPage,
            SearchValue = param.Search,
            TotalPages = (int)Math.Ceiling(criteria.TotalItems / (double)perPage)
        };
        var model = new EmailDetailViewModel
        {
            ListEmailDetails = listEmailDetails,
            Paging = paging
        };
        return PartialView("_ListEmailDetailData", model);
    }

    public async Task<ActionResult> EditDetail(int emailId, int userId)
    {
        var email = await emailService.GetEmailDetailAsync(new GetDetailEmailDetailCriteria { UserId = userId, EmailId = emailId });
        if (email == null || email.Status != EDMStatus.EmailDetailNew)
        {
            return Redirect(Url.Action("Detail", Constants.Email, new { emailId }));
        }
        var rawUrl = string.Concat($"{baseUrl}", verifySendEmailLink);

        var model = new EmailDetailEditViewModel
        {
            Email = email,
            RawUrl = string.Concat($"{baseUrl}", verifySendEmailLink),
            UsersForTest = await userService.GetAllUserAsync(new GetAllUserCriteria())
        };
        ViewBag.rawUrl = rawUrl;
        return View(model);
    }

    [HttpPost]
    public async Task<ActionResult> SaveEditDetail(UpdateEmailDetailCommand param)
    {
        var result = await emailService.UpdateEmailDetailAsync(param);
        return Json(new { result });
    }

    [HttpPost]
    public async Task<ActionResult> SaveAndSendEditDetail(UpdateEmailDetailCommand param)
    {
        var result = await emailService.UpdateEmailDetailAsync(param);
        if (result.IsSuccessful)
        {
            var detail = await emailService.GetEmailDetailAsync(new GetDetailEmailDetailCriteria { EmailId = param.EmailId, UserId = param.UserId });
            var sendModel = new SendEmailDetailModel
            {
                EmailId = detail.EmailId,
                UserId = detail.UserId,
                EmailContent = detail.EmailContent,
                EmailAddress = detail.EmailAddress,
                EmailTitle = detail.EmailTitle,
                SubscribeToken = detail.SubscribeToken,
                EmailToken = detail.TokenId
            };
            var resultSend = await Send(sendModel);
            result.Message = result.Message + " - " + resultSend.Message;
        }
        return Json(new { result });
    }

    [HttpPost]
    public async Task<ActionResult> DeleteDetail(int emailId, int userId)
    {
        var result = await emailService.RemoveEmailDetailAsync(new RemoveEmailDetailCommand { EmailId = emailId, UserId = userId });
        return Json(result);
    }

        

    public async Task<ActionResult> ResendEmail(int userId, int emailId)
    {
        var email = await emailService.GetEmailDetailAsync(new GetDetailEmailDetailCriteria { UserId = userId, EmailId = emailId });
        var sendModel = new SendEmailDetailModel
        {
            EmailId = emailId,
            UserId = email.UserId,
            EmailContent = email.EmailContent,
            EmailAddress = email.EmailAddress,
            EmailTitle = email.EmailTitle,
            SubscribeToken = email.SubscribeToken,
            EmailToken = email.TokenId
        };
        var resultSend = await Send(sendModel);
        return Json(resultSend);
    }

    [HttpPost]
    public async Task<ActionResult> ResendAll(int emailId)
    {
        var param = new FilterEmailDetailCriteria
        {
            EmailID = emailId,
            Status = 1,
            Start = Constants.FromFirstItem,
            End = Constants.Total
        };
        var emails = await emailService.FilterEmailDetailAsync(param);
        var sentNumber = 0;
        foreach (var email in emails)
        {
            var sendModel = new SendEmailDetailModel
            {
                EmailId = emailId,
                UserId = email.UserId,
                EmailContent = email.EmailContent,
                EmailAddress = email.EmailAddress,
                EmailTitle = email.EmailTitle,
                SubscribeToken = email.SubscribeToken,
                EmailToken = email.TokenId
            };
            var resultSend = await Send(sendModel);
            sentNumber = resultSend.IsSuccessful ? ++sentNumber : sentNumber;
        }
        return Json(sentNumber);
    }

    public async Task<int> SendMultiple(int emailId)
    {
        var emails = await emailService.GetEmailForSend(new GetEmailForSendCriteria { EmailId = emailId });
        var sentCount = 0;
        var batchCount = 0;
        var batchSetting = configuration.GetValue<int>("EDMSetting:Batch");
        var delayBatch = configuration.GetValue<int>("EDMSetting:Delay");
        foreach (var email in emails)
        {
            batchCount++;
            var sendModel = new SendEmailDetailModel
            {
                EmailId = emailId,
                UserId = email.UserId,
                EmailContent = email.EmailContent,
                EmailAddress = email.Email,
                EmailTitle = email.EmailTitle,
                SubscribeToken = email.SubscribeToken,
                EmailToken = email.EmailToken
            };
            var resultSend = await Send(sendModel);
                
            if (resultSend.IsSuccessful)
            {
                sentCount++;
            }
            if (batchCount == batchSetting)
            {
                await Task.Delay(delayBatch);
                batchCount = 0;
            }
        }
        return sentCount;
    }

    public async Task<CommandResult> Send(SendEmailDetailModel model)
    {
        var unsubcribeLink = Url.Action(Constants.ConfirmUnsubscribe, Constants.ProfileAction, new { userId = model.UserId, token = model.SubscribeToken, Area = "" }, Request.Scheme);
        var emailContent = model.EmailContent.Replace("{token}", string.Concat("token=", model.EmailToken));
        var sendEmailModel = new SendEDMModel
        {
            EmailAddress = model.EmailAddress,
            EmailTemplatePath = SendMailTemplate,
            EmailTitle = model.EmailTitle,
            EmailContent = emailContent,
            SubscribeLink = unsubcribeLink,
            BaseUrl = baseUrl
        };
        var resultSendMail = await emailService.SendMailEDMWithTemplateAsync(sendEmailModel);
        var updateStatusCmd = new UpdateEmailStatusCommand
        {
            _EmailId = model.EmailId,
            _UserId = model.UserId,
            Status = resultSendMail.Code
        };
        var result = await emailService.UpdateEmailStatusAsync(updateStatusCmd);
        result.Message = result.Message + " - " + resultSendMail.Message;
        return result;
    }


}