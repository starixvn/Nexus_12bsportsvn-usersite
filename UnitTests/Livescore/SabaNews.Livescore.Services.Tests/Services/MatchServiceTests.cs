namespace SabaNews.Livescore.Services.Tests.Services;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoFixture;
using Fanex.Data.Repository;
using Newtonsoft.Json;
using NSubstitute;
using Repositories.Interfaces;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Lineup;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.Match;
using Xunit;

public class MatchServiceTests
{
    private readonly IBaseService baseService;
    private readonly IMatchRepository matchRepository;
    private readonly Fixture fixture;
    private readonly MatchService matchService;

    public MatchServiceTests()
    {
        baseService = Substitute.For<IBaseService>();
        matchRepository = Substitute.For<IMatchRepository>();
        fixture = new Fixture();
        matchService = new MatchService(matchRepository, baseService);
    }

    [Fact]
    public async Task GetMatchByDateAsync_WhenCalled_ReturnExpectedResult()
    {
        var matches = fixture.Create<IList<Match>>();
        matchRepository.GetMatchByDateAsync(Arg.Any<ICriteria>()).Returns(matches);
        var actual = await matchService.GetMatchByDateAsync(new GetMatchByDateCriteria());
        Assert.Equal(matches, actual);
    }

    [Fact]
    public async Task GetLiveMatchAsync_WhenCalled_ReturnExpectedResult()
    {
        var matches = fixture.Create<IList<Match>>();
        matchRepository.GetMatchByDateAsync(Arg.Any<ICriteria>()).Returns(matches);
        var actual = await matchService.GetLiveMatchAsync();
        Assert.Equal(matches, actual);
    }

    [Fact]
    public async Task GetSeasonStandingsAsync_WhenNullStandings_ReturnExpectedResult()
    {
        baseService.FetchMultipleAsync<SeasonStandings, FloatMatchModel>(Arg.Any<ICriteria>()).Returns((null, null));

        var actual = await matchService.GetSeasonStandingsAsync(Arg.Any<GetSeasonStandingsCriteria>());

        Assert.Null(actual);
    }

    [Fact]
    public async Task GetSeasonStandingsAsync_WhenHasStandings_ReturnExpectedResult()
    {
        var (standings, floatMatches) = fixture.Create<(IEnumerable<SeasonStandings>, IEnumerable<FloatMatchModel>)>();
        baseService.FetchMultipleAsync<SeasonStandings, FloatMatchModel>(Arg.Any<ICriteria>()).Returns((standings, floatMatches));

        var actual = await matchService.GetSeasonStandingsAsync(new GetSeasonStandingsCriteria());
        foreach (var item in standings)
        {
            item.Matches = floatMatches.Where(match => match.StageId == item.StageId
                                                       && (match.HomeTeamId == item.TeamId || match.AwayTeamId == item.TeamId))
                .OrderByDescending(x => x.StartTime).ToList();
        }

        Assert.Equal(standings, actual);
    }

    [Fact]
    public async Task GetMatchByIdAsync_WhenCalled_ReturnExpectedResult()
    {
        var match = fixture.Create<Match>();
        matchRepository.GetMatchByIdAsync(Arg.Any<ICriteria>()).Returns(match);
        var actual = await matchService.GetMatchByIdAsync(new GetMatchByIdCriteria());
        Assert.Equal(match, actual);
    }

    [Fact]
    public async Task GetMatchByIdUpdateAsync_WhenCalled_ReturnExpectedResult()
    {
        var match = fixture.Create<MatchUpdate>();
        matchRepository.GetMatchByIdUpdateAsync(Arg.Any<ICriteria>()).Returns(match);
        var actual = await matchService.GetMatchByIdUpdateAsync(new GetMatchByIdUpdateCriteria());
        Assert.Equal(match, actual);
    }

    [Fact]
    public async Task GetMatchIncidentAsync_WhenCalled_ReturnExpectedResult()
    {
        var match = fixture.Create<IEnumerable<MatchIncident>>();
        baseService.GetDataAsync<MatchIncident>(Arg.Any<GetMatchIncidentCriteria>()).Returns(match);

        var actual = await matchService.GetMatchIncidentAsync(new GetMatchIncidentCriteria());
        Assert.Equal(match, actual);
    }

    [Fact]
    public async Task GetMatchStatisticAsync_WhenHasStandings_ReturnExpectedResult()
    {
        var (home, away) = fixture.Create<(IEnumerable<TeamStatistic>, IEnumerable<TeamStatistic>)>();
        baseService.FetchMultipleAsync<TeamStatistic, TeamStatistic>(Arg.Any<ICriteria>()).Returns((home, away));
        var expected = new Statistic
        {
            HomeStatistic = home.FirstOrDefault(),
            AwayStatistic = away.FirstOrDefault()
        };
        var actual = await matchService.GetMatchStatisticAsync(new GetMatchStatisticCriteria());

        Assert.Equal(JsonConvert.SerializeObject(expected), JsonConvert.SerializeObject(actual));
    }

    [Fact]
    public async Task GetLineupAsync_WhenHasStandings_ReturnExpectedResult()
    {
        var (generalInfo, home, away) = fixture.Create<(IEnumerable<Lineup>, IEnumerable<LineupTeam>, IEnumerable<LineupTeam>)>();
        baseService.FetchMultipleAsync<Lineup, LineupTeam, LineupTeam>(Arg.Any<ICriteria>()).Returns((generalInfo, home, away));
        var expected = new LineupDetail
        {
            GeneralInfo = generalInfo.FirstOrDefault(),
            Home = home.ToList(),
            Away = away.ToList()
        };

        var actual = await matchService.GetLineupAsync(new GetMatchLineupCriteria());

        Assert.Equal(JsonConvert.SerializeObject(expected), JsonConvert.SerializeObject(actual));
    }

    [Fact]
    public async Task GetHeadToHeadAsync_WhenCalled_ReturnExpectedResult()
    {
        var h2h = fixture.Create<HeadToHeadDetail>();
        matchRepository.GetHeadToHeadAsync(Arg.Any<ICriteria>()).Returns(h2h);

        var actual = await matchService.GetHeadToHeadAsync(new GetHeadToHeadCriteria());
        Assert.Equal(h2h, actual);
    }

    [Fact]
    public async Task GetMatchByIdsAsync_WhenCalled_ReturnExpectedResult()
    {
        var matches = fixture.Create<IList<Match>>();
        matchRepository.GetMatchByIdsAsync(Arg.Any<ICriteria>()).Returns(matches);

        var actual = await matchService.GetMatchByIdsAsync(new GetMatchByIdsCriteria());
        Assert.Equal(matches, actual);
    }

    [Fact]
    public async Task GetMatchBySeasonAsync_WhenCalled_ReturnExpectedResult()
    {
        var (leagues, season, floatMatches) = fixture.Create<(IEnumerable<League>, IEnumerable<Season>, IEnumerable<FloatMatchModel>)>();
        baseService.FetchMultipleAsync<League, Season, FloatMatchModel>(Arg.Any<ICriteria>()).Returns((leagues, season, floatMatches));

        var actual = await matchService.GetMatchBySeasonAsync(new GetMatchBySeasonCriteria());
        Assert.Equal(leagues.FirstOrDefault(), actual.Item1);
        Assert.Equal(floatMatches.Count(), actual.Item2.Count);
    }

    [Fact]
    public async Task GetMatchBySeasonFilterAsync_WhenCalled_ReturnExpectedResult()
    {
        var matches = fixture.Create<IList<Match>>();
        matchRepository.GetMatchBySeasonFilterAsync(Arg.Any<ICriteria>()).Returns(matches);

        var actual = await matchService.GetMatchBySeasonFilterAsync(new GetMatchBySeasonFilterCriteria());
        Assert.Equal(matches, actual);
    }

    [Fact]
    public async Task UpdateMatchAsync_WhenCalled_ReturnExpectedResult()
    {
        //Arrange
        var fixture = new Fixture();
        var model = fixture.Create<UpdateMatchCommand>();
        var expected = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateMatchCommand>(x => model = x)).Returns(expected);
        //Act
        var actual = await matchService.UpdateMatchAsync(model);
        //Assert
        Assert.Equal(expected, actual);
    }
}