namespace SabaNews.Site.UnitTests.Areas.Admin.Controller.Livescore;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Livescore.MatchManagement;
using SabaNews.Models.Livescore.StandingManagement;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers.Livescore;
using System.Collections.Generic;
using System.Threading.Tasks;
using SabaNews.Livescore.Services.Interfaces;
using Xunit;

public class StandingManagementControllerTests
{
    private ILeagueService leagueService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task Index_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        var expectedLeague = fixture.Create<IList<League>>();

        leagueService.GetLeaguesAsync().Returns(expectedLeague);
        //Act
        var result = await controller.Index();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<MatchManageModel>(viewResult.Model);
        Assert.Equal(expectedLeague, viewModel.Leagues);
        Assert.IsType<ViewResult>(result);
    }

    [Fact]
    public async Task GetDataGrid_WhenCalled_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetLeagueSeasonStandingCriteria>();
        var model = fixture.Create<StandingFilterModel>();
        var expected = new List<SeasonStandings>
        {
            new() { GroupName = "A" },
            new() { GroupName = "B" },
            new() { GroupName = "A" }
        };
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => x = criteria)).Returns(expected);
        //Act
        var result = await controller.GetDataGrid(model);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<StandingManageGridViewModel>(viewResult.Model);
        Assert.Equal(2, viewModel.Groups.Count);
    }

    [Fact]
    public async Task EditStanding_WhenStandingAlreadyEdit_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var seasonId = fixture.Create<int>();
        var stageId = fixture.Create<int>();
        var teamId = fixture.Create<int>();
        var criteria = fixture.Create<GetLeagueSeasonStandingDetailCriteria>();
        var expectedStanding = fixture.Create<SeasonStandingUpdate>();
        var criteriaGroup = fixture.Create<GetLeagueSeasonStandingCriteria>();
        var expectedGroup = fixture.Create<IList<SeasonStandings>>();

        leagueService.GetLeagueSeasonStandingDetailAsync(Arg.Do<GetLeagueSeasonStandingDetailCriteria>(x => x = criteria)).Returns(expectedStanding);
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => x = criteriaGroup)).Returns(expectedGroup);
        //Act
        var result = await controller.EditStanding(seasonId, stageId, teamId, teamId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<StandingUpdateViewModel>(viewResult.Model);
        Assert.Equal(expectedStanding, viewModel.Standing);
    }

    [Fact]
    public async Task EditStanding_WhenFirstEdit_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var seasonId = fixture.Create<int>();
        var stageId = fixture.Create<int>();
        var teamId = fixture.Create<int>();
        var criteria = fixture.Create<GetLeagueSeasonStandingDetailCriteria>();
        var expectedStanding = fixture.Create<SeasonStandingUpdate>();
        var criteriaGroup = fixture.Create<GetLeagueSeasonStandingCriteria>();
        var expectedGroup = fixture.Create<IList<SeasonStandings>>();
        expectedStanding.GroupNameCustom = null;

        leagueService.GetLeagueSeasonStandingDetailAsync(Arg.Do<GetLeagueSeasonStandingDetailCriteria>(x => x = criteria)).Returns(expectedStanding);
        leagueService.GetLeagueSeasonStanding(Arg.Do<GetLeagueSeasonStandingCriteria>(x => x = criteriaGroup)).Returns(expectedGroup);
        //Act
        var result = await controller.EditStanding(seasonId, stageId, teamId, teamId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<StandingUpdateViewModel>(viewResult.Model);
        Assert.Equal(expectedStanding, viewModel.Standing);
    }

    [Fact]
    public async Task EditStanding_WhenNotUpdateGroupName_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<StandingUpdateModel>();
        model.GroupName = null;
        fixture.Create<UpdateMatchCommand>();
        var criteria = fixture.Create<GetLeagueSeasonStandingDetailCriteria>();
        var expectedStanding = fixture.Create<SeasonStandingUpdate>();
        expectedStanding.GroupNameCustom = null;
        var expectedUpdateResult = fixture.Create<CommandResult>();

        leagueService.GetLeagueSeasonStandingDetailAsync(Arg.Do<GetLeagueSeasonStandingDetailCriteria>(x => x = criteria)).Returns(expectedStanding);
        leagueService.UpdateStandingAsync(Arg.Do<StandingUpdateModel>(x => x = model)).Returns(expectedUpdateResult);
        //Act
        var result = await controller.EditStanding(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedUpdateResult, jsonResult.Value);
    }

    [Fact]
    public async Task EditStanding_WhenUpdateGroupNameOrigin_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<StandingUpdateModel>();
        model.GroupName = "group A";
        fixture.Create<UpdateMatchCommand>();
        var criteria = fixture.Create<GetLeagueSeasonStandingDetailCriteria>();
        var expectedStanding = fixture.Create<SeasonStandingUpdate>();
        expectedStanding.GroupNameCustom = null;
        expectedStanding.GroupName = "group";
        var expectedUpdateResult = fixture.Create<CommandResult>();

        leagueService.GetLeagueSeasonStandingDetailAsync(Arg.Do<GetLeagueSeasonStandingDetailCriteria>(x => x = criteria)).Returns(expectedStanding);
        leagueService.UpdateStandingAsync(Arg.Do<StandingUpdateModel>(x => x = model)).Returns(expectedUpdateResult);
        //Act
        var result = await controller.EditStanding(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedUpdateResult, jsonResult.Value);
    }

    [Fact]
    public async Task EditStanding_WhenUpdateGroupNameCutom_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<StandingUpdateModel>();
        model.GroupName = "group A";
        fixture.Create<UpdateMatchCommand>();
        var criteria = fixture.Create<GetLeagueSeasonStandingDetailCriteria>();
        var expectedStanding = fixture.Create<SeasonStandingUpdate>();
        expectedStanding.GroupNameCustom = "group 1";
        expectedStanding.GroupName = "group";
        var expectedUpdateResult = fixture.Create<CommandResult>();

        leagueService.GetLeagueSeasonStandingDetailAsync(Arg.Do<GetLeagueSeasonStandingDetailCriteria>(x => x = criteria)).Returns(expectedStanding);
        leagueService.UpdateStandingAsync(Arg.Do<StandingUpdateModel>(x => x = model)).Returns(expectedUpdateResult);
        //Act
        var result = await controller.EditStanding(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedUpdateResult, jsonResult.Value);
    }

    #region Helpers
    private StandingManagementController GetController()
    {
        leagueService = Substitute.For<ILeagueService>();
        Substitute.For<IMatchService>();
        Substitute.For<IFileService>();
        var controller = new StandingManagementController(leagueService);

        return controller;
    }

    #endregion Helpers
}