namespace SabaNews.Site.UnitTests.Controllers.Event;

using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Criteria.Posts;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Core.Constants;
using SabaNews.Services.Interfaces;
using Xunit;
using SabaNews.Site.Controllers.Event;
using SabaNews.Core.Services;
using Microsoft.Extensions.Configuration;
using SabaNews.Models.ViewModel.Event.Euro2024;
using SabaNews.Models.ViewModel.Event.WorldCup;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Models.Categories;
using SabaNews.Core.Models;
using Microsoft.AspNetCore.Http;
using SabaNews.Criteria.Poll;
using SabaNews.Models.ViewModel.Poll;
using SabaNews.Models.Options;
using System.Net;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Livescore.Models.Team;
using System;
using Criteria.Minigame;
using Microsoft.AspNetCore.Mvc.Routing;
using Models.Minigame;
using SabaNews.Core.Constants.Livescore;
using SabaNews.Livescore.Services.Interfaces;

public class Euro2024ControllerTests : Controller
{
    private IDataControlService dataControlService;
    private IPostService postService;
    private IConfiguration configuration;
    private ISessionService sessionService;
    private ILeagueService leagueService;
    private IOptionService optionService;
    private IPollService pollService;
    private IEuro2024Service euro2024Service;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task Index_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<Euro2024ViewModel>();
        dataControlService.GetEuro2024PageViewModel().Returns(expected);
        //Act
        var actual = await controller.Index();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<Euro2024ViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel);
        Assert.Equal("~/Views/Event/Euro2024/Index.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task LastestNews_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var news = fixture.Create<IEnumerable<Post>>();
        var cateSlugCriteria = fixture.Create<GetPostsByCateSlugCriteria>(); 
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.LastestNews();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/LastestNews.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<LastestNewsViewModel>(viewResult.Model);
        Assert.Equal(news, newsResult.Posts);

    }

    [Fact]
    public async Task CommentaryNews_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var news = fixture.Create<IEnumerable<Post>>();
        var cateSlugCriteria = fixture.Create<GetPostsByCateSlugCriteria>(); 
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.CommentaryNews();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/LastestNews.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<LastestNewsViewModel>(viewResult.Model);
        Assert.Equal(news, newsResult.Posts);

    }
    [Fact]
    public async Task Video_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var news = fixture.Create<IEnumerable<Post>>();
        var cateSlugCriteria = fixture.Create<GetPostsByCateSlugCriteria>(); 
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.Video();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/Video.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<VideoViewModel>(viewResult.Model);
        Assert.Equal(news, newsResult.Videos);

    }

    [Fact]
    public async Task Standing_WhenCurrentStageIsGroup_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var leagueID = Euro2024.LeagueId;
        var league =fixture.Create<League>();
        league.CurrentStageId = Euro2024.GroupStageId;
        var news = fixture.Create<IList<SeasonStandings>>();
        var cateSlugCriteria = fixture.Create<GetLeagueSeasonStandingCriteria>();
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => cateSlugCriteria = x)).Returns(news);
        leagueService.GetLeagueByIdAsync(Arg.Do<long>(x => leagueID = x)).Returns(league);
        //Act
        var result = await controller.Standing();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/DetailStanding.cshtml", viewResult.ViewName);
        var model = Assert.IsType<StandingDetailViewModel>(viewResult.Model);
        Assert.False(model.IsKnockoutStage);
    }
        

    [Fact]
    public async Task Artile_WhenSlugNotContainHtml_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet";
        fixture.Create<string>();
        Post expected = null;

        postService.GetPostDetailSummaryAsync(Arg.Do<string>(x => x = slug)).Returns(expected);

        //Act
        var result = await controller.Article(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Artile_WhenSlugContainHtmlAndPostIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet.html";
        fixture.Create<string>();
        Post expected = null;

        postService.GetPostDetailSummaryAsync(Arg.Do<string>(x => x = slug)).Returns(expected);

        //Act
        var result = await controller.Article(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Artile_WhenPostSlugIsNotSame_RedirectExpectedViewResult()
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
        var result = await controller.Article(slug);

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Euro2024", redirectResult.ControllerName);
        Assert.Equal("Article", redirectResult.ActionName);
    }


    [Fact]
    public async Task Article_WhenPostIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet-123.html";
        var postId = fixture.Create<long>();
        Post expected = null;

        postService.GetPostDetailAsync(Arg.Do<long>(x => x = postId)).Returns(expected);

        //Act
        var result = await controller.Article(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }
        

    [Fact]
    public async Task Single_WhenAuthencated_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet-123.html";
        var postId = fixture.Create<long>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.Slug = "bai-viet";
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "nhan-dinh-euro-2024" }
        };
        var expectedUser = fixture.Create<UserSession>();
        expectedUser.SavedPosts = "[{\"PostID\":3963,\"Date\":\"2021-10-21\"},{\"PostID\":4255,\"Date\":\"2021-10-21\"},{\"PostID\":4249,\"Date\":\"2021-10-21\"}]";
        sessionService.User = expectedUser;
        postService.GetPostDetailAsync(Arg.Do<long>(x => x = postId)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);
        //Act
        var result = await controller.Article(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.Equal("~/Views/Event/Euro2024/Article.cshtml", viewResult.ViewName);
        Assert.False(viewModel.IsVideo);
    }

    [Fact]
    public async Task Single_WhenIsVideoPost_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = "bai-viet-123.html";
        var postId = fixture.Create<long>();
        fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<Post>();
        expected.Slug = "bai-viet";
        var expectedCateInfos = new List<CategoryGeneral>
        {
            new() { Id = 1, Slug = "video" },
            new() { Id = 2, Slug = "video-euro-2024" }
        };
        sessionService.User = null;
        expected.Type = Constants.VideoPostType;
        postService.GetPostDetailAsync(Arg.Do<long>(x => x = postId)).Returns(expected);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = slug)).Returns(expectedCateInfos);

        //Act
        var result = await controller.Article(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<SingleViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.SinglePost);
        Assert.Equal("~/Views/Event/Euro2024/Article.cshtml", viewResult.ViewName);
        Assert.True(viewModel.IsVideo);

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
        Assert.Equal("~/Views/Event/Euro2024/MatchDetail.cshtml", viewResult.ViewName);



    }

    [Fact]
    public async Task Team_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var seasonId = fixture.Create<long>();
        var stageId = fixture.Create<long>();

        var expectedTeam = fixture.Create<IList<TeamStage>>();

        euro2024Service.GetTeamByStage(Arg.Do<long>(x => seasonId = x), Arg.Do<long>(x => stageId = x)).Returns(expectedTeam);

        //Act
        var result = await controller.Team();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var dataResult = Assert.IsType<TeamViewModel>(viewResult.Model);
        Assert.Equal("~/Views/Event/Euro2024/Team.cshtml", viewResult.ViewName);
        Assert.Equal(expectedTeam, dataResult.Teams);



    }

    [Fact]
    public void TeamDetail_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.TeamDetail(10);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/TeamDetail.cshtml", viewResult.ViewName);



    }

    [Fact]
    public async Task GetTeamDetailData_WhenParamIsNull_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        GetTeamDataModel model = null;


        //Act
        var result = await controller.GetTeamDetailData(model);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Null(viewResult.Value);
    }

    [Fact]
    public async Task GetTeamDetailData_WhenParamHaveData_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var model = new GetTeamDataModel { TeamId = 33172 };
        var teamId = fixture.Create<long>();
        var getMatchCriteria = fixture.Create<GetMatchByTeamSeasonCriteria>();
        var profileSlug = fixture.Create<string>();

        var expectedProfile = fixture.Create<Post>();
        var expectedMatches = fixture.Create<IList<Match>>();
        var expectedPlayers = fixture.Create<IList<PlayerCustom>>();
        expectedMatches[0].Stage.StageId = Euro2024.GroupStageId;

        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => profileSlug = x), Arg.Do<string>(x => profileSlug = x)).Returns(expectedProfile);
        euro2024Service.GetMatchByTeamSeasonAsync(Arg.Do<GetMatchByTeamSeasonCriteria>(x => getMatchCriteria = x)).Returns(expectedMatches);
        euro2024Service.GetTeamPlayerById(Arg.Do<long>(x => teamId = x)).Returns(expectedPlayers);

        var matches = expectedMatches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();
        //Act
        var result = await controller.GetTeamDetailData(model);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        var actualPlayers = Assert.IsAssignableFrom<IList<PlayerCustom>>(viewResult.Value.GetType().GetProperty("players").GetValue(viewResult.Value));
        var actualMatches = Assert.IsAssignableFrom<IList<Match>>(viewResult.Value.GetType().GetProperty("matches").GetValue(viewResult.Value));
        Assert.Equal(expectedPlayers, actualPlayers);
        Assert.Equal(matches, actualMatches);
            
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
        Assert.Equal("~/Views/Event/Euro2024/Fixture.cshtml", viewResult.ViewName);

    }

    [Fact]
    public async Task GetRelatedPosts_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var slug = fixture.Create<string>();

        var expected = fixture.Create<IEnumerable<Post>>();
        var cateSlugCriteria = fixture.Create<GetPostsByCateSlugCriteria>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(expected);

        //Act
        var result = await controller.GetRelatedPosts(slug, postId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/_RelatedPosts.cshtml", viewResult.ViewName);
        var model = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, model);
    }

    [Fact]
    public async Task GetMostViewPosts_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var slug = fixture.Create<string>();

        var expected = fixture.Create<IEnumerable<Post>>();
        var cateParams = fixture.Create<PostParam>();
        postService.GetTopPostsByCateSlugAsync(Arg.Do<PostParam>(x => cateParams = x)).Returns(expected);

        //Act
        var result = await controller.GetMostViewPost(slug, postId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/_MostViewPosts.cshtml", viewResult.ViewName);
        var model = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, model);
    }

    [Fact]
    public async Task GetHomepageStandings_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var standings = fixture.Create<IList<SeasonStandings>>();
        var standingsCriteria = fixture.Create<GetLeagueSeasonStandingCriteria>();
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => standingsCriteria = x)).Returns(standings);
        var groupsStageStanding = standings.Where(standing => standing.StageId == Euro2024.GroupStageId).ToList();
        var standingGroup = controller.GroupStandingsByGroup(groupsStageStanding);
        //Act
        var result = await controller.GetHomepageStandings();

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/_HomepageStanding.cshtml", viewResult.ViewName);
        var standingResult = Assert.IsType<List<StandingViewModel>>(viewResult.Model);
        Assert.Equal(standingGroup.Count, standingResult.Count);
    }

    [Fact]
    public async Task GetNewsGrid_WhenGridIsVideo_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<CategoryPostParams>();
        param.IsVideo = true;
        var news = fixture.Create<IEnumerable<Post>>();
        var cateSlugCriteria = fixture.Create<GetPostsByCateSlugCriteria>();

        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.GetNewsGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/_VideoGridView.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetNewsGrid_WhenGridIsNotVideo_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<CategoryPostParams>();
        param.IsVideo = false;
        var news = fixture.Create<IEnumerable<Post>>();
        var cateSlugCriteria = fixture.Create<GetPostsByCateSlugCriteria>();

        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => cateSlugCriteria = x)).Returns(news);

        //Act
        var result = await controller.GetNewsGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/_NewsGridView.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetFixture_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        var expected = fixture.Create<MatchLeague>();
        expected.Matches.First().Stage.StageId = Euro2024.GroupStageId;
        var expectMatch = expected.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();
        Json(new { expected.League, expected.Matches });

        dataControlService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var result = await controller.GetFixture();

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        var actualLeague = Assert.IsAssignableFrom<League>(viewResult.Value.GetType().GetProperty("league").GetValue(viewResult.Value));
        var actualMatches = Assert.IsAssignableFrom<IList<Match>>(viewResult.Value.GetType().GetProperty("matches").GetValue(viewResult.Value));
        Assert.Equal(expected.League, actualLeague);
        Assert.Equal(expectMatch, actualMatches);
    }

    [Fact]
    public async Task GetTopScorers_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var topScorers = fixture.Create<IList<TopScorers>>();
        var topCriteria = fixture.Create<GetTop10ScorersCriteria>();
        leagueService.GetTop10ScorersAsync(Arg.Do<GetTop10ScorersCriteria>(x => topCriteria = x)).Returns(topScorers);

        //Act
        var result = await controller.GetTopScorers();

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/_TopScorers.cshtml", viewResult.ViewName);
        var topResult = Assert.IsAssignableFrom<IList<TopScorers>>(viewResult.Model);
        Assert.Equal(topScorers, topResult);
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

        var optionKey = fixture.Create<string>();
        fixture.Create<int>();
        fixture.Create<int>();
        var criteria = fixture.Create<GetPollDetailCriteria>();

        var expected = fixture.Create<PollViewModel>();
        var expectedOption = new Option { OptionValue = "4" };
        fixture.Create<IEnumerable<Post>>();
           
        optionService.GetOptionAsync(Arg.Do<string>(x => optionKey = x)).Returns(expectedOption);
        pollService.GetPollDetailAsync(Arg.Do<GetPollDetailCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var result = await controller.GetPollData();

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.IsType<PollViewModel>(viewResult.Model);
        Assert.Equal("~/Views/Event/Euro2024/_PollEuro2024.cshtml", viewResult.ViewName);
        Assert.Equal(int.Parse(expectedOption.OptionValue), criteria.QuestId);
    }

    [Fact]
    public async Task VotePoll_WhenVoteHomeSuccessful_ReturnExpectedData()
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
        var criteria = fixture.Create<GetPollDetailCriteria>();
        var isHome = true;
        var expected = new CommandResult { Code = 0 };
        fixture.Create<IEnumerable<Post>>();

        fixture.Create<GetPollDetailCriteria>();
        var expectedPoll = fixture.Create<PollViewModel>();
           
        pollService.GetPollDetailAsync(Arg.Do<GetPollDetailCriteria>(x => criteria = x)).Returns(expectedPoll);

        pollService.VotePollAsync(Arg.Do<int>(x => questId = x), Arg.Do<int>(x => answerId = x), Arg.Do<string>(x => clientIp = x)).Returns(expected);

        //Act
        await controller.VotePoll(questId, answerId, themeId, isHome);

        // Assert
        Assert.True(expected.IsSuccessful);
    }

    [Fact]
    public async Task VotePoll_WhenVoteArticleSuccessful_ReturnExpectedData()
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
        var criteria = fixture.Create<GetPollDetailCriteria>();
        var isHome = false;
        var expected = new CommandResult { Code = 0 };
        var expectedPoll = fixture.Create<PollViewModel>();
           
        pollService.GetPollDetailAsync(Arg.Do<GetPollDetailCriteria>(x => criteria = x)).Returns(expectedPoll);

        pollService.VotePollAsync(Arg.Do<int>(x => questId = x), Arg.Do<int>(x => answerId = x), Arg.Do<string>(x => clientIp = x)).Returns(expected);

        //Act
        await controller.VotePoll(questId, answerId, themeId, isHome);

        // Assert
        Assert.True(expected.IsSuccessful);
    }

    [Fact]
    public async Task GetStandings_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var standings = fixture.Create<IList<SeasonStandings>>();
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        standings[0].StageId = Euro2024.GroupStageId;
        new Fixture().Create<GetLeagueSeasonStandingCriteria>();
        dataControlService.GetLeagueSeasonStandingAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(standings);
        var groupsStageStanding = standings.Where(standing => standing.StageId == Euro2024.GroupStageId).ToList();
        var standingGroup = controller.GroupStandingsByGroup(groupsStageStanding);
            
        //Act
        var result = await controller.GetStandings();

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var standingResult = Assert.IsType<List<StandingViewModel>>(viewResult.Model);
        Assert.Equal("~/Views/Event/Euro2024/_Standing.cshtml", viewResult.ViewName);
        Assert.Equal(standingGroup.Count, standingResult.Count);
    }

    [Fact]
    public async Task Minigame_WhenCalled_WhenNotLogin()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<MatchLeague>();
        fixture.Create<GetPostsByCateSlugCriteria>(); 
        var leagueId =  fixture.Create<long>();
        var seasonId =  fixture.Create<long>();
        sessionService.User = null;

        expected.Matches.First().Stage.StageId = Euro2024.GroupStageId;
        var expectMatch = expected.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();

        dataControlService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var result = await controller.Minigame();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/Minigame/Minigame.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<EuroMinigameViewModel>(viewResult.Model);
        Assert.Equal(expectMatch, newsResult.Matches);
        Assert.False(newsResult.IsLogin);
    }
        

    [Fact]
    public async Task Minigame_WhenCalled_WhenLogin()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<MatchLeague>();
        fixture.Create<GetPostsByCateSlugCriteria>(); 
        var leagueId =  fixture.Create<long>();
        var seasonId =  fixture.Create<long>();
        sessionService.User = fixture.Create<UserSession>();

        expected.Matches.First().Stage.StageId = Euro2024.GroupStageId;
        var expectMatch = expected.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();

        dataControlService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var result = await controller.Minigame();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/Minigame/Minigame.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<EuroMinigameViewModel>(viewResult.Model);
        Assert.Equal(expectMatch, newsResult.Matches);
        Assert.Equal(sessionService.User, newsResult.User);
        Assert.True(newsResult.IsLogin);
    }

    [Fact]
    public async Task MinigameStage_WhenCalled_WhenNotLogin()
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
    public async Task MinigameStage_WhenCalled_WhenWrongStage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = null;


        //Act
        var result = await controller.MinigameStage(3);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task MinigameStage_WhenCalled_WhenLogin()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<MatchLeague>();
        var leagueId =  fixture.Create<long>();
        var seasonId =  fixture.Create<long>();

        sessionService.User = fixture.Create<UserSession>();
        expected.Matches.First().Stage.StageId = Euro2024.GroupStageId;
        var expectMatch = expected.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();

        dataControlService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var result = await controller.MinigameStage(1);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/Minigame/Stage.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<EuroMinigameStageViewModel>(viewResult.Model);
        Assert.Equal(expectMatch, newsResult.Matches);
        Assert.True(newsResult.IsLogin);
    }

    [Fact]
    public async Task MinigameProfile_WhenCalled_WhenLogin()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<MatchLeague>();
        var leagueId =  fixture.Create<long>();
        var seasonId =  fixture.Create<long>();

        sessionService.User = fixture.Create<UserSession>();
        expected.Matches.First().Stage.StageId = Euro2024.GroupStageId;
        var expectMatch = expected.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();

        dataControlService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var result = await controller.MinigameProfile();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/Minigame/Profile.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<EuroMinigameStageViewModel>(viewResult.Model);
        Assert.Equal(expectMatch, newsResult.Matches);
        Assert.True(newsResult.IsLogin);
    }

    [Fact]
    public async Task MinigameProfile_WhenCalled_WhenNotLogin()
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
    public async Task MinigameProfileStage_WhenCalled_WhenLogin()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<MatchLeague>();
        var leagueId =  fixture.Create<long>();
        var seasonId =  fixture.Create<long>();

        sessionService.User = fixture.Create<UserSession>();
        expected.Matches.First().Stage.StageId = Euro2024.GroupStageId;
        var expectMatch = expected.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();

        dataControlService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var result = await controller.MinigameProfileStage(1);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Event/Euro2024/Minigame/ProfileStage.cshtml", viewResult.ViewName);
        var newsResult = Assert.IsType<EuroMinigameStageViewModel>(viewResult.Model);
        Assert.Equal(expectMatch, newsResult.Matches);
        Assert.True(newsResult.IsLogin);
    }

    [Fact]
    public async Task MinigameProfileStage_WhenCalled_WhenNotLogin()
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
    public async Task MinigameProfileStage_WhenCalled_WhenWrongStage()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContent(controller);
        sessionService.User = fixture.Create<UserSession>();


        //Act
        var result = await controller.MinigameProfileStage(3);

        // Assert
        var viewResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("url", viewResult.Url);
    }

    [Fact]
    public async Task GetMinigameByStage_WhenStageMoreThanTwo_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var criteria = fixture.Create<GetLeagueMinigameByStageCriteria>();

        criteria.Stage = 3;
            


        //Act
        var result = await controller.GetMinigameByStage(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Null(jsonResult.Value);
    }

    [Fact]
    public async Task GetMinigameByStage_WhenParamHaveData_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var criteria = fixture.Create<GetLeagueMinigameByStageCriteria>();

        var expectedData = fixture.Create<IList<UserMinigameModel>>();
        criteria.Stage = 1;
            

        dataControlService.GetMinigameByStage(Arg.Do<GetLeagueMinigameByStageCriteria>(x => criteria = x)).Returns(expectedData);

        //Act
        var result = await controller.GetMinigameByStage(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<UserMinigameModel>>(jsonResult.Value);
        Assert.Equal(expectedData, actual);
    }

    [Fact]
    public async Task GetLegueMinigameByUserStage_WhenParamHaveData_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var criteria = fixture.Create<GetLeagueMinigameByUserStageCriteria>();

        var expectedData = fixture.Create<IList<MinigameModel>>();
        sessionService.User = fixture.Create<UserSession>();

        euro2024Service.GetLeagueMinigameByUserStageAsync(Arg.Do<GetLeagueMinigameByUserStageCriteria>(x => criteria = x)).Returns(expectedData);

        //Act
        var result = await controller.GetLegueMinigameByUserStage(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<MinigameModel>>(jsonResult.Value);
        Assert.Equal(expectedData, actual);
    }

    [Fact]
    public async Task GetLegueMinigameByUserStage_WhenNotLogin_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        GetLeagueMinigameByUserStageCriteria model = null;
        sessionService.User = null;

        //Act
        var result = await controller.GetLegueMinigameByUserStage(model);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Null(viewResult.Value);
    }


    [Fact]
    public async Task UpdateVoteMinigame_WhenParamHaveData_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var cmd = fixture.Create<UpdateMinigameVoteCommand>();
        var criteria = fixture.Create<GetMinigameVotedMatchCriteria>();
        var matchStartDate = DateTime.Parse("2021-10-10 10:00:00");

        var expectedMatch = new MinigameMatchVotedModel { MatchId = 1, Status = 0, StartTime = matchStartDate, LeagueId = Euro2024.LeagueId, SeasonId = Euro2024.SeasonId};
        var expectedData = new CommandResult();
        sessionService.User = fixture.Create<UserSession>();

        euro2024Service.GetMinigameVoteMatchAsync(Arg.Do<GetMinigameVotedMatchCriteria>(x => criteria = x)).Returns(expectedMatch);
        euro2024Service.UpdateMinigameVoteAsync(Arg.Do<UpdateMinigameVoteCommand>(x => cmd = x)).Returns(expectedData);

        //Act
        var result = await controller.UpdateVoteMinigame(cmd);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.False(actual.IsSuccessful);
    }

    [Fact]
    public async Task UpdateVoteMinigame_WhenNotLogin_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();

        UpdateMinigameVoteCommand model = null;
        sessionService.User = null;

        //Act
        var result = await controller.UpdateVoteMinigame(model);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Null(viewResult.Value);
    }

    [Fact]
    public async Task UpdateVoteMinigame_WhenMatchIsLive_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var model = fixture.Create<UpdateMinigameVoteCommand>();
        sessionService.User = fixture.Create<UserSession>();
        var criteria = fixture.Create<GetMinigameVotedMatchCriteria>();
        var matchStartDate = DateTime.Parse("2024-10-10 10:00:00");

        var expectedMatch = new MinigameMatchVotedModel { MatchId = 1, Status = MatchConstants.FirstHalf, StartTime = matchStartDate, LeagueId = Euro2024.LeagueId, SeasonId = Euro2024.SeasonId};
        euro2024Service.GetMinigameVoteMatchAsync(Arg.Do<GetMinigameVotedMatchCriteria>(x => criteria = x)).Returns(expectedMatch);
        //Act
        var result = await controller.UpdateVoteMinigame(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.False(actual.IsSuccessful);
    }

    [Fact]
    public async Task UpdateVoteMinigame_WhenMatchIsFinish_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var model = fixture.Create<UpdateMinigameVoteCommand>();
        sessionService.User = fixture.Create<UserSession>();
        var criteria = fixture.Create<GetMinigameVotedMatchCriteria>();
        var matchStartDate = DateTime.Parse("2024-10-10 10:00:00");

        var expectedMatch = new MinigameMatchVotedModel { MatchId = 1, Status = MatchConstants.Finished, StartTime = matchStartDate, LeagueId = Euro2024.LeagueId, SeasonId = Euro2024.SeasonId};
        euro2024Service.GetMinigameVoteMatchAsync(Arg.Do<GetMinigameVotedMatchCriteria>(x => criteria = x)).Returns(expectedMatch);
        //Act
        var result = await controller.UpdateVoteMinigame(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.False(actual.IsSuccessful);
    }

    [Fact]
    public async Task UpdateVoteMinigame_WhenMatchIsWrongLeague_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var model = fixture.Create<UpdateMinigameVoteCommand>();
        sessionService.User = fixture.Create<UserSession>();
        var criteria = fixture.Create<GetMinigameVotedMatchCriteria>();
        var matchStartDate = DateTime.Parse("2024-10-10 10:00:00");

        var expectedMatch = new MinigameMatchVotedModel { MatchId = 1, Status = 0, StartTime = matchStartDate, LeagueId = 123, SeasonId = Euro2024.SeasonId};
        euro2024Service.GetMinigameVoteMatchAsync(Arg.Do<GetMinigameVotedMatchCriteria>(x => criteria = x)).Returns(expectedMatch);
        //Act
        var result = await controller.UpdateVoteMinigame(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.False(actual.IsSuccessful);
    }

    [Fact]
    public async Task GetMinigameByUser_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
           
        var model = fixture.Create<GetMinigameUserVoteModel>();
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        var userId = fixture.Create<long>();
        sessionService.User = fixture.Create<UserSession>();

        var expectedVotes = fixture.Create<IList<MinigameModel>>();
        var expected = fixture.Create<MatchLeague>();
        var match = expected.Matches.First();
        match.Stage.StageId = Euro2024.GroupStageId;
        expected.Matches.First().Stage.StageId = Euro2024.GroupStageId;
        for(var i = 0; i < 64; i++) { expected.Matches.Add(match); }

        var expectMatch = expected.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();

        dataControlService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);
        euro2024Service.GetMinigameByUserAsync(Arg.Do<long>(x => userId = x), Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expectedVotes);
        //Act
        var result = await controller.GetMinigameByUser(model);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        var actualLeague = Assert.IsAssignableFrom<League>(viewResult.Value.GetType().GetProperty("league").GetValue(viewResult.Value));
        var actualMatches = Assert.IsAssignableFrom<IList<Match>>(viewResult.Value.GetType().GetProperty("matches").GetValue(viewResult.Value));
        var actualVotes = Assert.IsAssignableFrom<IList<MinigameModel>>(viewResult.Value.GetType().GetProperty("votes").GetValue(viewResult.Value));
        Assert.Equal(expected.League, actualLeague);
        Assert.Equal(expectMatch, actualMatches);
        Assert.Equal(expectedVotes, actualVotes);
    }

    [Fact]
    public async Task GetMinigameByUser_WhenNotLogin_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        GetMinigameUserVoteModel model = null;
        sessionService.User = null;

        //Act
        var result = await controller.GetMinigameByUser(model);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Null(viewResult.Value);
    }

    private void GetDefaultContent(Euro2024Controller controller)
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

    #region Helpers
    private Euro2024Controller GetController()
    {
        dataControlService = Substitute.For<IDataControlService>();
        postService = Substitute.For<IPostService>();
        configuration = Substitute.For<IConfiguration>();
        sessionService = Substitute.For<ISessionService>();
        leagueService = Substitute.For<ILeagueService>();
        optionService = Substitute.For<IOptionService>();
        pollService = Substitute.For<IPollService>();
        Substitute.For<IMatchService>();
        euro2024Service = Substitute.For<IEuro2024Service>();
        var controller = new Euro2024Controller(dataControlService, postService, sessionService, configuration, pollService, leagueService, optionService, euro2024Service);

        return controller;
    }

    #endregion Helpers
}