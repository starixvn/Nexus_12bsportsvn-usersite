
namespace SabaNews.Site.UnitTests.ViewComponent;

using Microsoft.AspNetCore.Mvc.ViewComponents;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models;
using SabaNews.Site.Views.Shared.Components.Header;
using System.Threading.Tasks;
using Xunit;

public class HeaderViewComponentTests
{
    private ISessionService sessionService;

    [Fact]
    public async Task InvokeAsync_IsNotAuthenticate_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        //Act
        var actual = await component.InvokeAsync();
        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<TopHeaderViewModel>(viewResult.ViewData.Model);
        Assert.False(viewModel.IsAdmin);
    }

    [Fact]
    public async Task InvokeAsync_IsAdmin_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        sessionService.User = new UserSession { Id = 1, Metadata = "administratorUser" };
        //Act
        var actual = await component.InvokeAsync();
        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<TopHeaderViewModel>(viewResult.ViewData.Model);
        Assert.True(viewModel.IsAdmin);
    }

    #region Helpers
    private HeaderViewComponent GetViewComponent()
    {
        sessionService = Substitute.For<ISessionService>();
        var component = new HeaderViewComponent(sessionService);

        return component;
    }

    #endregion Helpers
}