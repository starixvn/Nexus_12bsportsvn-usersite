namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Criteria.Event.WorldCup;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Event.WorldCup;
using SabaNews.Models.ViewModel.Event.WorldCup;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using SabaNews.Site.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SabaNews.Livescore.Services.Interfaces;
using Xunit;

public class MinigameWorldCup2022ControllerTests : AdminController
{
    private IWorldCupService worldcupService;
    private IExportExcelService excelService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void MembershipEvent_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.MinigameWorldCup2022();

        // Assert
        Assert.IsType<ViewResult>(result);
    }

    [Fact]
    public void CountUser_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.CountUser();

        // Assert
        Assert.IsType<ViewResult>(result);
    }

    [Fact]
    public async Task GetDataMinigameWorldCup2022_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var criteria = fixture.Create<GetMinigameUsersByStageCriteria>();
        var param = fixture.Create<UserFilterMembershipEventModel>();
        var expected = fixture.Create<IList<UserMinigameModel>>();
        var matches = fixture.Create<IList<Match>>();

        worldcupService.GetMinigameUsersAsync(criteria).Returns(expected);
        worldcupService.GetMatchWCBySeasonAsync(criteriaMatch).Returns(matches);

        expected = WorldCupHelper.CalculatorPointer(matches, expected);
        var miniGamesPaging = expected.Skip(param.PageSize * (param.Page - 1)).Take(param.PageSize).ToList();

        //Act
        var result = await controller.GetDataMinigameWorldCup2022(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsType<MinigameGridViewModel>(viewResult.Model);
        Assert.Equal(miniGamesPaging, viewModel.MiniGames);
    }

    [Fact]
    public async Task GetCountUserGrid_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var minigames = fixture.Create<IList<UserMinigameModel>>();
        var dateSearch = "2022-12-04 15:24:28";
        worldcupService.GetMinigameAllUsersAsync().Returns(minigames);

        //Act
        var result = await controller.GetCountUserGrid(dateSearch);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("_CountUserGrid", viewResult.ViewName);
    }

    [Fact]
    public async Task GetDetailUser_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<ManagementDetailMinigameViewModel>();
        var matches = fixture.Create<IList<Match>>();
        var minigames = fixture.Create<IList<UserMinigameModel>>();
        var criteriaVotesUser = new GetMinigameByUserStageCriteria
        {
            Stage = param.StageDetail,
            UserId = param.UserId
        };
        var criteriaVoteMinigame = new GetMinigameUsersByStageCriteria
        {
            stage = param.StageDetail
        };
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };

        worldcupService.GetMatchWCBySeasonAsync(Arg.Do<GetMatchBySeasonCriteria>(x => criteriaMatch = x)).Returns(matches);
        worldcupService.GetMinigameByUserStageAsync(Arg.Do<GetMinigameByUserStageCriteria>(x => criteriaVotesUser = x)).Returns(minigames);
        worldcupService.GetMinigameUsersAsync(Arg.Do<GetMinigameUsersByStageCriteria>(x => criteriaVoteMinigame = x)).Returns(minigames);

        //Act
        var result = await controller.GetDetailUser(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("_DetailPlayerVotes", viewResult.ViewName);
    }

    [Fact]
    public async Task ExportExcel_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();

        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var criteria = fixture.Create<GetMinigameUsersByStageCriteria>();
        var param = fixture.Create<byte>();
        var expected = fixture.Create<IList<UserMinigameModel>>();
        var matches = fixture.Create<IList<Match>>();

        worldcupService.GetMinigameUsersAsync(criteria).Returns(expected);
        worldcupService.GetMatchWCBySeasonAsync(criteriaMatch).Returns(matches);

        expected = WorldCupHelper.CalculatorPointer(matches, expected);
        var excelModel = fixture.Create<IEnumerable<UserMinigameModel>>();
        var expectedExcelResult = fixture.Create<byte[]>();
        excelService.ExportMinigameWorldCup2022(Arg.Do<IEnumerable<UserMinigameModel>>(x => excelModel = x)).Returns(expectedExcelResult);
        //Act
        var result = await controller.ExportExcel(param) as FileContentResult;

        // Assert
        Assert.Equal(expectedExcelResult, result.FileContents);
        Assert.Equal("application/xlsx", result.ContentType);
        Assert.Equal("MiniGameWorldCup2022.xlsx", result.FileDownloadName);
    }

    #region Helpers
    private MinigameWorldCup2022Controller GetController()
    {
        Substitute.For<ILeagueService>();
        excelService = Substitute.For<IExportExcelService>();
        worldcupService = Substitute.For<IWorldCupService>();
        var controller = new MinigameWorldCup2022Controller(excelService, worldcupService);

        return controller;
    }

    #endregion Helpers
}