namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using AutoFixture;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Livescore.Services.Criteria.Team;
using SabaNews.Models.Options;
using SabaNews.Models.Poll;
using SabaNews.Models.ViewModel.Event.Euro2024;
using SabaNews.Models.ViewModel.Poll;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using SabaNews.Site.Extensions;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Criteria.Minigame;
using Models.Minigame;
using Models.ViewModel.Euro2020;
using Xunit;

public class Euro2024ManagementControllerTests : AdminController
{
    private  IOptionService optionService;
    private  IPollService pollService;
    private  IEuro2024Service euro2024Service;
    private  IFileService fileService;
    private IDataControlService dataControlService;
    private readonly IFixture fixture = new Fixture();


    [Fact]
    public async Task  Poll_WhenOptionValueIsNull_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        Option option = null;
        var expectedPolls = fixture.Create<IList<QuestionModel>>();
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        pollService.GetAllPollAsync().Returns(expectedPolls);

        //Act
        var result = await controller.Poll();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<PollAdminViewModel>(viewResult.Model);
        Assert.Equal(0, viewModel.SelectedQuestId);
        Assert.Equal("-------", viewModel.SelectedQuest);
    }

    [Fact]
    public async Task  Poll_WhenHaveOptionValue_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        var option = new Option{
            OptionId = 1,
            OptionValue = "1"
        };
        var expectedPolls = fixture.Create<IList<QuestionModel>>();
        expectedPolls.Add(new QuestionModel {Id = 1, Question = "Who is win?"});
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        pollService.GetAllPollAsync().Returns(expectedPolls);

        //Act
        var result = await controller.Poll();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<PollAdminViewModel>(viewResult.Model);
        Assert.Equal(1, viewModel.SelectedQuestId);
        Assert.Equal("Who is win?", viewModel.SelectedQuest);
    }

    [Fact]
    public async Task  Team_WhenHaveOptionValue_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        var seasonId = fixture.Create<long>();
        var stageId = fixture.Create<long>();
            
        var teams = fixture.Create<IList<TeamStage>>();
        euro2024Service.GetTeamByStage(Arg.Do<long>(x => x = seasonId), Arg.Do<long>(x => x = stageId)).Returns(teams);

        //Act
        var result = await controller.Team();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IList<TeamStage>>(viewResult.Model);
        Assert.Equal(teams, viewModel);
    }

    [Fact]
    public void  TeamPlayer_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        var teamId = fixture.Create<long>();

        //Act
        var result = controller.TeamPlayer(teamId);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<long>(viewResult.Model);
        Assert.Equal(teamId, viewModel);
    }

    [Fact]
    public void  Minigame_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.Minigame();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal("~/Areas/Admin/Views/Euro2024Management/AdminMinigame.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task  GetPlayerGrid_WhenHaveOptionValue_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        var teamId = fixture.Create<long>();
            
        var teams = fixture.Create<IList<PlayerCustom>>();
        euro2024Service.GetTeamPlayerById(Arg.Do<long>(x => x = teamId)).Returns(teams);

        //Act
        var result = await controller.GetPlayerGrid(teamId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IList<PlayerCustom>>(viewResult.Model);
        Assert.Equal(teams, viewModel);
    }

    [Fact]
    public async Task CreatePlayer_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var controller = GetController();
        var model = new CreatTeamModel
        {
            TeamId = 1,
            PlayerName = "name",
            PlayerFullName = "home name",
            ShirtNumber = "11"
        };
        var stream = new MemoryStream();
        var header = new HeaderDictionary();
        model.Icon = new FormFile(new MemoryStream(), 0, stream.Length, "id_from_form", "test.png")
        {
            Headers = header,
            ContentType = "application/pdf"
        };
        var cmd = fixture.Create<CreateTeamPlayerCommand>();
        var expectedUpdateResult = fixture.Create<CommandResult>();
        var expectedUploadResult = new UploadResult { Code = Constants.SuccessCode, Message = "url", AbsoluteUrl = "url" };

        euro2024Service.CreatePlayerAsync(Arg.Do<CreateTeamPlayerCommand>(x => x = cmd)).Returns(expectedUpdateResult);
        fileService.UploadFileAsync(Arg.Do<IFormFile>(x => x = model.Icon), Arg.Do<string>(x => x = UploadDir.PlayerUploadFolder)).Returns(expectedUploadResult);
        //Act
        var result = await controller.CreatePlayer(model);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedUpdateResult, jsonResult.Value);
    }


    [Fact]
    public async Task  EditPlayer_WhenPlayerIsNotExisted_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        var playerId = fixture.Create<long>();
            
        PlayerCustom player = null;
        euro2024Service.GetPlayerById(Arg.Do<long>(x => x = playerId)).Returns(player);

        //Act
        var result = await controller.EditPlayer(playerId);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Null(jsonResult.Value);
    }

    [Fact]
    public async Task  EditPlayer_WhenPlayerIsExisted_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        var playerId = fixture.Create<long>();
            
        var teams = fixture.Create<PlayerCustom>();
        euro2024Service.GetPlayerById(Arg.Do<long>(x => x = playerId)).Returns(teams);

        //Act
        var result = await controller.EditPlayer(playerId);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<PlayerCustom>(viewResult.Model);
        Assert.Equal(teams, viewModel);
    }


    [Fact]
    public async Task EditPlayer_WhenSaveData_ReturnExpectedData()
    {
        //Arrange
        var controller = GetController();
        var model = new UpdateTeamModel
        {
            IsDeletedIcon = true,
            PlayerId = 1,
            PlayerName = "name",
            PlayerFullName = "home name",
            ShirtNumber = "11"
        };
        var stream = new MemoryStream();
        var header = new HeaderDictionary();
        model.Icon = new FormFile(new MemoryStream(), 0, stream.Length, "id_from_form", "test.png")
        {
            Headers = header,
            ContentType = "application/pdf"
        };

        var player = fixture.Create<PlayerCustom>();
        var cmd = fixture.Create<UpdateTeamPlayerCommand>();
        var expectedUpdateResult = fixture.Create<CommandResult>();
        var expectedUploadResult = new UploadResult { Code = Constants.SuccessCode, Message = "url", AbsoluteUrl = "url" };

            
        euro2024Service.GetPlayerById(Arg.Do<long>(x => x = model.PlayerId)).Returns(player);
        euro2024Service.UpdatePlayerAsync(Arg.Do<UpdateTeamPlayerCommand>(x => x = cmd)).Returns(expectedUpdateResult);
        fileService.UploadFileAsync(Arg.Do<IFormFile>(x => x = model.Icon), Arg.Do<string>(x => x = UploadDir.PlayerUploadFolder)).Returns(expectedUploadResult);
        //Act
        var result = await controller.EditPlayer(model);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedUpdateResult, jsonResult.Value);
    }

    [Fact]
    public async Task DeletePlayer_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var controller = GetController();
        var playerId = fixture.Create<long>();

        var player = fixture.Create<PlayerCustom>();
        fixture.Create<UpdateTeamPlayerCommand>();
        var expectedUpdateResult = fixture.Create<CommandResult>();
        var expectedUploadResult = new UploadResult { Code = Constants.SuccessCode, Message = "url", AbsoluteUrl = "url" };

            
        euro2024Service.GetPlayerById(Arg.Do<long>(x => x = playerId)).Returns(player);
        euro2024Service.DeletePlayerAsync(Arg.Do<long>(x => x = playerId)).Returns(expectedUpdateResult);
        fileService.DeleteFile(Arg.Do<string>(x => x = player.Icon), Arg.Do<string>(x => x = UploadDir.PlayerUploadFolder)).Returns(expectedUploadResult);
        //Act
        var result = await controller.DeletePlayer(playerId);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedUpdateResult, jsonResult.Value);
    }

    [Fact]
    public async Task UpdatePool_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var controller = GetController();

        var pollId = fixture.Create<long>();
        var optionKey = fixture.Create<string>();
        var expectedResult = fixture.Create<CommandResult>();

            
        optionService.UpdateOptionAsync(Arg.Do<string>(x => x = optionKey), Arg.Do<string>(x => x = pollId.ToString())).Returns(expectedResult);
        //Act
        var result = await controller.UpdatePoll(pollId);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedResult, jsonResult.Value);
    }

    [Fact]
    public async Task GetDataMinigameWorldCup2022_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
            
        var criteria = fixture.Create<GetLeagueMinigameByStageCriteria>();
        var param = fixture.Create<UserFilterMembershipEventModel>();
        var expected = fixture.Create<IList<MinigameModel>>();
        var leagueData = fixture.Create<MatchLeague>();
        var leagueId = fixture.Create<long>();
        param.Stage = 1;

        dataControlService.GetMinigameWithEmailByStage(criteria).Returns(expected);
        dataControlService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => leagueId = x)).Returns(leagueData);

        expected = EuroHelper.CalculatorPointer(leagueData.Matches, expected);
        var miniGamesPaging = expected.Skip(param.PageSize * (param.Page - 1)).Take(param.PageSize).ToList();

        //Act
        var result = await controller.GetDataMinigame(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsType<AdminMinigameGridViewModel>(viewResult.Model);
        Assert.Equal(miniGamesPaging, viewModel.MiniGames);
    }

    [Fact]
    public async Task GetDetailUser_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<ManagementDetailMinigameViewModel>();
        var leagueData = fixture.Create<MatchLeague>();
        var minigames = fixture.Create<IList<MinigameModel>>();
        var votes = fixture.Create<IList<MinigameModel>>();
        var leagueId = fixture.Create<long>();
        var criteriaVotesUser = new GetLeagueMinigameByUserStageCriteria
        {
            Stage = param.StageDetail,
            UserId = param.UserId
        };
        var criteriaVoteMinigame = new GetLeagueMinigameByStageCriteria
        {
            Stage = param.StageDetail,
            LeagueId = Euro2024.LeagueId,
            SeasonId = Euro2024.SeasonId
        };
           

        dataControlService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => leagueId = x)).Returns(leagueData);
        euro2024Service.GetLeagueMinigameByUserStageAsync(Arg.Do<GetLeagueMinigameByUserStageCriteria>(x => criteriaVotesUser = x)).Returns(votes);
        euro2024Service.GetLeagueMinigameByStageWithEmailAsync(Arg.Do<GetLeagueMinigameByStageCriteria>(x => criteriaVoteMinigame = x)).Returns(minigames);

        //Act
        var result = await controller.GetDetailUser(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("_DetailPlayerVotes", viewResult.ViewName);
    }


    #region Helpers
    private Euro2024ManagementController GetController()
    {
        optionService = Substitute.For<IOptionService>();
        pollService = Substitute.For<IPollService>();
        euro2024Service = Substitute.For<IEuro2024Service>();
        fileService = Substitute.For<IFileService>();
        dataControlService = Substitute.For<IDataControlService>();
        var controller = new Euro2024ManagementController(optionService, pollService, euro2024Service, fileService, dataControlService);

        return controller;
    }

    #endregion Helpers
}