namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Site.Areas.Admin.Controllers;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SabaNews.Livescore.Services.Interfaces;
using Xunit;

public class TopScorerManagementControllerTests : AdminController
{
    private ILeagueService leagueService;

    [Fact]
    public async Task TopScorerManagement_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = await controller.Index();

        // Assert
        Assert.IsType<ViewResult>(result);
    }

    [Fact]
    public async Task GetTopScorersData_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var search = new Fixture().Create<string>();
        var leagueId = new Fixture().Create<long>();
        var seasonId = new Fixture().Create<long>();
        var expected = new Fixture().Create<IList<TopScorers>>();
        leagueService.GetAllTopScorersAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);
        //Act
        var result = await controller.GetTopScorersData(search, leagueId, seasonId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("_TopScorersManagementDataGrid", viewResult.ViewName);
    }

    [Fact]
    public async Task AddPlayer_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var standingsCriteria = new GetLeagueSeasonStandingCriteria { LeagueId = WorldCup2022.LeagueIdWorldCup2022, SeasonId = WorldCup2022.SeasonIdWorldCup2022 };

        var topScorers = new Fixture().Create<IList<TopScorers>>();
        var teams = new Fixture().Create<IList<SeasonStandings>>();
        var player = new Fixture().Create<IList<Player>>();
            
        var leagueId = new Fixture().Create<long>();
        var seasonId = new Fixture().Create<long>();

        leagueService.GetAllTopScorersAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(topScorers);
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => standingsCriteria = x)).Returns(teams);
        leagueService.GetPlayerByIdTeamAsync(teams[0].TeamId).Returns(player);

        //Act
        var result = await controller.AddPlayer(leagueId, seasonId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("_AddPlayerDataGrid", viewResult.ViewName);
    }

    [Fact]
    public async Task GetAllLeagueById_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var command = new Fixture().Create<CommandResult>();
        var topScorers = new Fixture().Create<TopScorers>();
        leagueService.InsertTopScorerAsync(topScorers).Returns(command);
        //Act
        var result = await controller.AddPlayer(topScorers);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(command, jsonResult.Value);

    }

    [Fact]
    public async Task GetPlayerByTeamId_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var teamId = new Fixture().Create<long>();
        var players = new Fixture().Create<IList<Player>>();
        var topScorers = new Fixture().Create<IList<TopScorers>>();

        var leagueId = new Fixture().Create<long>();
        var seasonId = new Fixture().Create<long>();

        players = players.Where(x => !topScorers.Any(y => y.PlayerId == x.PlayerId)).ToList();

        leagueService.GetPlayerByIdTeamAsync(teamId).Returns(players);
        leagueService.GetAllTopScorersAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(topScorers);
        //Act
        var result = await controller.GetPlayerByTeamId(teamId, leagueId, seasonId);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(players, jsonResult.Value);

    }

    [Fact]
    public async Task UpdateTopScorers_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var standingsCriteria = new GetLeagueSeasonStandingCriteria { LeagueId = WorldCup2022.LeagueIdWorldCup2022, SeasonId = WorldCup2022.SeasonIdWorldCup2022 };
        var players = new Fixture().Create<IList<Player>>();
        var playUpdate = new Fixture().Create<IList<TopScorers>>();
        var model = new Fixture().Create<TopScorerUpdateModel>();

        var leagueId = new Fixture().Create<long>();
        var seasonId = new Fixture().Create<long>();

        var teams = new Fixture().Create<IList<SeasonStandings>>();
        var teamId = new Fixture().Create<int>();
        var rowNum = new Fixture().Create<int>();

        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => standingsCriteria = x)).Returns(teams);
        leagueService.GetPlayerByIdTeamAsync(teamId).Returns(players);
        leagueService.GetTopScorersByRowNumAsync(rowNum, leagueId,  seasonId).Returns(playUpdate);

        //Act
        var result = await controller.UpdateTopScorers(model);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("_EditPlayer", viewResult.ViewName);
    }

    [Fact]
    public async Task UpdateTopScorersPost_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var topScorers = new Fixture().Create<TopScorers>();
        var command = new Fixture().Create<CommandResult>();

        leagueService.UpdateTopScorerAsync(topScorers).Returns(command);
        //Act
        var result = await controller.UpdateTopScorers(topScorers);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(command, jsonResult.Value);

    }

    #region Helpers
    private TopScorerManagementController GetController()
    {
        leagueService = Substitute.For<ILeagueService>();
        var controller = new TopScorerManagementController(leagueService);

        return controller;
    }

    #endregion Helpers
}