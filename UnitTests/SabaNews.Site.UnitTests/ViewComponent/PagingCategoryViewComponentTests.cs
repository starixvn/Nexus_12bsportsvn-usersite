namespace SabaNews.Site.UnitTests.ViewComponent;

using AutoFixture;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using SabaNews.Core.Models;
using Views.Shared.Components.PagingCategory;
using Xunit;

public class PagingCategoryViewComponentTests
{
    [Fact]
    public void InvokeAsync_IsAuthenticatedAndIsAdmin_ReturnExpectedViewResult()
    {
        //Arrange
        var fixture = new Fixture();
        var param = fixture.Create<PagingModel>();
        var component = new PagingCategoryViewComponent();
        //Act
        var actual = component.Invoke(param);

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        var viewModel = Assert.IsType<PagingModel>(viewResult.ViewData.Model);
        Assert.Equal(param, viewModel);
    }
}