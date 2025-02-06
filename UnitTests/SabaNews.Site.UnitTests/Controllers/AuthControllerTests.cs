namespace SabaNews.Site.UnitTests.Controllers;

using AutoFixture;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models.Auth;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Controllers;
using System;
using System.Threading.Tasks;
using Xunit;

public class AuthControllerTests : Controller
{
    private IAuthService authService;
    private ISessionService sessionService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void Index_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var openForm = "login";

        //Act
        var actual = controller.Index(openForm);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual) ;
        Assert.Equal(viewResult, actual);
    }

    [Fact]
    public async Task Login_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<LoginModel>();
        var user = new UserSession { Id = 1, Password = "123", Name = "admin333", Email = "hank.nguyen@starixvn.com" };
        var expected = new CommandResult { Code = 0, Message = string.Empty };
        authService.GetUserAsync(Arg.Do<string>(x => param.Email = x)).Returns(user);
        authService.ComparePassword(Arg.Do<string>(x => param.Password = x), Arg.Do<string>(x => user.Password = x)).Returns(true);
        controller.TempData = new TempDataDictionary(new DefaultHttpContext(), Substitute.For<ITempDataProvider>());
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                RequestServices = MockServiceProvider()
            }
        };
        //Act
        var result = await controller.Login(param);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(user.LoginType, LoginType.Internal);
        Assert.Equal(expected.Code, template.Code);
        Assert.Equal(expected.Message, template.Message);
    }

    [Fact]
    public async Task Login_WhenUserIsNull_ReturnFalseCommentResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<LoginModel>();
        var user = new UserSession { Id = 1, Password = "", Name = "admin333", Email = "hank.nguyen@starixvn.com" };
        var expected = new CommandResult { Code = 1, Message = Constants.WrongUsernameOrPassword };
        authService.GetUserAsync(Arg.Do<string>(x => param.Email = x)).Returns(user);
        authService.ComparePassword(Arg.Do<string>(x => param.Password = x), Arg.Do<string>(x => user.Password = x)).Returns(true);

        //Act
        var result = await controller.Login(param);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expected.Code, template.Code);
        Assert.Equal(expected.Message, template.Message);
    }

    [Fact]
    public async Task Login_WhenEmptyPassword_ReturnFalseCommentResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<LoginModel>();
        var user = new UserSession { Id = 1, Password = "", Name = "admin333", Email = "hank.nguyen@starixvn.com" };
        var expected = new CommandResult { Code = 1, Message = Constants.WrongUsernameOrPassword };
        authService.GetUserAsync(Arg.Do<string>(x => param.Email = x)).Returns(user);
        authService.ComparePassword(Arg.Do<string>(x => param.Password = x), Arg.Do<string>(x => user.Password = x)).Returns(true);

        //Act
        var result = await controller.Login(param);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expected.Code, template.Code);
        Assert.Equal(expected.Message, template.Message);
    }

    [Fact]
    public async Task Login_WhenFailConfirmPassword_ReturnFalseCommentResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<LoginModel>();
        var user = new UserSession { Id = 1, Password = "3333", Name = "admin333", Email = "hank.nguyen@starixvn.com" };
        var expected = new CommandResult { Code = 1, Message = Constants.WrongUsernameOrPassword };
        authService.GetUserAsync(Arg.Do<string>(x => param.Email = x)).Returns(user);
        authService.ComparePassword(Arg.Do<string>(x => param.Password = x), Arg.Do<string>(x => user.Password = x)).Returns(false);

        //Act
        var result = await controller.Login(param);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expected.Code, template.Code);
        Assert.Equal(expected.Message, template.Message);
    }

    [Fact]
    public async Task Register_InvalidData_ReturnFalseCommentResult()
    {
        // Arrange
        var controller = GetController();
        controller.ViewData.ModelState.Clear();
        controller.ModelState.AddModelError("fakeError", "fakeError");
        var model = new RegisterModel { Name ="", Email = "", Password = "123", ConfirmPassword = "321", Id = 1 };
            
        //Act
        var result = await controller.Register(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(Constants.InvalidData, template.Message);
        Assert.Equal(1, template.Code);
    }

    [Fact]
    public async Task Register_CreateSuccessful_ReturnExpectedCommenResult()
    {
        // Arrange
        var controller = GetController();
        controller.ViewData.ModelState.Clear();
        var model = fixture.Create<RegisterModel>();
        var confrimTokenModel = fixture.Create<ConfirmEmailModel>();
        var successCreateUserCommand = new CommandResult { Code = 0 };
        var successCreateTokenCommand = new CommandResult { Code = 0 };
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        authService.CreateUserAsync(Arg.Do<RegisterModel>(x => model = x)).Returns(successCreateUserCommand);
        authService.CreateTokenConfirmEmail(Arg.Do<ConfirmEmailModel>(x => confrimTokenModel = x)).Returns(successCreateTokenCommand);

        //Act
        var result = await controller.Register(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(successCreateTokenCommand.IsSuccessful, template.IsSuccessful);
        await authService.Received().SendMailConfirmationAsync(Arg.Any<string>(), Arg.Any<string>());
    }


    [Fact]
    public async Task Register_FailCreateToken_ReturnExpectedCommenResult()
    {
        // Arrange
        var controller = GetController();
        controller.ViewData.ModelState.Clear();
        var model = fixture.Create<RegisterModel>();
        var confirmTokenModel = fixture.Create<ConfirmEmailModel>();
        var successCreateUserCommand = new CommandResult { Code = 0 };
        var successCreateTokenCommand = new CommandResult { Code = 1 };
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        authService.CreateUserAsync(Arg.Do<RegisterModel>(x => model = x)).Returns(successCreateUserCommand);
        authService.CreateTokenConfirmEmail(Arg.Do<ConfirmEmailModel>(x => confirmTokenModel = x)).Returns(successCreateTokenCommand);

        //Act
        var result = await controller.Register(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(successCreateTokenCommand, template);
    }

    [Fact]
    public void SendEmailConfirm_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.SendEmailConfirm();

        // Assert

        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal(viewResult, result);
    }

    [Fact]
    public async Task SendEmailConfirm_CreateSuccessful_ReturnExpectedCommenResult()
    {
        // Arrange
        var controller = GetController();
        controller.ViewData.ModelState.Clear();
        var email = fixture.Create<string>();
        var confrimTokenModel = fixture.Create<ConfirmEmailModel>();
        var successCreateTokenCommand = new CommandResult { Code = 0 };
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        authService.CreateTokenConfirmEmail(Arg.Do<ConfirmEmailModel>(x => confrimTokenModel = x)).Returns(successCreateTokenCommand);

        //Act
        var result = await controller.SendEmailConfirm(email);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(successCreateTokenCommand.IsSuccessful, template.IsSuccessful);
        await authService.Received().SendMailConfirmationAsync(Arg.Any<string>(), Arg.Any<string>());
    }


    [Fact]
    public async Task SendEmailConfirm_FailCreateToken_ReturnExpectedCommenResult()
    {
        // Arrange
        var controller = GetController();
        controller.ViewData.ModelState.Clear();
        var email = fixture.Create<string>();
        var confirmTokenModel = fixture.Create<ConfirmEmailModel>();
        var successCreateTokenCommand = new CommandResult { Code = 1 };
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        authService.CreateTokenConfirmEmail(Arg.Do<ConfirmEmailModel>(x => confirmTokenModel = x)).Returns(successCreateTokenCommand);

        //Act
        var result = await controller.SendEmailConfirm(email);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(successCreateTokenCommand, template);
    }

    [Fact]
    public async Task ConfirmEmail_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var userId = fixture.Create<int>();
        var token = fixture.Create<string>();
        var expected = new CommandResult { Code = 0 };
        authService.ConfirmEmailAsync(Arg.Do<int>(x => userId = x), Arg.Do<string>(x => token = x)).Returns(expected);

        //Act
        var result = await controller.ConfirmEmail(userId, token);

        // Assert
            
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<bool>(viewResult.Model);
        Assert.True(viewModel);
    }

    [Fact]
    public async Task ConfirmEmail_WhenFailAction_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var userId = fixture.Create<int>();
        var token = fixture.Create<string>();
        var expected = new CommandResult { Code = 1 };
        sessionService.User = new UserSession { Id = 1 };
        authService.ConfirmEmailAsync(Arg.Do<int>(x => userId = x), Arg.Do<string>(x => token = x)).Returns(expected);

        //Act
        var result = await controller.ConfirmEmail(userId, token);

        // Assert

        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("/", viewResult.Url);
    }

    [Fact]
    public void ForgotPassword_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.ForgotPassword();

        // Assert

        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal(viewResult, result);
    }

    [Fact]
    public async Task ForgotPassword_WhenCreateTokenSuccessful_ReturnCommandResult()
    {
        // Arrange
        var controller = GetController();
        var email = fixture.Create<string>();
        var token = fixture.Create<string>();
        var user = fixture.Create<UserSession>();
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        var commandCreateToken = new CommandResult { Code = 0 };

        authService.CreateTokenResetPassword(Arg.Do<string>(x => email = x), Arg.Do<string>(x => token = x)).Returns(commandCreateToken);
        authService.GetUserAsync(Arg.Do<string>(x => email = x)).Returns(user);
        //Act
        var result = await controller.ForgotPassword(email);

        // Assert

        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(commandCreateToken, template);
        await authService.Received().SendMailResetPasswordAsync(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task ForgotPassword_WhenCreateTokenFailed_ReturnCommandResult()
    {
        // Arrange
        var controller = GetController();
        var email = fixture.Create<string>();
        var token = fixture.Create<string>();
        fixture.Create<UserSession>();
        var commandCreateToken = new CommandResult { Code = 1 };

        authService.CreateTokenResetPassword(Arg.Do<string>(x => email = x), Arg.Do<string>(x => token = x)).Returns(commandCreateToken);
        //Act
        var result = await controller.ForgotPassword(email);

        // Assert

        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(commandCreateToken, template);
    }

    [Fact]
    public async Task ResetPassword_WhenCreateTokenFailed_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var userId = fixture.Create<int>();
        var token = fixture.Create<string>();
        var commandExpected = fixture.Create<CommandResult>(); 

        authService.VerifyTokenResetPasswordAsync(Arg.Do<int>(x => userId = x), Arg.Do<string>(x => token = x)).Returns(commandExpected);
        //Act
        var result = await controller.ResetPassword(userId, token);

        // Assert

        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<bool>(viewResult.Model);
        Assert.Equal(viewModel, commandExpected.IsSuccessful);
    }

    [Fact]
    public async Task ResetPassword_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<ResetPasswordModel>();
        var commandExpected = fixture.Create<CommandResult>();

        authService.ResetPasswordAsync(Arg.Do<ResetPasswordModel>(x => model = x)).Returns(commandExpected);
        //Act
        var result = await controller.ResetPassword(model);

        // Assert

        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(commandExpected, template);
    }

    [Fact]
    public async Task Logout_WhenReturnUrlIsNotNull_RedirectExpectedUrl()
    {
        // Arrange
        var controller = GetController();
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                RequestServices = MockServiceProvider()
            }
        };
        var url = fixture.Create<string>();

        //Act
        var result = await controller.Logout(url);

        // Assert

        var redirectResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal(url, redirectResult.Url);
    }

    [Fact]
    public async Task Logout_WhenReturnIsEmpty_RedirectExpectedUrl()
    {
        // Arrange
        var controller = GetController();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                RequestServices = MockServiceProvider()
            }
        };
        var url = "";

        //Act
        var result = await controller.Logout(url);

        // Assert

        var redirectResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("/", redirectResult.Url);
    }


    #region Helpers
    private AuthController GetController()
    {
        Substitute.For<IBaseService>();
        authService = Substitute.For<IAuthService>();
        sessionService = Substitute.For<ISessionService>();
        var controller = new AuthController(authService, sessionService);

        return controller;
    }
    private IServiceProvider MockServiceProvider()
    {
        var authServiceMock = Substitute.For<IAuthenticationService>();
        var serviceProviderMock = Substitute.For<IServiceProvider>();
        serviceProviderMock.GetService(typeof(IAuthenticationService))
            .Returns(authServiceMock);
        return serviceProviderMock;
    }
    #endregion Helpers
}