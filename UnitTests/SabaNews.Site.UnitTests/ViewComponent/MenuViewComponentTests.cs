namespace SabaNews.Site.UnitTests.ViewComponent;

using AutoFixture;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using SabaNews.Core.Constants;
using Views.Shared.Components.Menu;

public class MenuViewComponentTests
{
    private IDataControlService dataControlService;
    private ISessionService sessionService;

    [Fact]
    public async Task InvokeAsync_IsNotAuthenticate_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        var cateSlug = fixture.Create<string>();
        var page = fixture.Create<string>();
        var expectedMenu = fixture.Create<IEnumerable<Menu>>();
        dataControlService.GetMenuData().Returns(expectedMenu);

        //Act
        var actual = await component.InvokeAsync(cateSlug, page);

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<MenuViewModel>(viewResult.ViewData.Model);
        Assert.Equal(expectedMenu, viewModel.Menus);
        Assert.False(viewModel.IsAdmin);
        Assert.Null(viewModel.UserUgent);
    }

    [Fact]
    public async Task InvokeAsync_IsAuthenticatedAndNotIsAdmin_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        sessionService.User = fixture.Create<UserSession>();
        var cateSlug = fixture.Create<string>();
        var page = fixture.Create<string>();
        var expectedMenu = fixture.Create<IEnumerable<Menu>>();
        dataControlService.GetMenuData().Returns(expectedMenu);

        //Act
        var actual = await component.InvokeAsync(cateSlug, page);

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<MenuViewModel>(viewResult.ViewData.Model);
        Assert.Equal(expectedMenu, viewModel.Menus);
        Assert.False(viewModel.IsAdmin);
        Assert.Equal(Constants.CustomerRole, sessionService.User.Role);
    }

    [Fact]
    public async Task InvokeAsync_IsAuthenticatedAndIsAdmin_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        sessionService.User = new UserSession { Id = 1, Metadata = "administratoruser" };
        var cateSlug = fixture.Create<string>();
        var page = fixture.Create<string>();
        var expectedMenu = fixture.Create<IEnumerable<Menu>>();
        dataControlService.GetMenuData().Returns(expectedMenu);

        //Act
        var actual = await component.InvokeAsync(cateSlug, page);

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<MenuViewModel>(viewResult.ViewData.Model);
        Assert.Equal(expectedMenu, viewModel.Menus);
        Assert.True(viewModel.IsAdmin);
        Assert.Equal(Constants.AdministratorRole, sessionService.User.Role);
    }

    #region Helpers
    private MenuViewComponent GetViewComponent()
    {
        dataControlService = Substitute.For<IDataControlService>();
        sessionService = Substitute.For<ISessionService>();
        var component = new MenuViewComponent(dataControlService, sessionService);

        return component;
    }

    #endregion Helpers
}