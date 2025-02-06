namespace SabaNews.Site.UnitTests.Controllers.Livescore;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using Fanex.Caching;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Lineup;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Livescore.Services.Interfaces;
using SabaNews.Models;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Services.Interfaces;
using Site.Controllers.LiveScore;
using Xunit;

public class SoccerControllerTests
{
    private ILeagueService leagueService;
    private IMatchService matchService;
    private ICacheWrapperService cacheService;
    private IConfiguration configuration;
    private IDataControlService dataControlService;
    private readonly IFixture fixture = new Fixture();

    #region Index

    [Fact]
    public void Index_EventDateIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var today = DateTime.UtcNow.Date.ConvertToClient();
        var pageDetail = new Category
        {
            Title = "Lịch thi đấu và kết quả bóng đá hôm nay " + today.ToString("dd/MM")
        };
        var controller = GetController();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Path = $"/{fixture.Create<string>()}";

        // Act
        var result =  controller.Index(null);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<PageViewModel>(viewResult.Model);

        Assert.Single(viewResult.ViewData);
        Assert.Null(viewResult.ViewData["EventDate"]);
        Assert.Equal("~/Views/Livescore/Soccer/Index.cshtml", viewResult.ViewName);
        Assert.Equal(pageDetail.Title, viewModel.Category.Title);
    }

    [Fact]
    public void Index_EventDateisPast_ReturnExpectedViewResult()
    {
        // Arrange
        var eventDate = DateTime.UtcNow.AddDays(-2);
        var pageDetail = new Category
        {
            Title = "Kết quả bóng đá, tỷ số bóng đá ngày " + eventDate.ToString("dd/MM"),
            Description = "description"
        };
        var controller = GetController();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Path = $"/{fixture.Create<string>()}";

        // Act
        var result = controller.Index(eventDate);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<PageViewModel>(viewResult.Model);

        Assert.Single(viewResult.ViewData);
        Assert.Equal(eventDate, viewResult.ViewData["EventDate"]);
        Assert.Equal(pageDetail.Title, viewModel.Category.Title);
    }

    [Fact]
    public void Index_EventDateIsFuture_ReturnExpectedViewResult()
    {
        var eventDate = DateTime.UtcNow.AddDays(2);
        // Arrange
        var pageDetail = new Category
        {
            Title = "Lịch thi đấu bóng đá, trực tiếp bóng đá ngày " + eventDate.ToString("dd/MM")
        };
        var controller = GetController();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Path = $"/{fixture.Create<string>()}";

        // Act
        var result =  controller.Index(eventDate);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<PageViewModel>(viewResult.Model);

        Assert.Single(viewResult.ViewData);
        Assert.Equal(eventDate, viewResult.ViewData["EventDate"]);
        Assert.Equal("~/Views/Livescore/Soccer/Index.cshtml", viewResult.ViewName);
        Assert.Equal(pageDetail.Title, viewModel.Category.Title);
    }

    [Fact]
    public void Index_PathEndwithSlash_RedirectCorrectUrl()
    {
        var eventDate = DateTime.UtcNow.AddDays(2);
        // Arrange
        var path = $"/{fixture.Create<string>()}/";
        var controller = GetController();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Path = $"/{path}/";

        // Act
        var result =  controller.Index(eventDate);

        // Assert
        var redirectResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal($"/{path}", redirectResult.Url);
    }

    #endregion

    [Fact]
    public async void MatchDetail_WhenMatchIsNotFound_ReturnExpectedViewResult()
    {
        // Arrange
        var league = fixture.Create<string>();
        var match = fixture.Create<string>();
        var matchId = fixture.Create<long>();
        var criteria = fixture.Create<GetSummaryMatchByIdCriteria>();
        Match expected = null;
        var controller = GetController();
        matchService.GetSummaryMatchByIdAsync(criteria).Returns(expected);
        // Act
        var result = await controller.MatchDetail(league, match, matchId);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);

        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async void MatchDetail_WhenMatchHaveFound_ReturnExpectedViewResult()
    {
        // Arrange
        var league = fixture.Create<string>();
        var match = fixture.Create<string>();
        var matchId = fixture.Create<long>();
        var criteria = fixture.Create<GetSummaryMatchByIdCriteria>();
        var expected = fixture.Create<Match>();
        var controller = GetController();
        matchService.GetSummaryMatchByIdAsync(Arg.Do<GetSummaryMatchByIdCriteria>(x => x = criteria)).Returns(expected);

        // Act
        var result = await controller.MatchDetail(league, match, matchId);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<MatchDetailModel>(viewResult.Model);

        Assert.Equal("~/Views/Livescore/Soccer/Detail.cshtml", viewResult.ViewName);
        Assert.Equal(expected, viewModel.Match);
    }

    public async void LeagueDetail_WhenHaveSeason_RedirectCorrectUrl(string selectedTab)
    {
        // Arrange
        var league = fixture.Create<string>();
        var seasonId = fixture.Create<long>();
        var date = fixture.Create<DateTime>();
        var leagueId = fixture.Create<long>();
        var controller = GetController();
        var tab = "tong-hop";
        var rediectUrl = $"/lich-thi-dau/bong-da/{league}/{seasonId}/{leagueId}/{tab}";

        // Act
        var result = await controller.LeagueDetail(league, seasonId, date, leagueId, selectedTab);

        // Assert
        var redirectResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal(rediectUrl, redirectResult.Url);
    }


    [Theory]
    [InlineData(null)]
    [InlineData("general")]
    [InlineData("fixtures")]
    [InlineData("results")]
    [InlineData("standings")]
    public async void LeagueDetail_OldSelectedTab_RedirectCorrectNewTab(string selectedTab)
    {
        // Arrange
        var league = fixture.Create<string>();
        var seasonId = 0;
        var date = fixture.Create<DateTime>();
        var leagueId = fixture.Create<long>();
        var controller = GetController();
        var tab = "tong-hop";
        switch(selectedTab)
        {
            case null:
            case "general":
                tab = "tong-hop";
                break;
            case "fixtures":
                tab = "lich-thi-dau";
                break;
            case "results":
                tab = "ket-qua";
                break;
            case "standings":
                tab = "bang-xep-hang";
                break;
            default:
                tab = "tong-hop";
                break;
        }
        var rediectUrl = $"/lich-thi-dau/bong-da/{league}/{seasonId}/{date:yyyy-MM-dd}/{leagueId}/{tab}";

        // Act
        var result = await controller.LeagueDetail(league, seasonId, date, leagueId, selectedTab);

        // Assert
        var redirectResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal(rediectUrl, redirectResult.Url);
    }

    [Fact]
    public async Task LeagueDetail_WhenLeagueIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var league = fixture.Create<string>();
        var seasonId =0;
        var date = fixture.Create<DateTime>();
        var leagueId = fixture.Create<long>();
        var selectedTab = "lich-thi-dau";
        League expectedLeague = null;
            
        leagueService.GetLeagueByIdAsync(leagueId).Returns(expectedLeague);
        // Act
        var result = await controller.LeagueDetail(league, seasonId, date, leagueId, selectedTab);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
           
    }

    [Fact]
    public async Task LeagueDetail_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var league = fixture.Create<string>();
        var seasonId = 0;
        var date = fixture.Create<DateTime>();
        var leagueId = fixture.Create<long>();
        var selectedTab = "lich-thi-dau";
        var expectedLeague = fixture.Create<League>();
            
        leagueService.GetLeagueByIdAsync(leagueId).Returns(expectedLeague);
        // Act
        var result = await controller.LeagueDetail(league, seasonId, date, leagueId, selectedTab);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<GetMatchBySeasonParams>(viewResult.Model);
        Assert.Equal("~/Views/Livescore/Soccer/LeagueDetail.cshtml", viewResult.ViewName);
        Assert.Equal(leagueId, viewModel.LeagueId);
        Assert.Equal(seasonId, viewModel.SeasonId);
        Assert.Equal(date, viewModel.Date);
        Assert.Equal(selectedTab, viewModel.SelectedTab);
    }

    [Fact]
    public async Task LeagueDetailForSeason_WhenLeagueIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var league = fixture.Create<string>();
        var seasonId = fixture.Create<long>();
        var leagueId = fixture.Create<long>();
        var selectedTab = "lich-thi-dau";
        League expectedLeague = null;
        leagueService.GetLeagueByIdAsync(leagueId).Returns(expectedLeague);
        // Act
        var result = await controller.LeagueDetailForSeason(league, seasonId, leagueId, selectedTab);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task LeagueDetailForSeason_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var league = fixture.Create<string>();
        var seasonId = fixture.Create<long>();
        fixture.Create<DateTime>();
        var leagueId = fixture.Create<long>();
        var selectedTab = "lich-thi-dau";
        var expectedLeague = fixture.Create<League>();
            
        leagueService.GetLeagueByIdAsync(leagueId).Returns(expectedLeague);
        // Act
        var result = await controller.LeagueDetailForSeason(league, seasonId, leagueId, selectedTab);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<GetMatchBySeasonParams>(viewResult.Model);
        Assert.Equal("~/Views/Livescore/Soccer/LeagueDetail.cshtml", viewResult.ViewName);
        Assert.Equal(leagueId, viewModel.LeagueId);
        Assert.Equal(seasonId, viewModel.SeasonId);
        Assert.Equal(selectedTab, viewModel.SelectedTab);
    }

    [Fact]
    public void FavouriteMatch_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();

        // Act
        var result = controller.FavouriteMatch();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Livescore/Soccer/FavouriteMatch.cshtml", viewResult.ViewName);
        Assert.Null(viewResult.Model);
    }

    [Fact]
    public void FavouriteLeague_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();

        // Act
        var result = controller.FavouriteLeague();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Views/Livescore/Soccer/FavouriteLeague.cshtml", viewResult.ViewName);
        Assert.Null(viewResult.Model);
    }

    #region GetMatches

    [Fact]
    public async Task GetMatches_WhenCacheIsDisabled_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var eventDate = new DateTime(2022, 5, 25);
        var fromTime = eventDate.AddHours(-7);
        var toTime = eventDate.AddDays(1).AddSeconds(-1).AddHours(-7);
        var criteria = new GetMatchByDateCriteria
        {
            EventDate = eventDate,
            Timezone = 7
        };
        var controller = GetController(false);
        matchService.GetMatchByDateAsync(criteria).Returns(matches);

        // Act
        var result = await controller.GetMatches(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(matches, actual);

        Assert.Equal(eventDate, criteria.EventDate);
        Assert.Equal(7, criteria.Timezone);
        Assert.Equal(fromTime, criteria.FromTime);
        Assert.Equal(toTime, criteria.ToTime);
        Assert.Equal(1, criteria.SportId);
    }

    [Fact]
    public async Task GetMatches_WhenCacheReturnEmptyAndInRangeTimeout_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        List<Match> tmpMatches = null;
        var key = fixture.Create<string>();
        var today = DateTime.UtcNow.Date;
        var eventDate = today.AddDays(1);
        var fromTime = eventDate.AddHours(-7);
        var toTime = eventDate.AddDays(1).AddSeconds(-1).AddHours(-7);
        var criteria = new GetMatchByDateCriteria
        {
            EventDate = eventDate,
            Timezone = 7
        };
        var controller = GetController();
        cacheService.GetAsync<IList<Match>>(Arg.Do<string>(x => x = key)).Returns(tmpMatches);
        matchService.GetMatchByDateAsync(criteria).Returns(matches);

        // Act
        var result = await controller.GetMatches(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(matches, actual);

        Assert.Equal(eventDate, criteria.EventDate);
        Assert.Equal(7, criteria.Timezone);
        Assert.Equal(fromTime, criteria.FromTime);
        Assert.Equal(toTime, criteria.ToTime);
        Assert.Equal(1, criteria.SportId);
        await cacheService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IList<Match>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetMatches_WhenCacheReturnEmptyAndDateMoreThanTwo_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        List<Match> tmpMatches = null;
        var key = fixture.Create<string>();
        var today = DateTime.UtcNow.Date;
        var eventDate = today.AddDays(3);
        var fromTime = eventDate.AddHours(-7);
        var toTime = eventDate.AddDays(1).AddSeconds(-1).AddHours(-7);
        var criteria = new GetMatchByDateCriteria
        {
            EventDate = eventDate,
            Timezone = 7
        };
        var controller = GetController();
        cacheService.GetAsync<IList<Match>>(Arg.Do<string>(x => x = key)).Returns(tmpMatches);
        matchService.GetMatchByDateAsync(criteria).Returns(matches);

        // Act
        var result = await controller.GetMatches(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(matches, actual);

        Assert.Equal(eventDate, criteria.EventDate);
        Assert.Equal(7, criteria.Timezone);
        Assert.Equal(fromTime, criteria.FromTime);
        Assert.Equal(toTime, criteria.ToTime);
        Assert.Equal(1, criteria.SportId);
        await cacheService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IList<Match>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetMatches_WhenCacheReturnEmptyAndDateLowerThanTwo_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        List<Match> tmpMatches = null;
        var key = fixture.Create<string>();
        var today = DateTime.UtcNow.Date;
        var eventDate = today.AddDays(-3);
        var fromTime = eventDate.AddHours(-7);
        var toTime = eventDate.AddDays(1).AddSeconds(-1).AddHours(-7);
        var criteria = new GetMatchByDateCriteria
        {
            EventDate = eventDate,
            Timezone = 7
        };
        var controller = GetController();
        cacheService.GetAsync<IList<Match>>(Arg.Do<string>(x => x = key)).Returns(tmpMatches);
        matchService.GetMatchByDateAsync(criteria).Returns(matches);

        // Act
        var result = await controller.GetMatches(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(matches, actual);

        Assert.Equal(eventDate, criteria.EventDate);
        Assert.Equal(7, criteria.Timezone);
        Assert.Equal(fromTime, criteria.FromTime);
        Assert.Equal(toTime, criteria.ToTime);
        Assert.Equal(1, criteria.SportId);
        await cacheService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IList<Match>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetMatches_WhenCacheReturnExpectedData_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var key = fixture.Create<string>();
        var today = DateTime.UtcNow.Date;
        var eventDate = today.AddDays(3);
        var fromTime = eventDate.AddHours(-7);
        var toTime = eventDate.AddDays(1).AddSeconds(-1).AddHours(-7);
        var criteria = new GetMatchByDateCriteria
        {
            EventDate = eventDate,
            Timezone = 7
        };
        var controller = GetController();
        cacheService.GetAsync<IList<Match>>(Arg.Do<string>(x => x = key)).Returns(matches);
        matchService.GetMatchByDateAsync(criteria).Returns(matches);

        // Act
        var result = await controller.GetMatches(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(matches, actual);

        Assert.Equal(eventDate, criteria.EventDate);
        Assert.Equal(7, criteria.Timezone);
        Assert.Equal(fromTime, criteria.FromTime);
        Assert.Equal(toTime, criteria.ToTime);
        Assert.Equal(1, criteria.SportId);
    }

    #endregion

    #region GetMatchesBySeason

    [Fact]
    public async Task GetMatchesBySeason_ParamIsNULL_ReturnExpectedJsonResult()
    {
        // Arrange
        var league = fixture.Create<League>();
        var matches = fixture.Create<IList<Match>>();
        GetMatchBySeasonParams model = null;
        var criteria = new GetMatchBySeasonCriteria();
        var controller = GetController();
        matchService.GetMatchBySeasonAsync(Arg.Do<GetMatchBySeasonCriteria>(x => criteria = x)).Returns((league, matches));

        // Act
        var result = await controller.GetMatchesBySeason(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Null(jsonResult.Value);
    }

    [Fact]
    public async Task GetMatchesBySeason_SeasonIdEquals0_ReturnExpectedJsonResult()
    {
        // Arrange
        var date = new DateTime(2022, 5, 25, 0, 0, 0);
        var fromTime = date.AddMonths(-6).AddHours(-7);
        var toTime = date.AddDays(1).AddSeconds(-1).AddMonths(6).AddHours(-7);
        var league = fixture.Create<League>();
        var matches = fixture.Create<IList<Match>>();
        var model = new GetMatchBySeasonParams
        {
            LeagueId = 1,
            Date = date,
            Timezone = 7
        };
        var criteria = new GetMatchBySeasonCriteria();
        var controller = GetController();
        matchService.GetMatchBySeasonAsync(Arg.Do<GetMatchBySeasonCriteria>(x => criteria = x)).Returns((league, matches));

        // Act
        var result = await controller.GetMatchesBySeason(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actualLeague = Assert.IsAssignableFrom<League>(jsonResult.Value.GetType().GetProperty("league").GetValue(jsonResult.Value));
        var actualMatches = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value.GetType().GetProperty("matches").GetValue(jsonResult.Value));
        Assert.Equal(league, actualLeague);
        Assert.Equal(matches, actualMatches);

        Assert.Equal(1, criteria.LeagueId);
        Assert.Equal(0, criteria.SeasonId);
        Assert.Equal(fromTime, criteria.FromTime);
        Assert.Equal(toTime, criteria.ToTime);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(1)]
    public async Task GetMatchesBySeason_SeasonIdNotEquals0_ReturnExpectedJsonResult(long seasonId)
    {
        // Arrange
        var date = new DateTime(2022, 5, 25);
        var league = fixture.Create<League>();
        var matches = fixture.Create<IList<Match>>();
        var model = new GetMatchBySeasonParams
        {
            LeagueId = 1,
            SeasonId = seasonId,
            Date = date,
            Timezone = 7
        };
        var criteria = new GetMatchBySeasonCriteria();
        var controller = GetController();
        matchService.GetMatchBySeasonAsync(Arg.Do<GetMatchBySeasonCriteria>(x => criteria = x)).Returns((league, matches));

        // Act
        var result = await controller.GetMatchesBySeason(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actualLeague = Assert.IsAssignableFrom<League>(jsonResult.Value.GetType().GetProperty("league").GetValue(jsonResult.Value));
        var actualMatches = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value.GetType().GetProperty("matches").GetValue(jsonResult.Value));
        Assert.Equal(league, actualLeague);
        Assert.Equal(matches, actualMatches);

        Assert.Equal(1, criteria.LeagueId);
        Assert.Equal(seasonId, criteria.SeasonId);
        Assert.Null(criteria.FromTime);
        Assert.Null(criteria.ToTime);
    }

    #endregion

    #region GetLiveMatches
    [Fact]
    public async Task GetLiveMatches_WhenCacheIsDisabled_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var controller = GetController(false);
        matchService.GetLiveMatchAsync().Returns(matches);

        // Act
        var result = await controller.GetLiveMatches();

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(matches, actual);
    }

    [Fact]
    public async Task GetLiveMatches_WhenCacheReturnNull_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        List<Match> tmpMatches = null;
        var controller = GetController();
        var key = fixture.Create<string>();
        cacheService.GetAsync<IList<Match>>(Arg.Do<string>(x => x = key)).Returns(tmpMatches);
        matchService.GetLiveMatchAsync().Returns(matches);
        // Act
        var result = await controller.GetLiveMatches();

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(matches, actual);
        await cacheService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IList<Match>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetLiveMatches_WhenCacheReturnExpectedData_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var controller = GetController();
        var key = fixture.Create<string>();
        cacheService.GetAsync<IList<Match>>(Arg.Do<string>(x => x = key)).Returns(matches);
        // Act
        var result = await controller.GetLiveMatches();

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(matches, actual);
    }

    #endregion

    [Fact]
    public async Task GetSeasonStandings_WhenCalled_ReturnExpectedJsonResult()
    {
        // Arrange
        var criteria = fixture.Create<GetSeasonStandingsCriteria>();
        var standings = fixture.Create<IList<SeasonStandings>>();
        var controller = GetController();
        matchService.GetSeasonStandingsAsync(criteria).Returns(standings);

        // Act
        var result = await controller.GetSeasonStandings(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<SeasonStandings>>(jsonResult.Value);
        Assert.Equal(standings, actual);
    }

    [Fact]
    public async Task GetMajorLeagues_WhenCalled_ReturnExpectedJsonResult()
    {
        // Arrange
        var leagues = fixture.Create<IList<League>>();
        var controller = GetController();
        leagueService.GetMajorLeagueAsync().Returns(leagues);

        // Act
        var result = await controller.GetMajorLeagues();

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<League>>(jsonResult.Value);
        Assert.Equal(leagues, actual);
    }

    [Fact]
    public async Task GetMatchDetail_ParamIsNULL_ReturnExpectedJsonResult()
    {
        // Arrange
        GetMatchByIdCriteria criteria = null;
        var controller = GetController();

        // Act
        var result = await controller.GetMatchDetail(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Null(jsonResult.Value);
    }

    [Fact]
    public async Task GetMatchDetail_WhenCalled_ReturnExpectedJsonResult()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var statistic = fixture.Create<Statistic>();
        var headToHead = fixture.Create<HeadToHeadDetail>();
        var lineup = fixture.Create<LineupDetail>();
        var incidents = fixture.Create<IEnumerable<MatchIncident>>();
        var criteria = fixture.Create<GetMatchByIdCriteria>();
        var getMatchByIdCriteria = new GetMatchByIdCriteria();
        var getMatchStatisticCriteria = new GetMatchStatisticCriteria();
        var getHeadToHeadCriteria = new GetHeadToHeadCriteria();
        var getMatchLineupCriteria = new GetMatchLineupCriteria();
        var getMatchIncidentCriteria = new GetMatchIncidentCriteria();
        var controller = GetController();
        matchService.GetMatchByIdAsync(Arg.Do<GetMatchByIdCriteria>(x => getMatchByIdCriteria = x)).Returns(match);
        matchService.GetMatchStatisticAsync(Arg.Do<GetMatchStatisticCriteria>(x => getMatchStatisticCriteria = x)).Returns(statistic);
        matchService.GetHeadToHeadAsync(Arg.Do<GetHeadToHeadCriteria>(x => getHeadToHeadCriteria = x)).Returns(headToHead);
        matchService.GetLineupAsync(Arg.Do<GetMatchLineupCriteria>(x => getMatchLineupCriteria = x)).Returns(lineup);
        matchService.GetMatchIncidentAsync(Arg.Do<GetMatchIncidentCriteria>(x => getMatchIncidentCriteria = x)).Returns(incidents);

        // Act
        var result = await controller.GetMatchDetail(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<MatchDetail>(jsonResult.Value);
        Assert.Equal(match, actual.GeneralInfo);
        Assert.Equal(statistic, actual.Statistic);
        Assert.Equal(headToHead, actual.HeadToHead);
        Assert.Equal(lineup, actual.Lineup);
        Assert.Equal(incidents, actual.Incidents);

        Assert.Equal(criteria.MatchId, getMatchByIdCriteria.MatchId);
        Assert.Equal(criteria.MatchId, getMatchStatisticCriteria.MatchId);
        Assert.Equal(criteria.MatchId, getHeadToHeadCriteria.MatchId);
        Assert.Equal(criteria.MatchId, getMatchLineupCriteria.MatchId);
        Assert.Equal(criteria.MatchId, getMatchIncidentCriteria.MatchId);
    }

    [Fact]
    public async Task GetFavMatches_WhenParamJsonIsValid_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var liveMatches = fixture.Create<IList<Match>>();
        var criteria = new GetMatchByIdsCriteria {MatchIds = "[1234, 2345]" };
        var controller = GetController();
        matchService.GetMatchByIdsAsync(criteria).Returns(matches);
        matchService.GetLiveMatchAsync().Returns(liveMatches);

        // Act
        var result = await controller.GetFavMatches(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<MatchFavourite>(jsonResult.Value);
        Assert.Equal(matches, actual.Matches);
        Assert.Equal(liveMatches, actual.LiveMatches);
    }

    [Fact]
    public async Task GetFavMatches_WhenParamJsonIsInvalid_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var liveMatches = fixture.Create<IList<Match>>();
        var criteria = new GetMatchByIdsCriteria {MatchIds = "abc" };
        var controller = GetController();
        matchService.GetMatchByIdsAsync(criteria).Returns(matches);
        matchService.GetLiveMatchAsync().Returns(liveMatches);

        // Act
        var result = await controller.GetFavMatches(criteria);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Null(jsonResult.Value);
    }

    [Fact]
    public async Task GetFavLeagues_WhemParamsIsNull_ReturnExpectedJsonResult()
    {
        // Arrange
        var leagues = fixture.Create<IList<League>>();
        var model = new FavLeagueModel {LeagueIds = null};
        var controller = GetController();
        leagueService.GetMajorLeagueAsync().Returns(leagues);

        // Act
        var result = await controller.GetFavLeagues(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<League>>(jsonResult.Value);
        Assert.Equal(leagues, actual);
    }

    [Fact]
    public async Task GetFavLeagues_WhemParamsIsNotNullAndDataIsValid_ReturnExpectedJsonResult()
    {
        // Arrange
        var leagues = fixture.Create<IList<League>>();
        var criteria = fixture.Create<GetLeagueByIdsCriteria>();
        var model = new FavLeagueModel { LeagueIds = "1" };
        var controller = GetController();
        leagueService.GetLeagueByIdsAsync(Arg.Do<GetLeagueByIdsCriteria>(x => criteria = x)).Returns(leagues);

        // Act
        var result = await controller.GetFavLeagues(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<League>>(jsonResult.Value);
        Assert.Equal(leagues, actual);
    }

    [Fact]
    public async Task GetFavLeagues_WhemParamsIsNotNullAndDataIsInValid_ReturnExpectedJsonResult()
    {
        // Arrange
        fixture.Create<IList<League>>();
        fixture.Create<GetLeagueByIdsCriteria>();
        var model = new FavLeagueModel { LeagueIds = ".abc" };
        var controller = GetController();

        // Act
        var result = await controller.GetFavLeagues(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Null(jsonResult.Value);
    }

    [Fact]
    public async Task GetLeagues_WhemCalled_ReturnExpectedJsonResult()
    {
        // Arrange
        var leagues = fixture.Create<IList<League>>();
        var controller = GetController();
        dataControlService.GetLeagues().Returns(leagues);

        // Act
        var result = await controller.GetLeagues();

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<League>>(jsonResult.Value);
        Assert.Equal(leagues, actual);
    }

    [Fact]
    public async Task GetMatchByIds_WhemCalled_ReturnExpectedJsonResult()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var matchIds = fixture.Create<string>();
        var controller = GetController();
        var criteria = fixture.Create<GetMatchByIdsCriteria>();
        matchService.GetMatchByIdsAsync(Arg.Do<GetMatchByIdsCriteria>(x => criteria = x)).Returns(matches);

        // Act
        var result = await controller.GetMatchByIds(matchIds);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<IList<Match>>(jsonResult.Value);
        Assert.Equal(matches, actual);
    }

    #region Helpers

    private SoccerController GetController(bool enabledCache = true)
    {
        var cacheConfigs = new LivescoreMainPageCacheConfig
        {
            Enabled = enabledCache,
            DateRange = 2,
            OutOfRangeTimeout = 5
        };
        var options = Substitute.For<IOptionsSnapshot<LivescoreMainPageCacheConfig>>();
        options.Value.Returns(cacheConfigs);

        cacheService = Substitute.For<ICacheWrapperService>();
        dataControlService = Substitute.For<IDataControlService>();
        leagueService = Substitute.For<ILeagueService>();
        matchService = Substitute.For<IMatchService>();
        configuration = Substitute.For<IConfiguration>() ;
        return new SoccerController(options, cacheService, leagueService, matchService, configuration, dataControlService);
    }

    #endregion
}