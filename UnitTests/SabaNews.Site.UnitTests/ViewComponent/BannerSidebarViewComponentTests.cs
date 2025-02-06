namespace SabaNews.Site.UnitTests.ViewComponent;

using AutoFixture;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using NSubstitute;
using SabaNews.Models.Banner;
using SabaNews.Services.Interfaces;
using System.Threading.Tasks;
using Views.Shared.Components.BannerSidebar;
using Xunit;

public class BannerSidebarViewComponentTests
{
    private IDataControlService dataControlService;

    [Fact]
    public async Task InvokeAsync_WhenCalled_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        var expectedBanner = fixture.Create<BannerModel>();
        dataControlService.GetBannerData().Returns(expectedBanner);
        //Act
        var actual = await component.InvokeAsync();

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<BannerModel>(viewResult.ViewData.Model);
        Assert.Equal(expectedBanner, viewModel);
    }

    #region Helpers
    private BannerSidebarViewComponent GetViewComponent()
    {
        dataControlService = Substitute.For<IDataControlService>();

        var component = new BannerSidebarViewComponent(dataControlService);

        return component;
    }

    #endregion Helpers
}