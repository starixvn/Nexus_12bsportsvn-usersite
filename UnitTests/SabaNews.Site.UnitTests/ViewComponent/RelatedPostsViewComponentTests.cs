namespace SabaNews.Site.UnitTests.ViewComponent;

using AutoFixture;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using NSubstitute;
using SabaNews.Criteria.Posts;
using SabaNews.Models.Posts;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Views.Shared.Components.RelatedPosts;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class RelatedPostsViewComponentTests
{
    private IPostService postService;
    private IDataControlService dataControlService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task InvokeAsync_SlugIsEmpty_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var postId = fixture.Create<int>();
        var slug = "";

        var expected = fixture.Create<IEnumerable<Post>>();
        dataControlService.GetRecentPostsAsync().Returns(expected);

        //Act
        var actual = await component.InvokeAsync(postId, "title", slug);

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        Assert.Equal(expected, viewResult.ViewData.Model);
    }

    [Fact]
    public async Task InvokeAsync_WhenNotHavePostInList_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        var postId = 50;
        var slug = fixture.Create<string>();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        model._End = 3;
        var expected = new List<Post>
        {
            new() { ID = 1 },
            new() { ID = 2 },
            new() { ID = 3 },
            new() { ID = 4 },
            new() { ID = 5 },
            new() { ID = 6 },
            new() { ID = 7 },
            new() { ID = 8 },
            new() { ID = 9 },
            new() { ID = 10 },
            new() { ID = 11 }
        };
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expected);

        //Act
        var actual = await component.InvokeAsync(postId, "title", slug);

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        expected.RemoveAt(10);
        Assert.Equal(expected, viewResult.ViewData.Model);
    }

    [Fact]
    public async Task InvokeAsync_WhenHavePostInList_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        var postId = 5;
        var slug = fixture.Create<string>();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        model._End = 3;
        var expected = new List<Post>
        {
            new() { ID = 1 },
            new() { ID = 2 },
            new() { ID = 3 },
            new() { ID = 4 },
            new() { ID = 5 },
            new() { ID = 6 },
            new() { ID = 7 },
            new() { ID = 8 },
            new() { ID = 9 },
            new() { ID = 10 },
            new() { ID = 11 }
        };
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expected);

        //Act
        var actual = await component.InvokeAsync(postId, "title", slug);

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        expected.RemoveAt(4);
        Assert.Equal(expected, viewResult.ViewData.Model);
    }

    #region Helpers
    private RelatedPostsViewComponent GetViewComponent()
    {
        postService = Substitute.For<IPostService>();
        dataControlService = Substitute.For<IDataControlService>();
            
        var component = new RelatedPostsViewComponent(postService, dataControlService);

        return component;
    }

    #endregion Helpers
}