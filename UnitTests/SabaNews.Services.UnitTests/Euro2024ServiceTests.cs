namespace SabaNews.Services.UnitTests;

using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using Criteria.Minigame;
using Fanex.Data.Repository;
using Livescore.Repositories.Interfaces;
using Models.Minigame;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Livescore.Services.Criteria.Team;
using SabaNews.Services;
using Xunit;

public class Euro2024ServiceTests
{
    private IBaseService baseService;
    private IMatchRepository matchRepository;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task GetTeamByStage_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
            

        var seasonId = fixture.Create<long>();
        var stageId = fixture.Create<long>();

        var teams = fixture.Create<IList<TeamStage>>();
        baseService.GetDataAsync<TeamStage>(Arg.Any<GetTeamByStageCriteria>()).Returns(teams);
        //Act
        var actual = await service.GetTeamByStage(seasonId, stageId);
        //Assert
        Assert.Equal(teams, actual);
    }

    [Fact]
    public async Task GetTeamPlayerById_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
            
        var teamId = fixture.Create<long>();

        var teams = fixture.Create<IList<PlayerCustom>>();
        baseService.GetDataAsync<PlayerCustom>(Arg.Any<GetPlayerCustomByTeamIdCriteria>()).Returns(teams);
        //Act
        var actual = await service.GetTeamPlayerById(teamId);
        //Assert
        Assert.Equal(teams, actual);
    }

    [Fact]
    public async Task GetPlayerById_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
            

        var playerId = fixture.Create<long>();
        fixture.Create<GetTeamByStageCriteria>();

        var player = fixture.Create<PlayerCustom>();
        baseService.GetDataEntityAsync<PlayerCustom>(Arg.Any<GetPlayerCustomByIdCriteria>()).Returns(player);
        //Act
        var actual = await service.GetPlayerById(playerId);
        //Assert
        Assert.Equal(player, actual);
    }

    [Fact]
    public async Task CreatePlayerAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var cmd = fixture.Create<CreateTeamPlayerCommand>();
        var expected = new CommandResult { Code = 0 };
        baseService.ExecuteNonQueryAsync(Arg.Do<CreateTeamPlayerCommand>(x => cmd = x)).Returns(expected);
        //Act
        var actual = await service.CreatePlayerAsync(cmd);
        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task UpdatePlayerAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var cmd = fixture.Create<UpdateTeamPlayerCommand>();
        var expected = new CommandResult { Code = 0 };
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateTeamPlayerCommand>(x => cmd = x)).Returns(expected);
        //Act
        var actual = await service.UpdatePlayerAsync(cmd);
        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task DeletePlayerAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var playerId = fixture.Create<long>();
        var cmd = fixture.Create<DeleteTeamPlayerCommand>();
        var expected = new CommandResult { Code = 0 };
        baseService.ExecuteNonQueryAsync(Arg.Do<DeleteTeamPlayerCommand>(x => cmd = x)).Returns(expected);
        //Act
        var actual = await service.DeletePlayerAsync(playerId);
        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMatchByTeamSeasonAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var matches = fixture.Create<IList<Match>>();

        var criteria = fixture.Create<GetMatchByTeamSeasonCriteria>();

        matchRepository.GetMatchBySeasonFilterAsync(Arg.Any<ICriteria>()).Returns(matches);
        //Act
        var actual = await service.GetMatchByTeamSeasonAsync(criteria);
        //Assert
        Assert.Equal(matches, actual);
    }

    [Fact]
    public async Task GetLeagueMinigameByUserStageAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();

        var minigameExpected = fixture.Create<IList<MinigameModel>>();
        var criteria = fixture.Create<GetLeagueMinigameByUserStageCriteria>();

        baseService.GetDataAsync<MinigameModel>(Arg.Any<GetLeagueMinigameByUserStageCriteria>()).Returns(minigameExpected);
        //Act
        var actual = await service.GetLeagueMinigameByUserStageAsync(criteria);
        //Assert
        Assert.Equal(minigameExpected, actual);
    }

    [Fact]
    public async Task GetMinigameByUserAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();

        var minigameExpected = fixture.Create<IList<MinigameModel>>();
        var userID = fixture.Create<long>();
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        fixture.Create<GetLeagueMinigameByUserCriteria>();

        baseService.GetDataAsync<MinigameModel>(Arg.Any<GetLeagueMinigameByUserCriteria>()).Returns(minigameExpected);
        //Act
        var actual = await service.GetMinigameByUserAsync(userID, leagueId, seasonId);
        //Assert
        Assert.Equal(minigameExpected, actual);
    }

    [Fact]
    public async Task GetLeagueMinigameByStageAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();

        var minigameExpected = fixture.Create<IList<UserMinigameModel>>();
        var criteria = fixture.Create<GetLeagueMinigameByStageCriteria>();

        baseService.GetDataAsync<UserMinigameModel>(Arg.Any<GetLeagueMinigameByStageCriteria>()).Returns(minigameExpected);
        //Act
        var actual = await service.GetLeagueMinigameByStageAsync(criteria);
        //Assert
        Assert.Equal(minigameExpected, actual);
    }


    [Fact]
    public async Task GetMinigameVoteMatchAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();

        var minigameExpected = fixture.Create<MinigameMatchVotedModel>();
        var criteria = fixture.Create<GetMinigameVotedMatchCriteria>();

        baseService.GetDataEntityAsync<MinigameMatchVotedModel>(Arg.Any<GetMinigameVotedMatchCriteria>()).Returns(minigameExpected);
        //Act
        var actual = await service.GetMinigameVoteMatchAsync(criteria);
        //Assert
        Assert.Equal(minigameExpected, actual);
    }

    [Fact]
    public async Task UpdateMinigameVoteAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var cmd = fixture.Create<UpdateMinigameVoteCommand>();
        var expected = new CommandResult { Code = 0 };
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateMinigameVoteCommand>(x => cmd = x)).Returns(expected);
        //Act
        var actual = await service.UpdateMinigameVoteAsync(cmd);
        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetLeagueMinigameByStageWithEmailAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();

        var minigameExpected = fixture.Create<IList<MinigameModel>>();
        var criteria = fixture.Create<GetLeagueMinigameByStageCriteria>();

        baseService.GetDataAsync<MinigameModel>(Arg.Any<GetLeagueMinigameByStageCriteria>()).Returns(minigameExpected);
        //Act
        var actual = await service.GetLeagueMinigameByStageWithEmailAsync(criteria);
        //Assert
        Assert.Equal(minigameExpected, actual);
    }

    private Euro2024Service GetService()
    {
        baseService = Substitute.For<IBaseService>();
        matchRepository = Substitute.For<IMatchRepository>();

        return new Euro2024Service(baseService, matchRepository);
    }
}