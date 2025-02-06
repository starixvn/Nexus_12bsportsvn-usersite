namespace SabaNews.Services.UnitTests;

using AutoFixture;
using Fanex.Data.Repository;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Event.WorldCup;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Event.WorldCup;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

public class WorldCupServiceTests
{
    private IBaseService baseService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task GetMinigameByUserStageAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetWCService();
        var criteria = fixture.Create<GetMinigameByUserStageCriteria>();
        var expected = fixture.Create<IList<UserMinigameModel>>();
        baseService.GetDataAsync<UserMinigameModel>(Arg.Do<GetMinigameByUserStageCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.GetMinigameByUserStageAsync(criteria);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMinigameByUserAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetWCService();
        var userId = fixture.Create<long>();
        var criteria = fixture.Create<GetMinigameByUserCriteria>();
        var expected = fixture.Create<IList<UserMinigameModel>>();
        baseService.GetDataAsync<UserMinigameModel>(Arg.Do<GetMinigameByUserCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.GetMinigameByUserAsync(userId);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task UpdateMinigameVoteAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetWCService();
        var result = fixture.Create<CommandResult>();
        var criteria = fixture.Create<UpdateMinigameVoteCommand>();
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateMinigameVoteCommand>(x => criteria = x)).Returns(result);

        //Act
        var actual = await service.UpdateMinigameVoteAsync(criteria);

        //Assert
        Assert.Equal(result, actual);
    }

    [Fact]
    public async Task GetMinigameVoteMatchAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetWCService();
        fixture.Create<long>();
        var criteria = fixture.Create<GetMinigameVoteMatchCriteria>();
        var expected = fixture.Create<MinigameMatchVote>();
        baseService.GetDataEntityAsync<MinigameMatchVote>(Arg.Do<GetMinigameVoteMatchCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.GetMinigameVoteMatchAsync(criteria);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMinigameUsersAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetWCService();
        fixture.Create<long>();
        var criteria = fixture.Create<GetMinigameUsersByStageCriteria>();
        var expected = fixture.Create<IList<UserMinigameModel>>();
        baseService.GetDataAsync<UserMinigameModel>(Arg.Do<GetMinigameUsersByStageCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.GetMinigameUsersAsync(criteria);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMatchWCBySeasonAsync_WhenCalled_ReturnExpectedResult()
    {
        var service = GetWCService();
        var (leagues, season, floatMatches) = fixture.Create<(IEnumerable<League>, IEnumerable<Season>, IEnumerable<FloatMatchModel>)>();
        baseService.FetchMultipleAsync<League, Season, FloatMatchModel>(Arg.Any<ICriteria>()).Returns((leagues, season, floatMatches));

        var actual = await service.GetMatchWCBySeasonAsync(new GetMatchBySeasonCriteria());
        Assert.Equal(floatMatches.Count(), actual.Count);
    }

    #region Helpers
    private WorldCupService GetWCService()
    {
        baseService = Substitute.For<IBaseService>();
        var service = new WorldCupService(baseService);

        return service;
    }
    #endregion Helpers
}