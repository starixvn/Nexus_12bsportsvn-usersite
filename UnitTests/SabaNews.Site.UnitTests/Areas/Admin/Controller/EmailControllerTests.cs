namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using AutoFixture;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Auth;
using SabaNews.Criteria.Email;
using SabaNews.Criteria.User;
using SabaNews.Models.Email;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using SabaNews.Core.Constants;
using SabaNews.Criteria.Logs;
using System.Linq;
using SabaNews.Models.User;

public class EmailControllerTests : AdminController
{
    private IUserService userService;
    private ISessionService sessionService;
    private IEmailService emailService;
    private ILogService logService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task Index_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetAllUserCriteria>();
        var expectedUser = new List<UserSession>
        {
            new() { Id = 1, Metadata = "administrator" },
            new() { Id = 2 }
        };
        userService.GetAllUserAsync(Arg.Do<GetAllUserCriteria>(x => criteria = x)).Returns(expectedUser);

        //Act
        var actual = await controller.Index();

        // Act&Assert
        expectedUser.RemoveAt(1);
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<EmailFilterViewModel>(viewResult.Model);
        Assert.Equal(expectedUser, viewModel.Users);

    }

    [Fact]
    public async Task GetListEmailData_WhenCalledWithFullData_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<EmailFilterViewModel>();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<GetEmailsCriteria>();
        var expectedEmails = fixture.Create<IEnumerable<EmailModel>>();
        emailService.GetEmailsAsync(Arg.Do<GetEmailsCriteria>(x => criteria = x)).Returns(expectedEmails);

        //Act
        var actual = await controller.GetListEmailData(param);

        // Act&Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<EmailViewModel>(viewResult.Model);
        Assert.Equal(expectedEmails, viewModel.Emails);
    }

    [Fact]
    public async Task GetListEmailData_WhenSearchDataIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<EmailFilterViewModel>();
        param.Search = null;
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<GetEmailsCriteria>();
        var expectedEmails = fixture.Create<IEnumerable<EmailModel>>();
        emailService.GetEmailsAsync(Arg.Do<GetEmailsCriteria>(x => criteria = x)).Returns(expectedEmails);

        //Act
        var actual = await controller.GetListEmailData(param);

        // Act&Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<EmailViewModel>(viewResult.Model);
        Assert.Equal(expectedEmails, viewModel.Emails);
        Assert.Empty(criteria.Search);

    }

    [Fact]
    public async Task Create_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteriaAllUsers = fixture.Create<GetAllUserCriteria>();
        var criteriaSendUsers = fixture.Create<GetUserForSendEmailCriteria>();
        var expectedAllUsers = fixture.Create<IEnumerable<UserSession>>();
        var expectedSendUsers = fixture.Create<IEnumerable<UserSendEmail>>();
        userService.GetAllUserAsync(Arg.Do<GetAllUserCriteria>(x => criteriaAllUsers = x)).Returns(expectedAllUsers);
        userService.GetUserForSendEmail(Arg.Do<GetUserForSendEmailCriteria>(x => criteriaSendUsers = x)).Returns(expectedSendUsers);

        //Act
        var actual = await controller.Create();

        // Act&Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsAssignableFrom<EmaiCreateViewModel>(viewResult.Model);
        Assert.Equal(expectedAllUsers, viewModel.UsersForTest);
        Assert.Equal(expectedSendUsers, viewModel.UsersForSend);
    }

    [Fact]
    public async Task SaveAndSendCreate_ActionSuccessful_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var param = fixture.Create<EmailModel>();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<EmailModel>();
        var getUserCriteria = fixture.Create<GetEmailForSendCriteria>();
        fixture.Create<CreateUserSubscribeTokenCommand>();
        var updateStatusCmd = fixture.Create<UpdateEmailStatusCommand>();
        var sendEmailModel = fixture.Create<SendEDMModel>();
        fixture.Create<EmailDetailModel>();

        var expectedUsers = new List<EmailSendData>
        {
            new() { UserId = 1, Email = "email1@gmail.com", SubscribeToken ="123", Name = "user1", EmailContent="content", EmailTitle="title", EmailToken="123" },
            new() { UserId = 2, Email = "email1@gmail.com", SubscribeToken = "1234", Name = "user1", EmailContent = "content", EmailTitle = "title", EmailToken = "1235" }
        };
        var expectedCommand = new CommandResult { Code = 0, Message = "successful" };
        var expectedSendCommand = new CommandResult { Code = 0, Message = "successful" };

        emailService.CreateEmailAsync(Arg.Do<EmailModel>(x => criteria = x)).Returns(expectedCommand);
        emailService.GetEmailForSend(Arg.Do<GetEmailForSendCriteria>(x => getUserCriteria = x)).Returns(expectedUsers);
        emailService.SendMailEDMWithTemplateAsync(Arg.Do<SendEDMModel>(x => sendEmailModel = x)).Returns(expectedSendCommand);
        emailService.UpdateEmailStatusAsync(Arg.Do<UpdateEmailStatusCommand>(x => updateStatusCmd = x)).Returns(expectedSendCommand);
        //Act
        var actual = await controller.SaveAndSendCreate(param);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        var userNumber = Assert.IsAssignableFrom<int>(jsonResult.Value.GetType().GetProperty("userNumber").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
        Assert.Equal(expectedUsers.Count, userNumber);
    }

    [Fact]
    public async Task SaveAndSendCreate_ActionFailed_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var param = fixture.Create<EmailModel>();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<EmailModel>();
            
        var expectedCommand = new CommandResult { Code = 1 };

        emailService.CreateEmailAsync(Arg.Do<EmailModel>(x => criteria = x)).Returns(expectedCommand);
            
        //Act
        var actual = await controller.SaveAndSendCreate(param);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        var userNumber = Assert.IsAssignableFrom<int>(jsonResult.Value.GetType().GetProperty("userNumber").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
        Assert.Equal(0, userNumber);
    }

    [Fact]
    public async Task SaveCreate_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var param = fixture.Create<EmailModel>();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<EmailModel>();

        var expectedCommand = new CommandResult { Code = 1 };

        emailService.CreateEmailAsync(Arg.Do<EmailModel>(x => criteria = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.SaveCreate(param);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
    }

    [Fact]
    public async Task Edit_EmailIsNull_RedirectListPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<GetEmailByIdCriteria>();

        EmailModel expectedEmail = null;

        emailService.GetEmailByIdAsync(Arg.Do<GetEmailByIdCriteria>(x => criteria = x)).Returns(expectedEmail);

        //Act
        var actual = await controller.Edit(emailId);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task Edit_EmailIsSent_RedirectListPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<GetEmailByIdCriteria>();

        var expectedEmail = fixture.Create<EmailModel>();
        expectedEmail.Status = Constants.EmailDestroy;

        emailService.GetEmailByIdAsync(Arg.Do<GetEmailByIdCriteria>(x => criteria = x)).Returns(expectedEmail);

        //Act
        var actual = await controller.Edit(emailId);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task Edit_ActionSuccessful_RedirectListPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<GetEmailByIdCriteria>();
        var getAllUsercriteria = fixture.Create<GetAllUserCriteria>();

        var expectedEmail = fixture.Create<EmailModel>();
        var expectedUsers = fixture.Create<IEnumerable<UserSession>>();
        expectedEmail.EmbeddedLink = "returnUrlEmbeddedLink";
        expectedEmail.Status = Constants.EmailNew;

        emailService.GetEmailByIdAsync(Arg.Do<GetEmailByIdCriteria>(x => criteria = x)).Returns(expectedEmail);
        userService.GetAllUserAsync(Arg.Do<GetAllUserCriteria>(x => getAllUsercriteria = x)).Returns(expectedUsers);

        //Act
        var actual = await controller.Edit(emailId);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<EmailEditViewModel>(viewResult.Model);
        Assert.Equal(expectedEmail, viewModel.Email);
    }

    [Fact]
    public async Task SaveAndSendEdit_ActionSuccessful_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var param = fixture.Create<EmailModel>();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<EmailModel>();

        var expectedCommand = new CommandResult { Code = 0 };

        emailService.UpdateEmailAsync(Arg.Do<EmailModel>(x => criteria = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.SaveAndSendEdit(param);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        Assert.IsAssignableFrom<int>(jsonResult.Value.GetType().GetProperty("userNumber").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
    }

    [Fact]
    public async Task SaveAndSendEdit_ActionFailed_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var param = fixture.Create<EmailModel>();
        fixture.Create<string>();
        fixture.Create<string>();
        var criteria = fixture.Create<EmailModel>();

        var expectedCommand = new CommandResult { Code = 1 };

        emailService.UpdateEmailAsync(Arg.Do<EmailModel>(x => criteria = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.SaveAndSendEdit(param);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        var userNumber = Assert.IsAssignableFrom<int>(jsonResult.Value.GetType().GetProperty("userNumber").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
        Assert.Equal(0, userNumber);
    }

    [Fact]
    public async Task SaveEdit_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var param = fixture.Create<EmailModel>();
        var criteria = fixture.Create<EmailModel>();

        var expectedCommand = new CommandResult { Code = 1 };

        emailService.UpdateEmailAsync(Arg.Do<EmailModel>(x => criteria = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.SaveEdit(param);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
    }

    [Fact]
    public async Task TestSendEmail_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var param = fixture.Create<EmailReviewModel>();
        var criteria = fixture.Create<SendEDMModel>();
        var expectedCommand = fixture.Create<CommandResult>();

        emailService.SendMailEDMWithTemplateAsync(Arg.Do<SendEDMModel>(x => criteria = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.TestSendEmail(param);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, command);
        await logService.Received().WriteLog(Arg.Any<WriteLogCommand>());
    }

    [Fact]
    public async Task SendEmail_ActionSuccessful_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        fixture.Create<SendEDMModel>();
        var getEmailCriteria = fixture.Create<GetEmailByIdCriteria>();
        var updateStatusCmd = fixture.Create<UpdateStatusCommand>();

        var expectedCommand = new CommandResult { Code = 1 };
        var expectedEmail = fixture.Create<EmailModel>();

        emailService.GetEmailByIdAsync(Arg.Do<GetEmailByIdCriteria>(x => getEmailCriteria = x)).Returns(expectedEmail);
        emailService.UpdateStatusAsync(Arg.Do<UpdateStatusCommand>(x => updateStatusCmd = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.SendEmail(emailId);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
    }

    [Fact]
    public async Task SendEmail_ActionFailed_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        fixture.Create<SendEDMModel>();
        var getEmailCriteria = fixture.Create<GetEmailByIdCriteria>();
        var updateStatusCmd = fixture.Create<UpdateStatusCommand>();

        var expectedCommand = new CommandResult { Code = 0 };
        var expectedEmail = fixture.Create<EmailModel>();

        emailService.GetEmailByIdAsync(Arg.Do<GetEmailByIdCriteria>(x => getEmailCriteria = x)).Returns(expectedEmail);
        emailService.UpdateStatusAsync(Arg.Do<UpdateStatusCommand>(x => updateStatusCmd = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.SendEmail(emailId);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        var userNumber = Assert.IsAssignableFrom<int>(jsonResult.Value.GetType().GetProperty("userNumber").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
        Assert.Equal(0, userNumber);
    }

    [Fact]
    public async Task Delete_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        var updateStatusCmd = fixture.Create<UpdateStatusCommand>();

        var expectedCommand = fixture.Create<CommandResult>();
        fixture.Create<EmailModel>();

        emailService.UpdateStatusAsync(Arg.Do<UpdateStatusCommand>(x => updateStatusCmd = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.Delete(emailId);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, command);
    }
    [Fact]
    public async Task Detail_EmailIsNull_RedirectUrl()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        var criteria = fixture.Create<GetEmailByIdCriteria>();

        EmailModel expectedEmail = null;

        emailService.GetEmailByIdAsync(Arg.Do<GetEmailByIdCriteria>(x => criteria = x)).Returns(expectedEmail);

        //Act
        var actual = await controller.Detail(emailId);

        // Act&Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task Detail_WhenCalled_ReturnExpectedViewResult()
    {
        //Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        var criteria = fixture.Create<GetEmailByIdCriteria>();
        var filterParamcriteria = fixture.Create<FilterEmailDetailCriteria>();

        var expectedEmails = fixture.Create<IEnumerable<EmailDetailModel>>(); 
        var expectedEmail = fixture.Create<EmailModel>();

        emailService.GetEmailByIdAsync(Arg.Do<GetEmailByIdCriteria>(x => criteria = x)).Returns(expectedEmail);
        emailService.FilterEmailDetailAsync(Arg.Do<FilterEmailDetailCriteria>(x => filterParamcriteria = x)).Returns(expectedEmails);
        //Act
        var actual = await controller.Detail(emailId);

        //Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<EmailDetailViewModel>(viewResult.Model);
        Assert.Equal(expectedEmail, viewModel.Email);
        Assert.Equal(expectedEmails.Count(), viewModel.NumberEmailFailed);
    }

    [Fact]
    public async Task EditDetail_EmailIsNull_RedirectUrl()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        var userId = fixture.Create<int>();
        var criteria = fixture.Create<GetDetailEmailDetailCriteria>();

        EmailDetailModel expectedEmail = null;

        emailService.GetEmailDetailAsync(Arg.Do<GetDetailEmailDetailCriteria>(x => criteria = x)).Returns(expectedEmail);

        //Act
        var actual = await controller.EditDetail(emailId, userId);

        // Act&Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task SaveEditDetail_Whencalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        fixture.Create<int>();
        var cmd = fixture.Create<UpdateEmailDetailCommand>();

        var expectedCommand = new CommandResult { Code = 0 };

        emailService.UpdateEmailDetailAsync(Arg.Do<UpdateEmailDetailCommand>(x => cmd = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.SaveEditDetail(cmd);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
    }

    [Fact]
    public async Task SaveAndSendEditDetail_Whencalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        var cmd = fixture.Create<UpdateEmailDetailCommand>();
        var criteria = fixture.Create<GetDetailEmailDetailCriteria>();
        var sendEmailModel = fixture.Create<SendEDMModel>();
        var updateStatusCmd = fixture.Create<UpdateEmailStatusCommand>();

        var expectedDetail = fixture.Create<EmailDetailModel>();
        var expectedCommand = new CommandResult { Code = 0, Message = "successful" };

        emailService.UpdateEmailDetailAsync(Arg.Do<UpdateEmailDetailCommand>(x => cmd = x)).Returns(expectedCommand);
        emailService.GetEmailDetailAsync(Arg.Do<GetDetailEmailDetailCriteria>(x => criteria = x)).Returns(expectedDetail);
        emailService.SendMailEDMWithTemplateAsync(Arg.Do<SendEDMModel>(x => sendEmailModel = x)).Returns(expectedCommand);
        emailService.UpdateEmailStatusAsync(Arg.Do<UpdateEmailStatusCommand>(x => updateStatusCmd = x)).Returns(expectedCommand);
        //Act
        var actual = await controller.SaveAndSendEditDetail(cmd);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value.GetType().GetProperty("result").GetValue(jsonResult.Value));
        Assert.Equal(expectedCommand, command);
    }

    [Fact]
    public async Task EditDetail_WhenCalled_ReturnExpectedViewResult()
    {
        //Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        var userId = fixture.Create<int>();
        var criteria = fixture.Create<GetDetailEmailDetailCriteria>();
        var criteriaGetUser = fixture.Create<GetAllUserCriteria>();

        var expectedUsers = fixture.Create<IEnumerable<UserSession>>();
        var expectedEmail = new EmailDetailModel { Status = 2 } ;

        emailService.GetEmailDetailAsync(Arg.Do<GetDetailEmailDetailCriteria>(x => criteria = x)).Returns(expectedEmail);
        userService.GetAllUserAsync(Arg.Do<GetAllUserCriteria>(x => criteriaGetUser = x)).Returns(expectedUsers);
        //Act
        var actual = await controller.EditDetail(emailId, userId);

        //Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<EmailDetailEditViewModel>(viewResult.Model);
        Assert.Equal(expectedEmail, viewModel.Email);
        Assert.Equal(expectedUsers, viewModel.UsersForTest);
    }

    [Fact]
    public async Task DeleteDetail_Whencalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        var emailId = fixture.Create<int>();
        var userId = fixture.Create<int>();
        var cmd = fixture.Create<RemoveEmailDetailCommand>();

        var expectedCommand = new CommandResult { Code = 0 };

        emailService.RemoveEmailDetailAsync(Arg.Do<RemoveEmailDetailCommand>(x => cmd = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.DeleteDetail(userId, emailId);

        // Act&Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, command);
    }

    [Fact]
    public async Task GetListEmailDetailData_WhenCalled_ReturnExpectedViewResult()
    {
        //Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var param = fixture.Create<EmailDetailFilterViewModel>();
        var filterParamcriteria = fixture.Create<FilterEmailDetailCriteria>();

        var expectedEmails = fixture.Create<IEnumerable<EmailDetailModel>>();

        emailService.FilterEmailDetailAsync(Arg.Do<FilterEmailDetailCriteria>(x => filterParamcriteria = x)).Returns(expectedEmails);
        //Act
        var actual = await controller.GetListEmailDetailData(param);

        //Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<EmailDetailViewModel>(viewResult.Model);
        Assert.Equal(expectedEmails, viewModel.ListEmailDetails);
    }

    [Fact]
    public async Task ResendEmail_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var userId = fixture.Create<int>();
        var emailId = fixture.Create<int>();
        var getDetailCriteria = fixture.Create<GetDetailEmailDetailCriteria>();
        var sendEmailCriteria = fixture.Create<SendEDMModel>();
        var UpdateEmailCriteria = fixture.Create<UpdateEmailStatusCommand>();

        var expectedEmail = fixture.Create<EmailDetailModel>();
        var expectedSendCommand = fixture.Create<CommandResult>();

        emailService.GetEmailDetailAsync(Arg.Do<GetDetailEmailDetailCriteria>(x => getDetailCriteria = x)).Returns(expectedEmail);
        emailService.SendMailEDMWithTemplateAsync(Arg.Do<SendEDMModel>(x => sendEmailCriteria = x)).Returns(expectedSendCommand);
        emailService.UpdateEmailStatusAsync(Arg.Do<UpdateEmailStatusCommand>(x => UpdateEmailCriteria = x)).Returns(expectedSendCommand);
        //Act
        var actual = await controller.ResendEmail(userId, emailId);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedSendCommand, result);
    }

    [Fact]
    public async Task ResendAll_SendSuccessful_ReturnExpectedData()
    {
        //Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        var filterCriteria = fixture.Create<FilterEmailDetailCriteria>();
        var sendEmailCriteria = fixture.Create<SendEDMModel>();
        var UpdateEmailCriteria = fixture.Create<UpdateEmailStatusCommand>();

        var expectedEmails = fixture.Create<IEnumerable<EmailDetailModel>>();
        var expectedSendCommand = new CommandResult { Code = 0 };

        emailService.FilterEmailDetailAsync(Arg.Do<FilterEmailDetailCriteria>(x => filterCriteria = x)).Returns(expectedEmails);
        emailService.SendMailEDMWithTemplateAsync(Arg.Do<SendEDMModel>(x => sendEmailCriteria = x)).Returns(expectedSendCommand);
        emailService.UpdateEmailStatusAsync(Arg.Do<UpdateEmailStatusCommand>(x => UpdateEmailCriteria = x)).Returns(expectedSendCommand);
        //Act
        var actual = await controller.ResendAll(emailId);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var sentNumber = Assert.IsAssignableFrom<int>(jsonResult.Value);
        Assert.Equal(expectedEmails.Count(), sentNumber);
    }

    [Fact]
    public async Task ResendAll_SendFailed_ReturnExpectedData()
    {
        //Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        var emailId = fixture.Create<int>();
        var filterCriteria = fixture.Create<FilterEmailDetailCriteria>();
        var sendEmailCriteria = fixture.Create<SendEDMModel>();
        var UpdateEmailCriteria = fixture.Create<UpdateEmailStatusCommand>();

        var expectedEmails = fixture.Create<IEnumerable<EmailDetailModel>>();
        var expectedSendCommand = new CommandResult { Code = 1 };

        emailService.FilterEmailDetailAsync(Arg.Do<FilterEmailDetailCriteria>(x => filterCriteria = x)).Returns(expectedEmails);
        emailService.SendMailEDMWithTemplateAsync(Arg.Do<SendEDMModel>(x => sendEmailCriteria = x)).Returns(expectedSendCommand);
        emailService.UpdateEmailStatusAsync(Arg.Do<UpdateEmailStatusCommand>(x => UpdateEmailCriteria = x)).Returns(expectedSendCommand);
        //Act
        var actual = await controller.ResendAll(emailId);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var sentNumber = Assert.IsAssignableFrom<int>(jsonResult.Value);
        Assert.Equal(0, sentNumber);
    }
    #region Helpers
    private EmailController GetController()
    {
        var edmSettings = new Dictionary<string, string> {
            {"EDMSetting:Batch", "1"},
            {"EDMSetting:Delay", "2000"}
        };
        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(edmSettings)
            .Build();
        userService = Substitute.For<IUserService>();
        sessionService = Substitute.For<ISessionService>();
        Substitute.For<IPathService>();
        emailService = Substitute.For<IEmailService>();
        Substitute.For<IAuthService>();
        logService = Substitute.For<ILogService>();
        var controller = new EmailController(userService, sessionService, emailService, configuration, logService);

        return controller;
    }

    private void GetDefaultContent(EmailController controller)
    {
        var urlHelperMock = Substitute.For<IUrlHelper>();
        controller.Url = urlHelperMock;
        urlHelperMock.Action(Arg.Any<UrlActionContext>()).Returns("url");
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
    }

    #endregion Helpers
}