namespace SabaNews.Site.UnitTests.Controllers.Event;

using AutoFixture;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Event.WorldCup;
using SabaNews.Criteria.Posts;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Categories;
using SabaNews.Models.Event.WorldCup;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Event.WorldCup;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Controllers.Event;
using SabaNews.Site.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using SabaNews.Livescore.Services.Interfaces;
using Xunit;

public class WorldCup2022ControllerTests : Controller
{
    private IDataControlService dataControlService;
    private IPostService postService;
    private ILeagueService leagueService;
    private IConfiguration configuration;
    private ISessionService sessionService;
    private IUserService userService;
    private IWorldCupService worldcupService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task Index_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expected = new Fixture().Create<WorldCupViewModel>();
        dataControlService.GetWorldCupPageViewModel().Returns(expected);

        //Act
        var result = await controller.Index();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/Index.cshtml", viewResult.ViewName);
        var dataResult = Assert.IsType<WorldCupViewModel>(viewResult.Model);
        Assert.Equal(expected, dataResult);

    }

    [Fact]
    public async Task Index_WhenCateDontHaveSeoData_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expected = new Fixture().Create<WorldCupViewModel>();
        expected.Category.SEOTitle = null;
        dataControlService.GetWorldCupPageViewModel().Returns(expected);

        //Act
        var result = await controller.Index();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/Index.cshtml", viewResult.ViewName);
        var dataResult = Assert.IsType<WorldCupViewModel>(viewResult.Model);
        Assert.Equal(expected, dataResult);

    }

    [Fact]
    public void Fixture_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.Fixture();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/Fixture.cshtml", viewResult.ViewName);

    }

    [Fact]
    public void MatchDetail_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.MatchDetail(10);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/MatchDetail.cshtml", viewResult.ViewName);

    }

    [Fact]
    public async Task StoryPost_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var news = new Fixture().Create<IEnumerable<Post>>();
        var cateSlugCriteria = new Fixture().Create<GetPostsByCateSlugCriteria>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.StoryPost();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/StoryPost.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<LastestNewsViewModel>(viewResult.Model);
        Assert.Equal(news, newsResult.Posts);
    }
    [Fact]
    public async Task StoryPostGrid_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<CategoryPostParams>();
        var news = new Fixture().Create<IEnumerable<Post>>();
        var cateSlugCriteria = new Fixture().Create<GetPostsByCateSlugCriteria>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.GetStoryPostGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/_StoryPost.cshtml", viewResult.ViewName);
        var model = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(news, model);
    }

    [Fact]
    public async Task StoryPostGrid_WhenDataIsEmpty_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<CategoryPostParams>();
        var news = new List<Post>();
        var cateSlugCriteria = new Fixture().Create<GetPostsByCateSlugCriteria>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.GetStoryPostGrid(param);

        // Assert
        var okResult = Assert.IsAssignableFrom<OkObjectResult>(result);
        Assert.False((bool)okResult.Value);
    }

    [Fact]
    public async Task StoryPostDetail_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var urlHelperMock = Substitute.For<IUrlHelper>();
        controller.Url = urlHelperMock;
        urlHelperMock.Action(Arg.Any<UrlActionContext>()).Returns("url");
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        var slug = fixture.Create<string>();
        var story = fixture.Create<Post>();
        story.PostContent = "<figure class=\"wp-block-image size-large\"><img src=\"img\" alt=\"\" class=\"wp-image-3928\"/><figcaption><a href=\"link\">Pic 1</a></figcaption></figure><figure class=\"wp-block-image size-large\"><img src=\"img\" alt=\"\" class=\"wp-image-3928\"/></figure>";
        fixture.Create<GetPostsByCateSlugCriteria>();
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => slug = x), Arg.Do<string>(x => slug = x)).Returns(story);

        //Act
        var result = await controller.StoryPostDetail(slug);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/StoryPostDetail.cshtml", viewResult.ViewName);
        var model = Assert.IsType<StoryPostDetailViewModel>(viewResult.Model);
        Assert.Equal(story, model.Post);

    }

    [Fact]
    public async Task StoryPostDetail_WhenDataIsEmpty_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        Post story = null;
        new Fixture().Create<GetPostsByCateSlugCriteria>();
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => slug = x), Arg.Do<string>(x => slug = x)).Returns(story);

        //Act
        var result = await controller.StoryPostDetail(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);

    }

    [Fact]
    public async Task OverView_WhenPostIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        Post expected = null;

        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);

        //Act
        var result = await controller.Overview();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task OverView_WhenAuthencated_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        var expected = fixture.Create<Post>();
            
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = fixture.Create<UserSession>();
        expectedUser.SavedPosts = null;
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.Overview();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.Null(viewModel.SavePost);
    }


    [Fact]
    public async Task GetLastestNews_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var news = new Fixture().Create<IEnumerable<Post>>();
        var cateSlugCriteria = new Fixture().Create<GetPostsByCateSlugCriteria>(); 
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.LastestNews();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/LastestNewsWC.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<LastestNewsViewModel>(viewResult.Model);
        Assert.Equal(news, newsResult.Posts);

    }
              
    [Fact]
    public async Task GetCommentaryNews_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var news = new Fixture().Create<IEnumerable<Post>>();
        var cateSlugCriteria = new Fixture().Create<GetPostsByCateSlugCriteria>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.CommentaryNews();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/LastestNewsWC.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<LastestNewsViewModel>(viewResult.Model);
        Assert.Equal(news, newsResult.Posts);

    }

    [Fact]
    public async Task GetVideo_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var news = new Fixture().Create<IEnumerable<Post>>();
        var cateSlugCriteria = new Fixture().Create<GetPostsByCateSlugCriteria>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.Video();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/Video.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<VideoViewModel>(viewResult.Model);
        Assert.Equal(news, newsResult.Videos);
    }

    [Fact]
    public async Task GetStanding_WhenCurrentStageIsGroup_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var leagueID = WorldCup2022.LeagueIdWorldCup2022;
        var league = new Fixture().Create<League>();
        league.CurrentStageId = WorldCup2022.GroupStageId;
        var news = new Fixture().Create<IList<SeasonStandings>>();
        var cateSlugCriteria = new Fixture().Create<GetLeagueSeasonStandingCriteria>();
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => cateSlugCriteria = x)).Returns(news);
        leagueService.GetLeagueByIdAsync(Arg.Do<long>(x => leagueID = x)).Returns(league);
        //Act
        var result = await controller.Standing();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/DetailStanding.cshtml", viewResult.ViewName);
        var model = Assert.IsType<StandingDetailViewModel>(viewResult.Model);
        Assert.False(model.IsKnockoutStage);
    }

    [Fact]
    public async Task GetStanding_WhenCurrentStageIsKnockout_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var leagueID = WorldCup2022.LeagueIdWorldCup2022;
        var league = new Fixture().Create<League>();
        league.CurrentStageId = 30538;
        var news = new Fixture().Create<IList<SeasonStandings>>();
        var cateSlugCriteria = new Fixture().Create<GetLeagueSeasonStandingCriteria>();
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => cateSlugCriteria = x)).Returns(news);
        leagueService.GetLeagueByIdAsync(Arg.Do<long>(x => leagueID = x)).Returns(league);
        //Act
        var result = await controller.Standing();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/DetailStanding.cshtml", viewResult.ViewName);
        var model = Assert.IsType<StandingDetailViewModel>(viewResult.Model);
        Assert.True(model.IsKnockoutStage);
    }

    [Fact]
    public async Task GetNewsGrid_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = new Fixture().Create<CategoryPostParams>();
        var news = new Fixture().Create<IEnumerable<Post>>();
        var cateSlugCriteria = new Fixture().Create<GetPostsByCateSlugCriteria>();

        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.GetNewsGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal(
            !param.IsVideo
                ? "~/Views/Event/WorldCup2022/_NewsGridView.cshtml"
                : "~/Views/Event/WorldCup2022/_VideoGridView.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetStandings_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var standings = new Fixture().Create<IList<SeasonStandings>>();
        var standingsCriteria = new Fixture().Create<GetLeagueSeasonStandingCriteria>();
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => standingsCriteria = x)).Returns(standings);
        var standingGroup = controller.GroupStandingsByGroupName(standings);
        //Act
        var result = await controller.GetStandings();

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/_Standing.cshtml", viewResult.ViewName);
        var standingResult = Assert.IsType<List<StandingViewModel>>(viewResult.Model);
        Assert.Equal(standingGroup.Count, standingResult.Count);
    }

    [Fact]
    public async Task GetTopScorers_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var topScorers = new Fixture().Create<IList<TopScorers>>();
        var topCriteria = new Fixture().Create<GetTop10ScorersCriteria>();
        leagueService.GetTop10ScorersAsync(Arg.Do<GetTop10ScorersCriteria>(x => topCriteria = x)).Returns(topScorers);

        //Act
        var result = await controller.GetTopScorers(true);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/_TopScorers.cshtml", viewResult.ViewName);
        var topResult = Assert.IsAssignableFrom<IList<TopScorers>>(viewResult.Model);
        Assert.Equal(topScorers, topResult);
    }

    [Fact]
    public async Task GetHomepageStandings_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var standings = new Fixture().Create<IList<SeasonStandings>>();
        var standingsCriteria = new Fixture().Create<GetLeagueSeasonStandingCriteria>();
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => standingsCriteria = x)).Returns(standings);
        var standingGroup = controller.GroupStandingsByGroupName(standings);
        //Act
        var result = await controller.GetHomepageStandings(standingsCriteria);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/_HomepageStanding.cshtml", viewResult.ViewName);
        var standingResult = Assert.IsType<List<StandingViewModel>>(viewResult.Model);
        Assert.Equal(standingGroup.Count, standingResult.Count);
    }

    [Fact]
    public void GetGroupNames_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var seasonStandings = new Fixture().Create<IList<SeasonStandings>>();

        //Act
        var result = controller.GetGroupNames(seasonStandings);

        // Assert
        Assert.IsAssignableFrom<List<string>>(result);
    }

    [Fact]
    public void GroupStandingsByGroupName_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var seasonStandings = new Fixture().Create<IList<SeasonStandings>>();

        //Act
        var result = controller.GroupStandingsByGroupName(seasonStandings);

        // Assert
        Assert.IsAssignableFrom<List<StandingViewModel>>(result);
    }

    [Fact]
    public void GetRelatedPosts_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var slug = fixture.Create<string>();

        //Act
        var result = controller.GetRelatedPostsWC(slug, postId);

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

        //Act
        var result = controller.GetSidebarPostsWC(slug, postId);

        // Assert
        Assert.IsType<ViewComponentResult>(result);
    }

    [Fact]
    public async Task Single_WhenPostIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        Post expected = null;

        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);

        //Act
        var result = await controller.PostDetailWC(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }


    [Fact]
    public async Task CommentaryDetail_WhenPostIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        Post expected = null;

        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);

        //Act
        var result = await controller.CommentaryDetail(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task CommentaryDetail_WhenPostIsNotNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        var expected = fixture.Create<Post>();

        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);

        //Act
        var result = await controller.CommentaryDetail(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/WorldCup2022/PostDetail.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetMinigameByUserStage_WhenUserIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetMinigameByUserStageCriteria>();
        var votes = fixture.Create<IList<UserMinigameModel>>();

        worldcupService.GetMinigameByUserStageAsync(criteria).Returns(votes);

        //Act
        var result = await controller.GetMinigameByUserStage(criteria);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Null(viewResult.Value);
    }

    [Fact]
    public async Task GetMinigameByUserStage_WhenUserIsNotNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetMinigameByUserStageCriteria>();
        var votes = fixture.Create<IList<UserMinigameModel>>(); 
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = fixture.Create<UserSession>();
        expectedUser.SavedPosts = null;
        worldcupService.GetMinigameByUserStageAsync(criteria).Returns(votes);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.GetMinigameByUserStage(criteria);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(votes, viewResult.Value);
    }

    [Fact]
    public async Task GetMinigameByUser_WhenUserIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = await controller.GetMinigameByUser();

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Null(viewResult.Value);
    }

    [Fact]
    public async Task GetMinigameByUser_WhenUserIsNotNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var votes = fixture.Create<IList<UserMinigameModel>>();
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = fixture.Create<UserSession>();
        expectedUser.SavedPosts = null;

        worldcupService.GetMinigameByUserAsync(sessionService.User.Id).Returns(votes);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.GetMinigameByUser();

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(votes, viewResult.Value);
    }

    [Fact]
    public async Task UpdateMinigameVote_WhenUserIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<UpdateMinigameVoteCommand>();

        //Act
        var result = await controller.UpdateMinigameVote(criteria);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Null(viewResult.Value);
    }

    [Fact]
    public async Task UpdateMinigameVote_WhenUserIsNotNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<UpdateMinigameVoteCommand>();
        var commandResult = fixture.Create<CommandResult>();

        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = fixture.Create<UserSession>();
        expectedUser.SavedPosts = null;

        worldcupService.UpdateMinigameVoteAsync(criteria).Returns(commandResult);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.UpdateMinigameVote(criteria);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(commandResult, viewResult.Value);
    }

    [Fact]
    public async Task GetMinigameVoteMatch_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetMinigameVoteMatchCriteria>();
        var expected = fixture.Create<MinigameMatchVote>();

        worldcupService.GetMinigameVoteMatchAsync(criteria).Returns(expected);

        //Act
        var result = await controller.GetMinigameVoteMatch(criteria);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expected, viewResult.Value);
    }

    [Fact]
    public async Task GetMinigame_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var match = fixture.Create<Match>();
        var matches = new List<Match>();
        for(var i = 0; i < 64; i++) { matches.Add(match); }
        var statusStageOne = WorldCupHelper.GetStatusStage(matches, 1);

        worldcupService.GetMatchWCBySeasonAsync(Arg.Do<GetMatchBySeasonCriteria>(x => criteriaMatch = x)).Returns(matches);
        //Act
        var result = await controller.Minigame();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        if (statusStageOne == WorldCup2022.BeforeStartedStage || statusStageOne == WorldCup2022.LockStage){
            Assert.Equal("~/Views/Event/WorldCup2022/Minigame/Minigame.cshtml", viewResult.ViewName);
        }
        else{
            Assert.Equal("~/Views/Event/WorldCup2022/Minigame/MinigameTmp.cshtml", viewResult.ViewName);
        }
    }

    [Fact]
    public async Task GetMinigameData_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var usersByStageCriteria = fixture.Create<GetMinigameUsersByStageCriteria>();
        var minigameModels = fixture.Create<IList<UserMinigameModel>>();

        worldcupService.GetMinigameUsersAsync(usersByStageCriteria).Returns(minigameModels);
        //Act
        var result = await controller.GetMinigameData(usersByStageCriteria);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(viewResult.Value, minigameModels);
    }

    [Fact]
    public async Task MinigameStage_WhenUserIsNotLogin_RedirectCorrectlyPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = null;
        //Act
        var result = await controller.MinigameStage(1);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task MinigameStage_WhenStageLowerOne_RedirectCorrectlyPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        //Act
        var result = await controller.MinigameStage(0);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task MinigameStage_WhenStageHigherFour_RedirectCorrectlyPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        //Act
        var result = await controller.MinigameStage(5);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task MinigameStage_WhenStageStarted_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var usersByStageCriteria = fixture.Create<GetMatchBySeasonCriteria>();
        var matches = fixture.Create<IList<Match>>();

        worldcupService.GetMatchWCBySeasonAsync(Arg.Do<GetMatchBySeasonCriteria>(x => usersByStageCriteria = x)).Returns(matches);
        //Act
        var result = await controller.MinigameStage(1);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<MinigameStageViewModel>(viewResult.Model);
        Assert.Equal("~/Views/Event/WorldCup2022/Minigame/Stage.cshtml", viewResult.ViewName);
        Assert.Equal(matches, viewModel.Matches);
    }

    [Fact]
    public async Task MinigameProfile_WhenUserIsNotlogin_RedirectCorrectlyPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = null;
        //Act
        var result = await controller.MinigameProfile();

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task MinigameProfile_WhenUserLogined_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var usersByStageCriteria = fixture.Create<GetMatchBySeasonCriteria>();
        var matches = fixture.Create<IList<Match>>();

        worldcupService.GetMatchWCBySeasonAsync(Arg.Do<GetMatchBySeasonCriteria>(x => usersByStageCriteria = x)).Returns(matches);
        //Act
        var result = await controller.MinigameProfile();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<MinigameStageViewModel>(viewResult.Model);
        Assert.Equal("~/Views/Event/WorldCup2022/Minigame/Profile.cshtml", viewResult.ViewName);
        Assert.Equal(matches, viewModel.Matches);
    }

    [Fact]
    public async Task MinigameProfileStage_WhenUserIsNotlogin_RedirectCorrectlyPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = null;
        //Act
        var result = await controller.MinigameProfileStage(1);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task MinigameProfileStage_WhenStageLowerOne_RedirectCorrectlyPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        //Act
        var result = await controller.MinigameProfileStage(0);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task MinigameProfileStage_WhenStageStarted_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = fixture.Create<UserSession>();
        var usersByStageCriteria = fixture.Create<GetMatchBySeasonCriteria>();
        var matches = fixture.Create<IList<Match>>();

        worldcupService.GetMatchWCBySeasonAsync(Arg.Do<GetMatchBySeasonCriteria>(x => usersByStageCriteria = x)).Returns(matches);
        //Act
        var result = await controller.MinigameProfileStage(1);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<MinigameStageViewModel>(viewResult.Model);
        Assert.Equal("~/Views/Event/WorldCup2022/Minigame/ProfileStage.cshtml", viewResult.ViewName);
        Assert.Equal(matches, viewModel.Matches);
    }

    [Fact]
    public async Task MinigameProfileStage_WhenStageHigherFour_RedirectCorrectlyPage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();
        //Act
        var result = await controller.MinigameProfileStage(5);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("url", viewResult.Url);
    }


    [Fact]
    public async Task Single_WhenAuthencated_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        var expected = fixture.Create<Post>();
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 2, Slug = "bong-da" }
        };
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = fixture.Create<UserSession>();
        expectedUser.SavedPosts = null;
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.PostDetailWC(slug);

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
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        var expected = fixture.Create<Post>();
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 2, Slug = "video" }
        };
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = fixture.Create<UserSession>();
        expected.Type = Constants.VideoPostType;
        expectedUser.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.PostDetailWC(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.True(viewModel.IsVideo);
    }

    [Theory]
    [InlineData(Constants.CollectionSlug)]
    [InlineData(Constants.BasketballSlug)]
    [InlineData(Constants.TennisSlug)]
    public async Task Single_PostInOtherCategory_ReturnExpectedViewResult(string cateSlug)
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.CatesName = cateSlug;
        expected.CategoriesSlug = cateSlug;
        fixture.Create<IEnumerable<Post>>();
        var expectedUser = fixture.Create<UserSession>();
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 2, Slug = cateSlug }
        };
        sessionService.User = fixture.Create<UserSession>();
        expectedUser.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";

        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.PostDetailWC(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.Equal(Constants.OtherPostSlug, viewModel.CateInfo.Slug);
        Assert.Equal($"tin-the-thao/{cateSlug}/", viewModel.CateInfo.Url);
    }

    [Fact]
    public async Task Single_PostInSubCategory_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.CatesName = "schedule,transfer";
        expected.CategoriesSlug = $"{ Constants.MatchScheduleSlug }, { Constants.TransferSlug}";
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 2, Slug = Constants.MatchScheduleSlug }
        };
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = fixture.Create<UserSession>();
        expectedUser.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";

        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.PostDetailWC(slug);

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
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.CatesName = "bong-da";
        expected.CategoriesSlug = "bong-da";
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 1, Slug = "bong-da" }
        };
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = fixture.Create<UserSession>();
        expected.CatesName = $"{ Constants.Football }, { Constants.Video}";
        expected.CategoriesSlug = $"{ Constants.FootballSlug }, { Constants.VideoSlug}";
        expectedUser.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.PostDetailWC(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.Equal(Constants.FootballSlug, viewModel.CateInfo.Slug);
        Assert.Equal("tin-the-thao/bong-da/", viewModel.CateInfo.Url);
    }

    [Fact]
    public async Task Single_PostInEventCategory_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var postType = fixture.Create<string>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.CatesName = WorldCup2022.Homepage;
        expected.CategoriesSlug = WorldCup2022.HomepageSlug;
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "tin-the-thao" },
            new() { Id = 1, Slug = "bong-da" }
        };
        var expectedUser = fixture.Create<UserSession>();
        sessionService.User = fixture.Create<UserSession>();
        expectedUser.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => x = slug), Arg.Do<string>(x => x = postType)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = sessionService.User.Id)).Returns(expectedUser);

        //Act
        var result = await controller.PostDetailWC(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.Equal(WorldCup2022.HomepageSlug, viewModel.CateInfo.Slug);
        Assert.Equal($"/{WorldCup2022.HomepageSlug}", viewModel.CateInfo.Url);
    }

    #region Helpers

    private void GetDefaultContent(WorldCup2022Controller controller)
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
    private WorldCup2022Controller GetController()
    {
        dataControlService = Substitute.For<IDataControlService>();
        postService = Substitute.For<IPostService>();
        leagueService = Substitute.For<ILeagueService>();
        configuration = Substitute.For<IConfiguration>();
        sessionService = Substitute.For<ISessionService>();
        userService = Substitute.For<IUserService>();
        worldcupService = Substitute.For<IWorldCupService>();
        var controller = new WorldCup2022Controller(postService, dataControlService, leagueService, configuration, sessionService, userService, worldcupService);
        return controller;
    }
    #endregion Helpers
}