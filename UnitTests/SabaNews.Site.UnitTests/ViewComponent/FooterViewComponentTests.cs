namespace SabaNews.Site.UnitTests.ViewComponent;

using AutoFixture;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using NSubstitute;
using SabaNews.Models;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Views.Shared.Components.Footer;
using Xunit;

public class FooterViewComponentTests
{
    private IDataControlService dataControlService;

    [Fact]
    public async Task InvokeAsync_WhenCalled_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        var expectedMenu = fixture.Create<IEnumerable<Menu>>();
        dataControlService.GetMenuData().Returns(expectedMenu);
        //Act
        var actual = await component.InvokeAsync();

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        Assert.Equal(expectedMenu, viewResult.ViewData.Model);
    }

    #region Helpers
    private FooterViewComponent GetViewComponent()
    {
        dataControlService = Substitute.For<IDataControlService>();

        var component = new FooterViewComponent(dataControlService);

        return component;
    }

    #endregion Helpers
}