using AutoFixture;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Site.Controllers.SupportAPITW;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace SabaNews.Site.UnitTests.Controllers.SupportAPITW;

using Services.Interfaces;

public class APIGetPostControllerTests : Controller
{
    private IPostService postService;
    private ICacheWrapperService cacheService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task GetPostList_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<GetDataViewModel>();
        var expectedPosts = fixture.Create<IList<GetData>>();
        var cacheKey =
            $"{CacheKey.GetPostList}{param.LastTimestamp}{param.Category}{param.Subject}{param.StartItem + " - " + param.RowLimit}";
        param.RowLimit = 100;
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Headers["Token"] = Constants.TokenAPIGetData;

        postService.GetPostlist(Arg.Do<GetDataViewModel>(x => param = x)).Returns(expectedPosts);
        cacheService.GetAsync<IList<GetData>>(Arg.Do<string>(x => x = cacheKey)).Returns(expectedPosts);
        //Act
        var result = await controller.GetPostList(param);

        // Assert
        var okResult = Assert.IsType<JsonResult>(result);
        var posts = Assert.IsAssignableFrom<IList<GetData>>(okResult.Value);
        Assert.Equal(expectedPosts, posts);
    }

    [Fact]
    public async Task GetDetailContent_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<GetDataViewModel>();
        var expectedPosts = fixture.Create<ApiPostDetailModel>();
        var cacheKey = $"{CacheKey.GetPostDetailContent}{param.PostId}";

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Headers["Token"] = Constants.TokenAPIGetData;

        postService.GetPostDetailContent(Arg.Do<GetDataViewModel>(x => param = x)).Returns(expectedPosts);
        cacheService.GetAsync<ApiPostDetailModel>(Arg.Do<string>(x => x = cacheKey)).Returns(expectedPosts);
        //Act
        var result = await controller.GetDetailContent(param);

        // Assert
        var okResult = Assert.IsType<JsonResult>(result);
        var posts = Assert.IsAssignableFrom<ApiPostDetailModel>(okResult.Value);
        Assert.Equal(expectedPosts, posts);
    }

    [Fact]
    public async Task GetDeletedList_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<ApiDeleteListModel>();
        var expectedPosts = fixture.Create<List<long>>();
        var cacheKey = CacheKey.GetPostDeletedList;

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Headers["Token"] = Constants.TokenAPIGetData;

        postService.GetDeletedList(Arg.Do<ApiDeleteListModel>(x => param = x)).Returns(expectedPosts);
        cacheService.GetAsync<List<long>>(Arg.Do<string>(x => x = cacheKey)).Returns(expectedPosts);
        //Act
        var result = await controller.GetDeletedList(param);

        // Assert
        var okResult = Assert.IsType<JsonResult>(result);
        var posts = Assert.IsAssignableFrom<List<long>>(okResult.Value);
        Assert.Equal(expectedPosts, posts);
    }

    #region Helpers
    private APIGetPostController GetController(bool enabledCache = true)
    {
        var cacheConfigs = new LivescoreMainPageCacheConfig
        {
            Enabled = enabledCache,
            DateRange = 2,
            OutOfRangeTimeout = 5
        };
        var options = Substitute.For<IOptionsSnapshot<LivescoreMainPageCacheConfig>>();
        options.Value.Returns(cacheConfigs);
        postService = Substitute.For<IPostService>();
        cacheService = Substitute.For<ICacheWrapperService>();
        var controller = new APIGetPostController(postService, options, cacheService);

        return controller;
    }
    #endregion Helpers
}