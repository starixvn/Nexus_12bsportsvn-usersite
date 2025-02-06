namespace SabaNews.Site.UnitTests.ViewComponent;

using System.Threading.Tasks;
using System.Collections.Generic;
using Xunit;
using AutoFixture;
using SabaNews.Models.Posts;
using NSubstitute;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using SabaNews.Criteria.Posts;
using SabaNews.Site.Views.Event.WorldCup2022.RelatedPosts;
using Services.Interfaces;

public class RelatedPostsWCViewComponentTests
{
    private IPostService postService;


    [Fact]
    public async Task InvokeAsync_WhenNotHavePostInList_ReturnExpectedViewResult()
    {
        //Arrange
        var component = GetViewComponent();
        var fixture = new Fixture();
        var postId = 50;
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
        var actual = await component.InvokeAsync(postId);

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
        var actual = await component.InvokeAsync(postId);

        //Assert
        var viewResult = Assert.IsType<ViewViewComponentResult>(actual);
        expected.RemoveAt(4);
        Assert.Equal(expected, viewResult.ViewData.Model);
    }

    #region Helpers
    private RelatedPostsWCViewComponent GetViewComponent()
    {
        postService = Substitute.For<IPostService>();

        var component = new RelatedPostsWCViewComponent(postService);

        return component;
    }

    #endregion Helpers
}