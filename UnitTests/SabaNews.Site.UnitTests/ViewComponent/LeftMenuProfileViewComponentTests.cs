namespace SabaNews.Site.UnitTests.ViewComponent;

using AutoFixture;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Views.Shared.Components.LeftMenuProfile;
using System.Threading.Tasks;
using Xunit;
using SabaNews.Core.Constants;

public class LeftMenuProfileViewComponentTests
{
    private ISessionService sessionService;
    private IUserService userService;

    [Fact]
    public async Task InvokeAsync_WhenCalled_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        sessionService.User = new UserSession { Id = 1, Metadata = "customerUser" };
        var page = fixture.Create<string>();
        var expected = fixture.Create<UserSession>();
        userService.GetUserByIdAsync(Arg.Do<int>(x => sessionService.User.Id = x)).Returns(expected);

        //Act
        var actual = await component.InvokeAsync(page);

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<UserSession>(viewResult.ViewData.Model);
        Assert.Equal(expected, viewModel);
        Assert.Equal(Constants.CustomerRole, sessionService.User.Role);
    }
    #region Helpers
    private LeftMenuProfileViewComponent GetViewComponent()
    {
        userService = Substitute.For<IUserService>();
        sessionService = Substitute.For<ISessionService>();
        var component = new LeftMenuProfileViewComponent(sessionService, userService);

        return component;
    }

    #endregion Helpers
}