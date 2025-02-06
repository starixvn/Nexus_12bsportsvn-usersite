namespace SabaNews.Site.UnitTests.Controllers;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models.ViewModel.Profile;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Controllers;
using System.Threading.Tasks;
using Xunit;
using SabaNews.Core.Constants;
using System.Collections.Generic;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Posts;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SabaNews.Criteria.Email;

public class ProfileControllerTests : Controller
{
    private IUserService userService;
    private ISessionService sessionService;
    private IPostService postService;
    private IAuthService authService;
    private IPathService pathService;
    private IEmailService emailService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task Index_WhenAuthenticated_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var expected = fixture.Create<UserSession>();
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expected);
        //Act
        var actual = await controller.Index();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<ProfileViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.User);
    }

    [Fact]
    public async Task Index_WhenIsNotAuthenticate_RedirectHomePage()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<UserSession>();
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expected);
        //Act
        var actual = await controller.Index();

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal(Constants.HomepageUrl, viewResult.Url);
    }

    [Fact]
    public async Task SavePost_WhenIsNotAuthenticate_RedirectHomePage()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        //Act
        var actual = await controller.SavePost(postId);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal(Constants.HomepageUrl, viewResult.Url);
    }

    [Fact]
    public async Task SavePost_FistSavePost_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var postId = fixture.Create<int>();
        var listPosts = fixture.Create<string>();
        var expected = fixture.Create<UserSession>();
        var expectedCommand = new CommandResult { Code = 0 };
        expected.SavedPosts = null;
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expected);
        userService.UpdateUserSavePostAsync(Arg.Do<int>(x => sessionService.User.Id = x), Arg.Do<string>(x => listPosts = x)).Returns(expectedCommand);
        //Act
        var actual = await controller.SavePost(postId);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, result);
    }

    [Fact]
    public async Task SavePost_SavePostInList_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var postId = 3963;
        var listPosts = fixture.Create<string>();
        var expected = fixture.Create<UserSession>();
        var expectedCommand = new CommandResult { Code = 1 };
        expected.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expected);
        userService.UpdateUserSavePostAsync(Arg.Do<int>(x => sessionService.User.Id = x), Arg.Do<string>(x => listPosts = x)).Returns(expectedCommand);
        //Act
        var actual = await controller.SavePost(postId);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, result);
    }

    [Fact]
    public async Task ListSavedPosts_WhenIsNotAuthenticate_RedirectHomePage()
    {
        // Arrange
        var controller = GetController();
        fixture.Create<int>();
        //Act
        var actual = await controller.ListSavedPosts();

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal(Constants.HomepageUrl, viewResult.Url);
    }

    [Fact]
    public async Task ListSavedPosts_FistSavePost_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var listPosts = fixture.Create<string>();
        var expected = fixture.Create<UserSession>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        expected.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"}]";
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expected);
        postService.GetSavedPostsByUserID(Arg.Do<string>(x => listPosts = x)).Returns(expectedPosts);
        //Act
        var result = await controller.ListSavedPosts();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SavedPostViewModel>(viewResult.Model);
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expected, viewModel.User);
    }

    [Fact]
    public async Task UpdateProfile_WhenIsNotAuthenticate_RedirectHomePage()
    {
        // Arrange
        var controller = GetController();
        var type = fixture.Create<string>();
        var value = fixture.Create<string>();
        //Act
        var actual = await controller.UpdateProfile(type, value);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal(Constants.HomepageUrl, viewResult.Url);
    }

    [Theory]
    [InlineData(ProfileUpdateType.Phone, "phone")]
    [InlineData(ProfileUpdateType.Name, "name")]
    [InlineData(ProfileUpdateType.Gender, "name")]
    [InlineData(ProfileUpdateType.IsSubscribe, "1")]
    public async Task UpdateProfile_UpdateUserInfo_ReturnExpectedData(string type, string value)
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var expectedUser = fixture.Create<UserSession>();
        var expectedCommand = new CommandResult { Code = 0 };
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expectedUser);
        userService.UpdateUserInfoAsync(Arg.Do<UserSession>(x => expectedUser = x)).Returns(expectedCommand);

        //Act
        var result = await controller.UpdateProfile(type, value);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var command = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, command);
        //Assert.Equal(expectedUser, sessionService.User);
    }

    [Fact]
    public void UpdateProfile_ThrowException_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var type = fixture.Create<string>();
        var value = fixture.Create<string>();
        sessionService.User = fixture.Create<UserSession>();
        var expectedUser = fixture.Create<UserSession>();
        fixture.Create<JsonResult>();
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expectedUser);

        // Act&Assert
        Assert.ThrowsAsync<InvalidOperationException>(() => controller.UpdateProfile(type, value));

    }

    [Fact]
    public async Task UpdateProfilePassword_WrongPassword_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var oldPassword = fixture.Create<string>();
        var newPassword = fixture.Create<string>();
        var expectedUser = fixture.Create<UserSession>();
        fixture.Create<IEnumerable<Post>>();
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expectedUser);
        authService.ComparePassword(Arg.Do<string>(x => oldPassword = x), Arg.Do<string>(x => newPassword = x)).Returns(false);
        //Act
        var actual = await controller.UpdateProfilePassword(oldPassword, newPassword) ;

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.False(result.IsSuccessful);
        Assert.Equal(Constants.WrongPassword, result.Message);
    }

    [Fact]
    public async Task UpdateProfilePassword_UpdateSuccessful_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var oldPassword = fixture.Create<string>();
        var newPassword = fixture.Create<string>();
        var expectedUser = fixture.Create<UserSession>();
        fixture.Create<IEnumerable<Post>>();
        var expectedCommand = new CommandResult { Code = 0 };
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expectedUser);
        authService.ComparePassword(Arg.Do<string>(x => oldPassword = x), Arg.Do<string>(x => newPassword = x)).Returns(true);
        userService.UpdateUserInfoAsync(Arg.Do<UserSession>(x => expectedUser = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.UpdateProfilePassword(oldPassword, newPassword);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, result);
        Assert.Equal(sessionService.User, expectedUser);
    }

    [Fact]
    public async Task UpdateProfilePassword_UpdateFailed_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var oldPassword = fixture.Create<string>();
        var newPassword = fixture.Create<string>();
        var expectedUser = fixture.Create<UserSession>();
        fixture.Create<IEnumerable<Post>>();
        var expectedCommand = new CommandResult { Code = 1 };
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expectedUser);
        authService.ComparePassword(Arg.Do<string>(x => oldPassword = x), Arg.Do<string>(x => newPassword = x)).Returns(true);
        userService.UpdateUserInfoAsync(Arg.Do<UserSession>(x => expectedUser = x)).Returns(expectedCommand);

        //Act
        var actual = await controller.UpdateProfilePassword(oldPassword, newPassword);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, result);
    }

    [Fact]
    public async Task SocialDisconnect_Successful_ReturnExpectedCommandResult()
    {
        // Arrange
        var controller = GetController();
        controller.TempData = new TempDataDictionary(new DefaultHttpContext(), Substitute.For<ITempDataProvider>());
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                RequestServices = MockServiceProvider()
            }
        };
        sessionService.User = fixture.Create<UserSession>();
        sessionService.User.Password = null;
        var userId = fixture.Create<int>();
        var type = fixture.Create<string>();
        var expectedCommand = new CommandResult { Code = 0, Message = "" };
        userService.DisconnectLoginTypeAsync(Arg.Do<int>(x => userId = x), Arg.Do<string>(x => type = x)).Returns(expectedCommand);
        //Act
        var actual = await controller.SocialDisconnect(userId, type);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, result);
    }

    [Fact]
    public async Task SocialDisconnect_Failed_ReturnExpectedCommandResult()
    {
        // Arrange
        var controller = GetController();
        var userId = fixture.Create<int>();
        var type = fixture.Create<string>();
        var expectedCommand = new CommandResult { Code = 0};
        userService.DisconnectLoginTypeAsync(Arg.Do<int>(x => userId = x), Arg.Do<string>(x => type = x)).Returns(expectedCommand);
        //Act
        var actual = await controller.SocialDisconnect(userId, type);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, result);
    }

    [Fact]
    public void ConfirmUnsubscribe_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var userId = fixture.Create<int>();
        var token = fixture.Create<string>();
        //Act
        var actual = controller.ConfirmUnsubscribe(userId, token);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<UnsubscribeViewModel>(viewResult.Model);
        Assert.Equal(userId, viewModel.UserId);
        Assert.Equal(token, viewModel.Token);
    }

    [Fact]
    public async Task Unsubscribe_Called_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var userId = fixture.Create<int>();
        var token = fixture.Create<string>();
        var expectedCommand = fixture.Create<CommandResult>();
        userService.UnSubcriteUserAsync(Arg.Do<int>(x => userId = x), Arg.Do<string>(x => token = x)).Returns(expectedCommand);
        //Act
        var actual = await controller.Unsubscribe(userId, token);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<bool>(viewResult.Model);
        Assert.Equal(expectedCommand.IsSuccessful, viewModel);
    }

    [Fact]
    public async Task VerifySendEmailLink_VerifySuccessful_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var returnUrl = fixture.Create<string>();
        var token = fixture.Create<string>();
        var param = fixture.Create<VerifyTokenEmailDetailCommand>();
        var expectedCommand = new CommandResult { Code = 0 };
        emailService.VerifyTokenEmailDetailAsync(Arg.Do<VerifyTokenEmailDetailCommand>(x => param = x)).Returns(expectedCommand);
        //Act
        var actual = await controller.VerifySendEmailLink(returnUrl, token);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal(returnUrl, viewResult.Url);
    }

    [Fact]
    public async Task VerifySendEmailLink_VerifyFailed_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var returnUrl = fixture.Create<string>();
        var token = fixture.Create<string>();
        var param = fixture.Create<VerifyTokenEmailDetailCommand>();
        var expectedCommand = new CommandResult { Code = 1 };
        emailService.VerifyTokenEmailDetailAsync(Arg.Do<VerifyTokenEmailDetailCommand>(x => param = x)).Returns(expectedCommand);
        //Act
        var actual = await controller.VerifySendEmailLink(returnUrl, token);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        Assert.Equal(Constants.NotfoundView, viewResult.ViewName);
    }

    [Fact]
    public async Task VerifySendEmailLink_tokenIsEmpty_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var returnUrl = fixture.Create<string>();
        var token = "";
        //Act
        var actual = await controller.VerifySendEmailLink(returnUrl, token);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(actual);
        Assert.Equal(returnUrl, viewResult.Url);
    }

    #region Helpers
    private ProfileController GetController()
    {
        userService = Substitute.For<IUserService>();
        sessionService = Substitute.For<ISessionService>();
        postService = Substitute.For<IPostService>();
        authService = Substitute.For<IAuthService>();
        pathService = Substitute.For<IPathService>();
        emailService = Substitute.For<IEmailService>();
        var controller = new ProfileController(userService, sessionService, postService, authService, pathService, emailService);

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