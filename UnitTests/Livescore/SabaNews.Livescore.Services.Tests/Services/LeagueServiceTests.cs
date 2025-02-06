namespace SabaNews.Livescore.Services.Tests.Services;

using AutoFixture;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Livescore.Services.Criteria.League;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class LeagueServiceTests
{
    private IBaseService baseService;
        

    [Fact]
    public async Task GetMajorLeagueAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var leagues = fixture.Create<IList<League>>();
        baseService.GetDataAsync<League>(Arg.Any<GetMajorLeagueCriteria>()).Returns(leagues);
        //Act
        var actual = await service.GetMajorLeagueAsync();
        //Assert
        Assert.Equal(leagues, actual);
    }

    [Fact]
    public async Task GetLeagueByIdsAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var leagues = fixture.Create<IList<League>>();
        baseService.GetDataAsync<League>(Arg.Any<GetLeagueByIdsCriteria>()).Returns(leagues);
        //Act
        var actual = await service.GetLeagueByIdsAsync(new GetLeagueByIdsCriteria());
        //Assert
        Assert.Equal(leagues, actual);
    }

    [Fact]
    public async Task GetPlayerByIdTeamAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var players = fixture.Create<IList<Player>>();
        var teamId = fixture.Create<long>();
        baseService.GetDataAsync<Player>(Arg.Any<GetPlayerByTeamIdCriteria>()).Returns(players);
        //Act
        var actual = await service.GetPlayerByIdTeamAsync(teamId);
        //Assert
        Assert.Equal(players, actual);
    }

    [Fact]
    public async Task GetTop10ScorersAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var topScorers = fixture.Create<IList<TopScorers>>();
        var scorersCriteria = fixture.Create<GetTop10ScorersCriteria>();
        baseService.GetDataAsync<TopScorers>(Arg.Any<GetTop10ScorersCriteria>()).Returns(topScorers);
        //Act
        var actual = await service.GetTop10ScorersAsync(scorersCriteria);
        //Assert
        Assert.Equal(topScorers, actual);
    }

    [Fact]
    public async Task GetAllTopScorersAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var topScorers = fixture.Create<IList<TopScorers>>();
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();

        baseService.GetDataAsync<TopScorers>(Arg.Any<GetAllTopScorersCriteria>()).Returns(topScorers);
        //Act
        var actual = await service.GetAllTopScorersAsync(leagueId, seasonId);
        //Assert
        Assert.Equal(topScorers, actual);
    }

    [Fact]
    public async Task GetLeaguesAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var leagues = fixture.Create<IList<League>>();
        baseService.GetDataAsync<League>(Arg.Any<GetLeaguesCriteria>()).Returns(leagues);
        //Act
        var actual = await service.GetLeaguesAsync();
        //Assert
        Assert.Equal(leagues, actual);
    }

    [Fact]
    public async Task GetAllLeaguesAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var leagues = fixture.Create<IList<League>>();
        baseService.GetDataAsync<League>(Arg.Any<GetAllLeaguesCriteria>()).Returns(leagues);
        //Act
        var actual = await service.GetAllLeaguesAsync();
        //Assert
        Assert.Equal(leagues, actual);
    }

    [Fact]
    public async Task UpdateLeaguesExtraAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = fixture.Create<UpdateLeagueExtraCriteria>();
        var league = fixture.Create<League>();
        var leagues = fixture.Create<IList<League>>();
        var expected = new CommandResult { Code = 0 };
        baseService.GetDataAsync<League>(Arg.Any<GetAllLeaguesCriteria>()).Returns(leagues);
        baseService.GetDataAsync<League>(Arg.Any<GetLeagueByIdsCriteria>()).Returns(leagues);
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateLeagueExtraCriteria>(x => model = x)).Returns(expected);
        //Act
        var actual = await service.UpdateLeaguesExtraAsync(league);
        //Assert
        Assert.True(actual.IsSuccessful);
    }

    [Fact]
    public async Task UpdateLeaguesExtraAsync_WhenPriorityHigherFirstLeague_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = fixture.Create<UpdateLeagueExtraCriteria>();
        var league = fixture.Create<League>();
        league.Priority = 5;
        var leagues = fixture.Create<IList<League>>();
        leagues[0].Priority = 4;
        var expected = new CommandResult { Code = 0 };
        baseService.GetDataAsync<League>(Arg.Any<GetAllLeaguesCriteria>()).Returns(leagues);
        baseService.GetDataAsync<League>(Arg.Any<GetLeagueByIdsCriteria>()).Returns(leagues);
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateLeagueExtraCriteria>(x => model = x)).Returns(expected);
        //Act
        var actual = await service.UpdateLeaguesExtraAsync(league);
        //Assert
        Assert.True(actual.IsSuccessful);
    }

    [Fact]
    public async Task DeleteLeaguesExtraAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = fixture.Create<DeleteLeagueExtraCriteria>();
        var leagues = fixture.Create<IList<League>>();
        var expected = new CommandResult { Code = 0 };
        baseService.GetDataAsync<League>(Arg.Any<GetAllLeaguesCriteria>()).Returns(leagues);
        baseService.GetDataAsync<League>(Arg.Any<GetLeagueByIdsCriteria>()).Returns(leagues);
        baseService.ExecuteNonQueryAsync(Arg.Do<DeleteLeagueExtraCriteria>(x => model = x)).Returns(expected);
        //Act
        var actual = await service.DeleteLeaguesExtraAsync(model.LeagueId);
        //Assert
        Assert.True(actual.IsSuccessful);
    }

    [Fact]
    public async Task InsertLeaguesExtraAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = fixture.Create<InsertLeagueExtraCriteria>();
        var expected = new CommandResult { Code = 0 };
        baseService.ExecuteNonQueryAsync(Arg.Do<InsertLeagueExtraCriteria>(x => model = x)).Returns(expected);
        //Act
        var actual = await service.InsertLeaguesExtraAsync(model.LeagueId);
        //Assert
        Assert.True(actual.IsSuccessful);
    }

    [Fact]
    public async Task InsertTopScorerAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = fixture.Create<InsertTopScorersCriteria>();
        var topScorers = fixture.Create<TopScorers>();
        var modelPriority = fixture.Create<UpdatePriorityTopScorersCriteria>();
        var expected = new CommandResult { Code = 0 };
        baseService.ExecuteNonQueryAsync(Arg.Do<InsertTopScorersCriteria>(x => model = x)).Returns(expected);
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdatePriorityTopScorersCriteria>(x => modelPriority = x)).Returns(expected);
        //Act
        var actual = await service.InsertTopScorerAsync(topScorers);
        //Assert
        Assert.True(actual.IsSuccessful);
    }

    [Fact]
    public async Task UpdateTopScorerAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = fixture.Create<UpdateTopScorersCriteria>();
        var topScorersList = fixture.Create<IList<TopScorers>>();
        var topScorers = fixture.Create<TopScorers>();
        var modelPriority = fixture.Create<UpdatePriorityTopScorersCriteria>();
        var expected = new CommandResult { Code = 0 };

        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateTopScorersCriteria>(x => model = x)).Returns(expected);
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdatePriorityTopScorersCriteria>(x => modelPriority = x)).Returns(expected);
        baseService.GetDataAsync<TopScorers>(Arg.Any<GetTopScorersByRowNumCriteria>()).Returns(topScorersList);
        //Act
        var actual = await service.UpdateTopScorerAsync(topScorers);
        //Assert
        Assert.True(actual.IsSuccessful);
    }

    [Fact]
    public async Task UpdateTopScorerAsync_WhenRankingLowerThanCurrentRank_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = fixture.Create<UpdateTopScorersCriteria>();
        var topScorersList = fixture.Create<IList<TopScorers>>();
        topScorersList[0].Top = 10;
        var topScorers = fixture.Create<TopScorers>();
        topScorers.Top = 1;
        var modelPriority = fixture.Create<UpdatePriorityTopScorersCriteria>();
        var expected = new CommandResult { Code = 0 };

        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateTopScorersCriteria>(x => model = x)).Returns(expected);
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdatePriorityTopScorersCriteria>(x => modelPriority = x)).Returns(expected);
        baseService.GetDataAsync<TopScorers>(Arg.Any<GetTopScorersByRowNumCriteria>()).Returns(topScorersList);
        //Act
        var actual = await service.UpdateTopScorerAsync(topScorers);
        //Assert
        Assert.True(actual.IsSuccessful);
    }

    [Fact]
    public async Task UpdateLeaguesAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = fixture.Create<UpdateLeagueCriteria>();
        var expected = new CommandResult { Code = 0 };
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateLeagueCriteria>(x => model = x)).Returns(expected);
        //Act
        var actual = await service.UpdateLeaguesAsync(model);
        //Assert
        Assert.True(actual.IsSuccessful);
    }

    [Fact]
    public async Task GetTopScorersByRowNumAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var topScorers = fixture.Create<IList<TopScorers>>();
        var rowNum = fixture.Create<int>();
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
            
        baseService.GetDataAsync<TopScorers>(Arg.Any<GetTopScorersByRowNumCriteria>()).Returns(topScorers);
        //Act
        var actual = await service.GetTopScorersByRowNumAsync(rowNum, leagueId, seasonId);
        //Assert
        Assert.Equal(topScorers, actual);
    }

    [Fact]
    public async Task GetLeagueByIdAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var league = fixture.Create<League>();
        baseService.GetDataEntityAsync<League>(Arg.Any<GetLeagueByIdCriteria>()).Returns(league);
        //Act
        var actual = await service.GetLeagueByIdAsync(league.LeagueId);
        //Assert
        Assert.Equal(league, actual);
    }

    [Fact]
    public async Task GetLeagueSeasonStanding_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var criteria = fixture.Create<GetLeagueSeasonStandingCriteria>();
        var standings = fixture.Create<IList<SeasonStandings>>();
        baseService.GetDataAsync<SeasonStandings>(Arg.Any<GetLeagueSeasonStandingCriteria>()).Returns(standings);
        //Act
        var actual = await service.GetLeagueSeasonStanding(criteria);
        //Assert
        Assert.Equal(standings, actual);
    }

    [Fact]
    public async Task GetLeagueAndSeasonStandingAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var criteria = fixture.Create<GetLeagueAndSeasonStandingsCriteria >();
        var (league, standing) = fixture.Create<(IEnumerable<League>, IEnumerable<SeasonStandings>)>();
        baseService.FetchMultipleAsync<League, SeasonStandings>(Arg.Do<GetLeagueAndSeasonStandingsCriteria>(x => x = criteria)).Returns((league, standing));
        //Act
        var actual = await service.GetLeagueAndSeasonStandingAsync(criteria);
        //Assert
        Assert.Equal(standing, actual.Item2);
    }

    [Fact]
    public async Task GetSeasonByLeagueIdAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        fixture.Create<GetSeasonByLeagueIdCriteria>();
        var expectedData = fixture.Create<IList<Season>>();
        baseService.GetDataAsync<Season>(Arg.Any<GetSeasonByLeagueIdCriteria>()).Returns(expectedData);
        //Act
        var actual = await service.GetSeasonByLeagueIdAsync(1);
        //Assert
        Assert.Equal(expectedData, actual);
    }

    [Fact]
    public async Task GetLeagueSeasonStandingDetailAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var criteria = fixture.Create<GetLeagueSeasonStandingDetailCriteria>();
        var expectedData = fixture.Create<SeasonStandingUpdate>();
        baseService.GetDataEntityAsync<SeasonStandingUpdate>(Arg.Any<GetLeagueSeasonStandingDetailCriteria>()).Returns(expectedData);
        //Act
        var actual = await service.GetLeagueSeasonStandingDetailAsync(criteria);
        //Assert
        Assert.Equal(expectedData, actual);
    }

    [Fact]
    public async Task UpdateStandingAsync_WhenNotUpdateStandingPosition_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = new StandingUpdateModel
        {
            SeasonId = 1,
            StageId = 1,
            TeamId = 1,
            Position = 1,
            IsUpdatePosition = false
        };
        var updateCmd = fixture.Create<UpdateStandingCommand>();
        fixture.Create<League>();
        fixture.Create<IList<League>>();
        var expected = new CommandResult { Code = 1, Message = "msg" };
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateStandingCommand>(x => updateCmd = x)).Returns(expected);
        //Act
        var actual = await service.UpdateStandingAsync(model);
        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task UpdateStandingAsync_WhenUpdateStandingPosition_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = new StandingUpdateModel
        {
            SeasonId = 1,
            StageId = 1,
            TeamId = 1,
            Position = 1,
            IsUpdatePosition = true
        };
        var updateCmd = fixture.Create<UpdateStandingCommand>();
        var updatePositionCmd = fixture.Create<UpdateStandingPositionCommand>();
        fixture.Create<League>();
        fixture.Create<IList<League>>();
        var expected = new CommandResult { Message = "msg", Code = Constants.SuccessCode };
        var expectedUpdatePosition = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateStandingCommand>(x => updateCmd = x)).Returns(expected);
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateStandingPositionCommand>(x => updatePositionCmd = x)).Returns(expectedUpdatePosition);
        //Act
        var actual = await service.UpdateStandingAsync(model);
        //Assert
        Assert.Equal(expectedUpdatePosition, actual);
    }

    [Fact]
    public async Task UpdateStandingAsync_WhenUpdateGroup_ReturnExpectedResult()
    {
        //Arrange
        var service = GetService();
        var fixture = new Fixture();
        var model = new StandingUpdateModel
        {
            SeasonId = 1,
            StageId = 1,
            TeamId = 1,
            Position = 1,
            IsUpdatePosition = false,
            IsUpdateGroupName = true
        };
        var updateCmd = fixture.Create<UpdateStandingCommand>();
        var updatePositionCmd = fixture.Create<UpdateStandingPositionCommand>();
        fixture.Create<League>();
        fixture.Create<IList<League>>();
        var expected = new CommandResult { Message = "msg", Code = Constants.SuccessCode };
        var expectedUpdatePosition = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateStandingCommand>(x => updateCmd = x)).Returns(expected);
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateStandingPositionCommand>(x => updatePositionCmd = x)).Returns(expectedUpdatePosition);
        //Act
        var actual = await service.UpdateStandingAsync(model);
        //Assert
        Assert.Equal(expectedUpdatePosition, actual);
    }

    [Fact]
    public void GetLeaguePriority_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var fixture = new Fixture();
        var league = fixture.Create<IList<League>>();
        GetService();
        //Act
        var actual = LeagueService.GetLeaguePriority(league);
        var priority = 0;
        foreach(var item in league)
        {
            if(item.Priority > priority)
            {
                priority = item.Priority;
            }
        }
        //Assert
        Assert.Equal(priority + 1, actual);
    }

    private LeagueService GetService()
    {
        baseService = Substitute.For<IBaseService>();

        return new LeagueService(baseService);
    }
}