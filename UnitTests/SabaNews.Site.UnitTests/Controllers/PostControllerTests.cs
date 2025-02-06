namespace SabaNews.Site.UnitTests.Controllers;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using SabaNews.Core.Services;
using SabaNews.Models.Posts;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Controllers;
using System.Threading.Tasks;
using Xunit;
using SabaNews.Core.Constants;
using System.Collections.Generic;
using SabaNews.Core.Models;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Criteria.Poll;
using SabaNews.Models.ViewModel.Poll;
using Microsoft.AspNetCore.Http;
using System.Net;
using SabaNews.Models.Banner;
using SabaNews.Models.Categories;
using Microsoft.AspNetCore.Mvc.Routing;
using SabaNews.Criteria.Posts;
using System.Linq;
using SabaNews.Livescore.Models.Match;

public class PostControllerTests : Controller
{
    private IPostService postService;
    private IConfiguration configuration;
    private ISessionService sessionService;
    private IPollService pollService;
    private IDataControlService dataControlService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task Single_WhenSlugContainHtmlAndNotHaveId_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet.html";

        //Act
        var result = await controller.Single(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Single_WhenSlugNotContainHtmlAndPostIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet.html";
        Post expected = null;

        postService.GetPostDetailSummaryAsync(Arg.Do<string>(x => x = slug)).Returns(expected);

        //Act
        var result = await controller.Single(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Single_WhenPostSlugIsNotSame_RedirectExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet-123.html";
        var postId = fixture.Create<long>();
        fixture.Create<string>();
        var expected = fixture.Create<Post>();
        expected.Slug = "test";

        postService.GetPostDetailAsync(Arg.Do<long>(x => x = postId)).Returns(expected);

        //Act
        var result = await controller.Single(slug);

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Post", redirectResult.ControllerName);
        Assert.Equal("Single", redirectResult.ActionName);
    }

    [Fact]
    public async Task Single_WhenSlugNotContainHtmlAndPostHaveData_RedirectExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet-123";
        fixture.Create<string>();
        var expected = fixture.Create<Post>();

        postService.GetPostDetailSummaryAsync(Arg.Do<string>(x => x = slug)).Returns(expected);

        //Act
        var result = await controller.Single(slug);

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Post", redirectResult.ControllerName);
        Assert.Equal("Single", redirectResult.ActionName);
    }

    [Fact]
    public async Task Single_WhenPostIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet-123.html";
        var postId = fixture.Create<long>();
        Post expected = null;

        postService.GetPostDetailAsync(Arg.Do<long>(x => x = postId)).Returns(expected);

        //Act
        var result = await controller.Single(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }
        

    [Fact]
    public async Task Single_WhenAuthencated_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var slug = "bai-viet-123.html";
        var postId = fixture.Create<long>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.Slug = "bai-viet";
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 2, Slug = "bong-da" }
        };
        var expectedUser = fixture.Create<UserSession>();
        expectedUser.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";
        sessionService.User = expectedUser;
        postService.GetPostDetailAsync(Arg.Do<long>(x => x = postId)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);

        //Act
        var result = await controller.Single(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.Null(viewModel.ViewData);
    }

    [Fact]
    public async Task Single_WhenIsVideoPost_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var slug = "bai-viet-123.html";
        var postId = fixture.Create<long>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.Slug = "bai-viet";
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 2, Slug = "video" }
        };
        sessionService.User = null;
        expected.Type = Constants.VideoPostType;
        postService.GetPostDetailAsync(Arg.Do<long>(x => x = postId)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);

        //Act
        var result = await controller.Single(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.True(viewModel.IsVideo);
    }

    [Fact]
    public async Task Single_PostInSubCategory_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var slug = "bai-viet-123.html";
        var postId = fixture.Create<long>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.Slug = "bai-viet";
        expected.CatesName = "schedule,transfer";
        expected.CategoriesSlug = $"{ Constants.MatchScheduleSlug }, { Constants.TransferSlug}";
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 2, Slug = Constants.MatchScheduleSlug }
        };
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = null;
        expectedUser.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";
            
        postService.GetPostDetailAsync(Arg.Do<long>(x => x = postId)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);

        //Act
        var result = await controller.Single(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.Equal(Constants.MatchScheduleSlug, viewModel.CateInfo.Slug);
    }

    [Fact]
    public async Task Single_PostInGeneralCategory_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var slug = "bai-viet-123.html";
        var postId = fixture.Create<long>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.Slug = "bai-viet";
        expected.CatesName = "bong-da";
        expected.CategoriesSlug = "bong-da";
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 1, Slug = "bong-da" }
        };
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = null;
        expected.CatesName = $"{ Constants.Football }, { Constants.Video}";
        expected.CategoriesSlug = $"{ Constants.FootballSlug }, { Constants.VideoSlug}";
        expectedUser.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";
        postService.GetPostDetailAsync(Arg.Do<long>(x => x = postId)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);

        //Act
        var result = await controller.Single(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.Equal(Constants.FootballSlug, viewModel.CateInfo.Slug);
    }



    [Fact]
    public async Task GetPollData_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Headers["x-forwarded-for"] = fixture.Create<string>();
        var questId = fixture.Create<int>();
        var themeId = fixture.Create<int>();
        var criteria = fixture.Create<GetPollDetailCriteria>();
        var expected = fixture.Create<PollViewModel>();
        fixture.Create<IEnumerable<Post>>();
           
        pollService.GetPollDetailAsync(Arg.Do<GetPollDetailCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var result = await controller.GetPollData(questId, themeId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.IsType<PollViewModel>(viewResult.Model);
        Assert.Equal("_Poll", viewResult.ViewName);
        Assert.Equal(questId, criteria.QuestId);
        Assert.Equal(themeId, criteria.ThemeId);
    }

    [Fact]
    public async Task VotePoll_WhenVoteSuccessful_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController(false);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Headers["x-forwarded-for"] = "";
        controller.ControllerContext.HttpContext.Connection.RemoteIpAddress = fixture.Create<IPAddress>();
        var questId = fixture.Create<int>();
        var answerId = fixture.Create<int>();
        var themeId = fixture.Create<int>();
        var clientIp = fixture.Create<string>();
        var criteria = fixture.Create<GetPollDetailCriteria>();
        var expected = new CommandResult { Code = 0 };
        fixture.Create<IEnumerable<Post>>();

        fixture.Create<GetPollDetailCriteria>();
        var expectedPoll = fixture.Create<PollViewModel>();
           
        pollService.GetPollDetailAsync(Arg.Do<GetPollDetailCriteria>(x => criteria = x)).Returns(expectedPoll);

        pollService.VotePollAsync(Arg.Do<int>(x => questId = x), Arg.Do<int>(x => answerId = x), Arg.Do<string>(x => clientIp = x)).Returns(expected);

        //Act
        await controller.VotePoll(questId, answerId, themeId);

        // Assert
        Assert.True(expected.IsSuccessful);
    }

    [Fact]
    public async Task GetSameCategoryPosts_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postId = fixture.Create<long>();
        var criteria = fixture.Create<GetPostsByCateSlugPagingCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();

        postService.GetPostsByCateSlugPagingAsync(Arg.Do<GetPostsByCateSlugPagingCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var result = await controller.GetPostsSameCategory(slug, postId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsType<List<Post>>(viewResult.Model);
        Assert.Equal("_SameCategory", viewResult.ViewName);
        Assert.Equal(viewModel, expected.ToList());
    }

    [Fact]
    public async Task VotePoll_WhenVoteFailed_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Headers["x-forwarded-for"] = "";
        controller.ControllerContext.HttpContext.Connection.RemoteIpAddress = fixture.Create<IPAddress>();
        var questId = fixture.Create<int>();
        var answerId = fixture.Create<int>();
        var themeId = fixture.Create<int>();
        var clientIp = fixture.Create<string>();
        var expected = new CommandResult { Code = 1 };
        fixture.Create<IEnumerable<Post>>();

        pollService.VotePollAsync(Arg.Do<int>(x => questId = x), Arg.Do<int>(x => answerId = x), Arg.Do<string>(x => clientIp = x)).Returns(expected);

        //Act
        var result = await controller.VotePoll(questId, answerId, themeId);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expected, template);
    }

    [Fact]
    public async Task ViewVideo_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var expected = fixture.Create<CommandResult>();
        fixture.Create<IEnumerable<Post>>();

        postService.UpdateVideoView(Arg.Do<int>(x => postId = x)).Returns(expected);

        //Act
        var result = await controller.ViewVideo(postId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expected, okResult.Value);
    }

    [Fact]
    public async Task UpdatePostView_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var isVideo = false;
        var expected = fixture.Create<CommandResult>();
        fixture.Create<IEnumerable<Post>>();

        postService.UpdateViewAsync(Arg.Do<int>(x => postId = x), Arg.Do<bool>(x => isVideo = x)).Returns(expected);

        //Act
        var result = await controller.UpdatePostView(postId, isVideo);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expected, okResult.Value);
    }

    [Fact]
    public void GetRelatedPosts_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var slug = fixture.Create<string>();
        var title = fixture.Create<string>();

        //Act
        var result = controller.GetRelatedPosts(slug, postId, title);

        // Assert
        Assert.IsType<ViewComponentResult>(result);
    }

    [Fact]
    public void GetSidebarPosts_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var slug = fixture.Create<string>();
        var limitItem = 5;

        //Act
        var result = controller.GetSidebarPosts(slug, postId, limitItem);

        // Assert
        Assert.IsType<ViewComponentResult>(result);
    }

    [Fact]
    public async Task GetBanner_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<BannerModel>();

        dataControlService.GetBannerData().Returns(expected);

        //Act
        var result = await controller.GetBanner();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expected, okResult.Value);
    }

    [Fact]
    public async Task GetLastestNews_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        fixture.Create<GetRecentPostsParam>();
        var expectedRecentPosts = fixture.Create<IEnumerable<Post>>();

        dataControlService.GetRecentPostsAsync().Returns(expectedRecentPosts);

        //Act
        var result = await controller.GetLastestNews();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedRecentPosts, okResult.Value);
    }

    [Fact]
    public async Task GetTodayFixturePost_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<GetPostsByTagCriteria>();
        var expectedRecentPosts = fixture.Create<IEnumerable<Post>>();

        postService.GetPostByTagAsync(Arg.Do<GetPostsByTagCriteria>(x => param = x)).Returns(expectedRecentPosts);

        //Act
        var result = await controller.GetTodayFixturePost();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedRecentPosts, okResult.Value);
    }

    [Fact]
    public async Task GetGuessSidebar_WhenCalled_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<IEnumerable<Post>>();
        var slug = fixture.Create<string>();
        dataControlService.GetCategoryPostsAsync(Arg.Do<string>(x => x = slug)).Returns(expected);
        // Act
        var result = await controller.GetGuessSidebar(slug, 10);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
    }

    [Fact]
    public async Task GetTodayMatches_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expectedMatches = fixture.Create<IList<Match>>();

        dataControlService.GetTodayMatches().Returns(expectedMatches);

        //Act
        var result = await controller.GetTodayMatches();

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(expectedMatches, actual);
    }

    #region Helpers
    private PostController GetController(bool enabledCache = true)
    {   var inMemorySettings = new Dictionary<string, string> {
            {"IsEnabledUseFanexCaching", $"{enabledCache}"}
        };
        configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        pollService = Substitute.For<IPollService>();
        postService = Substitute.For<IPostService>();
        sessionService = Substitute.For<ISessionService>();
        dataControlService = Substitute.For<IDataControlService>(); 
             
        var controller = new PostController(postService, configuration, sessionService, pollService, dataControlService);

        return controller;
    }

    private void GetDefaultContext(PostController controller)
    {
        var urlHelperMock = Substitute.For<IUrlHelper>();
        controller.Url = urlHelperMock;
        urlHelperMock.Action(Arg.Any<UrlActionContext>()).Returns("url");
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
    }
    #endregion Helpers
}