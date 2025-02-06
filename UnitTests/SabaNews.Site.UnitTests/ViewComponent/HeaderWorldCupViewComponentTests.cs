namespace SabaNews.Site.UnitTests.ViewComponent;

using Microsoft.AspNetCore.Mvc.ViewComponents;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models;
using SabaNews.Site.Views.Shared.Components.HeaderWorldCup;
using Xunit;

public class HeaderWorldCupViewComponentTests
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
    private HeaderWorldCupViewComponent GetViewComponent()
    {
        sessionService = Substitute.For<ISessionService>();
        var component = new HeaderWorldCupViewComponent(sessionService);

        return component;
    }

    #endregion Helpers
}