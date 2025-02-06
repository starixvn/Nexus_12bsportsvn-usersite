namespace SabaNews.Site.UnitTests.Areas.Admin.Controller.Livescore;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Livescore.MatchManagement;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using SabaNews.Site.Areas.Admin.Controllers.Livescore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using System.Linq;
using System;
using SabaNews.Core.Models;
using System.IO;
using Microsoft.AspNetCore.Http;
using SabaNews.Core.Constants;
using SabaNews.Livescore.Services.Interfaces;

public class MatchManagementControllerTests : AdminController
{

    private ILeagueService leagueService;
    private IMatchService matchService;
    private IFileService fileService;
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
    public async Task GetSeason_WhenCurrentSeasonIsZero_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var leagueId = fixture.Create<long>();
        var expectedLeague = fixture.Create<IList<Season>>();

        leagueService.GetSeasonByLeagueIdAsync(Arg.Do<long>(x => x = leagueId)).Returns(expectedLeague);
        //Act
        var result = await controller.GetSeason(leagueId, 0);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IList<Season>>(viewResult.Model);
        Assert.Equal(expectedLeague, viewModel);
    }

    [Fact]
    public async Task GetSeason_WhenCurrentSeasonNotInList_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var leagueId = fixture.Create<long>();
        var expectedSeason = new List<Season>
        {
            new() { SeasonId = 1, Year = "2023" },
            new() { SeasonId = 2, Year = "2022" }
        };

        leagueService.GetSeasonByLeagueIdAsync(Arg.Do<long>(x => x = leagueId)).Returns(expectedSeason);
        // expectedSeason.Add(new Season { SeasonId = 111, Year = "111" });
        //Act
        var result = await controller.GetSeason(leagueId, 111);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IList<Season>>(viewResult.Model);
        Assert.Equal(expectedSeason, viewModel);
    }

    [Fact]
    public async Task GetMatchGrid_WhenSearchASC_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        fixture.Create<int>();
        var criteria = fixture.Create<GetMatchBySeasonFilterCriteria>();
        var model = new MatchFilterModel
        {
            DateSort = "asc",
            SeasonId = 1,
            LeagueId = 1,
            Page = 1,
            PageSize = 2,
            Search = "team"
        };
        var expectedMatch = new List<SabaNews.Livescore.Models.Match.Match>
        {
            new()
            {
                MatchId = 1,
                StartTime = DateTime.Parse("2022-10-10"),
                HomeTeam = new Team { TeamNameEN = "home team 1", TeamNameVN = "home team vn 1" },
                AwayTeam = new Team { TeamNameEN = "away team 1" }
            },
            new()
            {
                MatchId = 2,
                StartTime = DateTime.Parse("2022-10-11"),
                HomeTeam = new Team { TeamNameEN = "home team 2" },
                AwayTeam = new Team { TeamNameEN = "away team 2" }
            },
            new()
            {
                MatchId = 3,
                StartTime = DateTime.Parse("2022-10-12"),
                HomeTeam = new Team { TeamNameEN = "home team 3" },
                AwayTeam = new Team { TeamNameEN = "away team 3" }
            }
        };

        matchService.GetMatchBySeasonFilterAsync(Arg.Do<GetMatchBySeasonFilterCriteria>(x => x = criteria)).Returns(expectedMatch);
        //Act
        var result = await controller.GetMatchGrid(model);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<MatchManageGridVewModel>(viewResult.Model);
        Assert.Equal(expectedMatch.Skip(0).Take(2).ToList(), viewModel.Matches);
    }

    [Fact]
    public async Task GetMatchGrid_WhenSearchDESC_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        fixture.Create<int>();
        var criteria = fixture.Create<GetMatchBySeasonFilterCriteria>();
        var model = new MatchFilterModel
        {
            DateSort = "desc",
            SeasonId = 1,
            LeagueId = 1,
            Page = 1,
            PageSize = 2
        };
        var expectedMatch = new List<SabaNews.Livescore.Models.Match.Match>
        {
            new()
            {
                MatchId = 1,
                StartTime = DateTime.Parse("2022-10-10"),
                HomeTeam = new Team { TeamNameEN = "home team 1" },
                AwayTeam = new Team { TeamNameEN = "away team 1" }
            },
            new()
            {
                MatchId = 2,
                StartTime = DateTime.Parse("2022-10-11"),
                HomeTeam = new Team { TeamNameEN = "home team 2" },
                AwayTeam = new Team { TeamNameEN = "away team 2" }
            },
            new()
            {
                MatchId = 3,
                StartTime = DateTime.Parse("2022-10-12"),
                HomeTeam = new Team { TeamNameEN = "home team 3" },
                AwayTeam = new Team { TeamNameEN = "away team 3" }
            }
        };
        var resultMatch = new List<SabaNews.Livescore.Models.Match.Match>
        {
            expectedMatch[2],
            expectedMatch[1]
        };

        matchService.GetMatchBySeasonFilterAsync(Arg.Do<GetMatchBySeasonFilterCriteria>(x => x = criteria)).Returns(expectedMatch);
        //Act
        var result = await controller.GetMatchGrid(model);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<MatchManageGridVewModel>(viewResult.Model);
        Assert.Equal(resultMatch, viewModel.Matches);
    }

    [Fact]
    public async Task EditMatch_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var matchId = fixture.Create<int>();
        var criteria = fixture.Create<GetMatchByIdCriteria>();
        var expectedMatch = fixture.Create<SabaNews.Livescore.Models.Match.Match>();

        matchService.GetMatchByIdAsync(Arg.Do<GetMatchByIdCriteria>(x => x = criteria)).Returns(expectedMatch);
        //Act
        var result = await controller.EditMatch(matchId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<SabaNews.Livescore.Models.Match.Match>(viewResult.Model);
        Assert.Equal(expectedMatch, viewModel);
    }

    [Fact]
    public async Task EditMatch_WhenNotUploadIcon_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var model = new MatchUpdateModel
        {
            IsDeletedAwayIcon = true,
            IsDeletedHomeIcon = true,
            StartTime = DateTime.Now,
            MatchId = 1,
            HomeTeamId = 1,
            HomeTeamNameVN = "home name",
            AwayTeamId = 2,
            AwayTeamNameVN = "away name",
            StageNameVN = "stage name",
            Status = 1,
            Round = 1,
            HomeTeamHalfScore = 2,
            AwayTeamHalfScore = 2,
            HomeTeamExtraScore = 1,
            AwayTeamExtraScore = 1,
            HomeTeamAggregateScore = 3,
            AwayTeamAggregateScore = 3,
            HomeTeamPenaltyScore = 4,
            AwayTeamPenaltyScore = 4
        };

        var cmd = fixture.Create<UpdateMatchCommand>();
        var criteria = fixture.Create<GetMatchByIdUpdateCriteria>();
        var expectedMatch = fixture.Create<MatchUpdate>();
        expectedMatch.HomeTeamHalfScore = 2;
        var expectedUpdateResult = fixture.Create<CommandResult>();

        matchService.GetMatchByIdUpdateAsync(Arg.Do<GetMatchByIdUpdateCriteria>(x => x = criteria)).Returns(expectedMatch);
        matchService.UpdateMatchAsync(Arg.Do<UpdateMatchCommand>(x => x = cmd)).Returns(expectedUpdateResult);
        //Act
        var result = await controller.EditMatch(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedUpdateResult, jsonResult.Value);
    }

    [Fact]
    public async Task EditMatch_WhenUploadIconSuccessful_ReturnExpectedData()
    {
        //Arrange
        var controller = GetController();
        var model = new MatchUpdateModel
        {
            IsDeletedAwayIcon = false,
            IsDeletedHomeIcon = false,
            StartTime = DateTime.MinValue,
            MatchId = 1,
            HomeTeamId = 1,
            HomeTeamNameVN = "home name",
            AwayTeamId = 2,
            AwayTeamNameVN = "away name",
            StageNameVN = "stage name",
            Status = 1,
            Round = 1,
            HomeTeamHalfScore = 2,
            AwayTeamHalfScore = 2,
            HomeTeamExtraScore = 1,
            AwayTeamExtraScore = 1,
            HomeTeamAggregateScore = 3,
            AwayTeamAggregateScore = 3,
            HomeTeamPenaltyScore = 4,
            AwayTeamPenaltyScore = 4
        };
        var stream = new MemoryStream();
        var header = new HeaderDictionary { { "Name", new string[] { "Value" } } };
        model.AwayIcon = new FormFile(new MemoryStream(), 0, stream.Length, "id_from_form", "test.png")
        {
            Headers = header,
            ContentType = "application/pdf"
        };
        model.HomeIcon = new FormFile(new MemoryStream(), 0, stream.Length, "id_from_form", "test.png")
        {
            Headers = header,
            ContentType = "application/pdf"
        };
        var cmd = fixture.Create<UpdateMatchCommand>();
        var criteria = fixture.Create<GetMatchByIdUpdateCriteria>();
        var expectedMatch = fixture.Create<MatchUpdate>();
        var expectedUpdateResult = fixture.Create<CommandResult>();
        var expectedUploadResult = new UploadResult { Code = Constants.SuccessCode, Message = "url", AbsoluteUrl = "url" };

        matchService.GetMatchByIdUpdateAsync(Arg.Do<GetMatchByIdUpdateCriteria>(x => x = criteria)).Returns(expectedMatch);
        matchService.UpdateMatchAsync(Arg.Do<UpdateMatchCommand>(x => x = cmd)).Returns(expectedUpdateResult);
        fileService.UploadFileAsync(Arg.Do<IFormFile>(x => x = model.AwayIcon), Arg.Do<string>(x => x = UploadDir.MatchTeamUploadFolder)).Returns(expectedUploadResult);
        //Act
        var result = await controller.EditMatch(model);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedUpdateResult, jsonResult.Value);
    }

    [Fact]
    public async Task EditMatch_WhenUploadIconFailed_ReturnExpectedData()
    {
        //Arrange
        var controller = GetController();
        var model = new MatchUpdateModel
        {
            IsDeletedAwayIcon = false,
            IsDeletedHomeIcon = false,
            StartTime = DateTime.Now,
            MatchId = 1,
            HomeTeamId = 1,
            HomeTeamNameVN = "home name",
            AwayTeamId = 2,
            AwayTeamNameVN = "away name",
            StageNameVN = "stage name",
            Status = 1,
            Round = 1,
            HomeTeamHalfScore = 2,
            AwayTeamHalfScore = 2,
            HomeTeamExtraScore = 1,
            AwayTeamExtraScore = 1,
            HomeTeamAggregateScore = 3,
            AwayTeamAggregateScore = 3,
            HomeTeamPenaltyScore = 4,
            AwayTeamPenaltyScore = 4
        };

        var stream = new MemoryStream();
        var header = new HeaderDictionary { { "Name", new string[] { "Value" } } };
        model.AwayIcon = new FormFile(new MemoryStream(), 0, stream.Length, "id_from_form", "test.png")
        {
            Headers = header,
            ContentType = "application/pdf"
        };
        model.HomeIcon = new FormFile(new MemoryStream(), 0, stream.Length, "id_from_form", "test.png")
        {
            Headers = header,
            ContentType = "application/pdf"
        };
        var cmd = fixture.Create<UpdateMatchCommand>();
        var criteria = fixture.Create<GetMatchByIdUpdateCriteria>();
        var expectedMatch = fixture.Create<MatchUpdate>();
        var expectedUpdateResult = fixture.Create<CommandResult>();
        var expectedUploadResult = new UploadResult { Message = "error code" };

        matchService.GetMatchByIdUpdateAsync(Arg.Do<GetMatchByIdUpdateCriteria>(x => x = criteria)).Returns(expectedMatch);
        matchService.UpdateMatchAsync(Arg.Do<UpdateMatchCommand>(x => x = cmd)).Returns(expectedUpdateResult);
        fileService.UploadFileAsync(Arg.Do<IFormFile>(x => x = model.AwayIcon), Arg.Do<string>(x => x = UploadDir.MatchTeamUploadFolder)).Returns(expectedUploadResult);
        //Act
        var result = await controller.EditMatch(model);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedUpdateResult, jsonResult.Value);
    }


    #region Helpers
    private MatchManagementController GetController()
    {
        leagueService = Substitute.For<ILeagueService>();
        matchService = Substitute.For<IMatchService>();
        fileService = Substitute.For<IFileService>();
        var controller = new MatchManagementController(leagueService, matchService, fileService);

        return controller;
    }

    #endregion Helpers
}