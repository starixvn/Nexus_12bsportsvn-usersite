
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
using Views.Shared.Components.HeaderEvent;
using Xunit;

public class HeaderEventViewComponentTests
{
    private IDataControlService dataControlService;
    private ISessionService sessionService;

    [Fact]
    public async Task InvokeAsync_IsNotAuthenticate_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        var page = fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<Menu>>();
        dataControlService.GetMenuData().Returns(expected);
        //Act
        var actual = await component.InvokeAsync(page);
        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<MenuViewModel>(viewResult.ViewData.Model);
        Assert.Equal(expected, viewModel.Menus);
        Assert.False(viewModel.IsAdmin);
    }

    [Fact]
    public async Task InvokeAsync_IsAdmin_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        sessionService.User = new UserSession { Id = 1, Metadata = "administratorUser" };
        var page = fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<Menu>>();
        dataControlService.GetMenuData().Returns(expected);
        //Act
        var actual = await component.InvokeAsync(page);
        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<MenuViewModel>(viewResult.ViewData.Model);
        Assert.Equal(expected, viewModel.Menus);
        Assert.True(viewModel.IsAdmin);
    }

    #region Helpers
    private HeaderEventViewComponent GetViewComponent()
    {
        dataControlService = Substitute.For<IDataControlService>();
        sessionService = Substitute.For<ISessionService>();
        var component = new HeaderEventViewComponent(dataControlService, sessionService);

        return component;
    }

    #endregion Helpers
}