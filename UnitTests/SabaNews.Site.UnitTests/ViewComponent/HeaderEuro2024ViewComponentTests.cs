namespace SabaNews.Site.UnitTests.ViewComponent;

using Microsoft.AspNetCore.Mvc.ViewComponents;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models;
using SabaNews.Site.Views.Shared.Components.HeaderEuro2024;
using Xunit;

public class HeaderEuro2024ViewComponentTests
{
    private ISessionService sessionService;

    [Fact]
    public void InvokeAsync_IsNotAuthenticate_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        //Act
        var actual = component.Invoke();
        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<TopHeaderViewModel>(viewResult.ViewData.Model);
        Assert.False(viewModel.IsAdmin);
    }

    [Fact]
    public void InvokeAsync_IsAdmin_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        sessionService.User = new UserSession { Id = 1, Metadata = "administratorUser" };
        //Act
        var actual = component.Invoke();
        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<TopHeaderViewModel>(viewResult.ViewData.Model);
        Assert.True(viewModel.IsAdmin);
    }

    #region Helpers
    private HeaderEuro2024ViewComponent GetViewComponent()
    {
        sessionService = Substitute.For<ISessionService>();
        var component = new HeaderEuro2024ViewComponent(sessionService);

        return component;
    }

    #endregion Helpers
}