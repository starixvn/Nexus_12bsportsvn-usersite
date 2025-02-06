namespace SabaNews.Site.UnitTests.Extensions;

using AutoFixture;
using SabaNews.Core.Constants.Livescore;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Site.Extensions;
using System.Collections.Generic;
using System.Linq;
using Xunit;

public class LivescoreHelperTests
{
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void GetTeamName_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var team = fixture.Create<Team>();
        var teamName = !string.IsNullOrEmpty(team.TeamNameEN) ? team.TeamNameEN : team.TeamFullNameEN;
        teamName = !string.IsNullOrEmpty(team.TeamNameVN) ? team.TeamNameVN : teamName;
        //Act
        var result = LivescoreHelper.GetTeamName(team);

        // Assert
        Assert.Equal(result, teamName);
    }

    [Fact]
    public void GetTeamName_WhenVnNameIsNull_ReturnExpectedData()
    {
        // Arrange
        var team = new Team { TeamNameEN = "EN" };
        var teamName = !string.IsNullOrEmpty(team.TeamNameEN) ? team.TeamNameEN : team.TeamFullNameEN;
        teamName = !string.IsNullOrEmpty(team.TeamNameVN) ? team.TeamNameVN : teamName;
        //Act
        var result = LivescoreHelper.GetTeamName(team);

        // Assert
        Assert.Equal(result, teamName);
    }

    [Fact]
    public void GetStandingTeamName_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var standing = fixture.Create<SeasonStandings>();
        var teamName = !string.IsNullOrEmpty(standing.TeamNameEN) ? standing.TeamNameEN : standing.TeamFullNameEN;
        teamName = !string.IsNullOrEmpty(standing.TeamNameVN) ? standing.TeamNameVN : teamName;
        //Act
        var result = LivescoreHelper.GetStandingTeamName(standing);

        // Assert
        Assert.Equal(result, teamName);
    }

    [Fact]
    public void GetStandingTeamName_WhenVnNameIsNull_ReturnExpectedData()
    {
        // Arrange
        var standing = new SeasonStandings { TeamNameEN = "EN" };
        var teamName = !string.IsNullOrEmpty(standing.TeamNameEN) ? standing.TeamNameEN : standing.TeamFullNameEN;
        teamName = !string.IsNullOrEmpty(standing.TeamNameVN) ? standing.TeamNameVN : teamName;
        //Act
        var result = LivescoreHelper.GetStandingTeamName(standing);

        // Assert
        Assert.Equal(result, teamName);
    }

    [Fact]
    public void GetTopScorersPlayerName_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var topScorers = fixture.Create<TopScorers>();
        var teamName = string.IsNullOrEmpty(topScorers.PlayerNameEN) ? topScorers.PlayerFullNameEN : topScorers.PlayerNameEN;

        //Act
        var result = LivescoreHelper.GetTopScorersPlayerName(topScorers);

        // Assert
        Assert.Equal(result, teamName);
    }

    [Fact]
    public void GetTeamIcon_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var src = fixture.Create<string>();
        var expected = string.IsNullOrEmpty(src) ? "/css/images/logo-dummy.png" : src;

        //Act
        var result = LivescoreHelper.GetTeamIcon(src);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void GetLeagueName_WhenHaveNameVN_ReturnExpectedData()
    {
        // Arrange
        var league = new League { LeagueFullNameEN = "Full nameEN", LeagueNameEN = "name EN", LeagueNameVN = "VN" };
        var leagueName = string.IsNullOrEmpty(league.LeagueNameEN) ? league.LeagueNameEN : league.LeagueFullNameEN;
        leagueName = !string.IsNullOrEmpty(league.LeagueNameVN) ? league.LeagueNameVN : leagueName;

        //Act
        var result = LivescoreHelper.GetLeagueName(league);

        // Assert
        Assert.Equal(result, leagueName);
    }

    [Fact]
    public void GetLeagueName_WhenDontHaveNameVN_ReturnExpectedData()
    {
        // Arrange
        var league = new League { LeagueFullNameEN = "Full nameEN", LeagueNameEN = "name EN" };
        var leagueName = !string.IsNullOrEmpty(league.LeagueNameEN) ? league.LeagueNameEN : league.LeagueFullNameEN;
        leagueName = !string.IsNullOrEmpty(league.LeagueNameVN) ? league.LeagueNameVN : leagueName;

        //Act
        var result = LivescoreHelper.GetLeagueName(league);

        // Assert
        Assert.Equal(result, leagueName);
    }



    [Fact]
    public void GroupStandingsByGroupName_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var seasonStandings = fixture.Create<IList<SeasonStandings>>();

        //Act
        var result = LivescoreHelper.GroupStandingsByGroupName(seasonStandings);

        // Assert
        Assert.Equal(result.Count, seasonStandings.Count);
    }

    [Fact]
    public void GetGroupNames_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var seasonStandings = fixture.Create<IList<SeasonStandings>>();
        var groupNames = new List<string>();
        foreach (var item in seasonStandings)
        {
            if (groupNames.Count == 0)
            {
                groupNames.Add(item.GroupName);
                continue;
            }

            var check = groupNames.Where(x => x == item.GroupName).ToList();
            if (check.Count == 0)
            {
                groupNames.Add(item.GroupName);
            }
        }
        //Act
        var result = LivescoreHelper.GetGroupNames(seasonStandings);

        // Assert
        Assert.Equal(groupNames, result);
    }

    [Fact]
    public void IsLiveMatch_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var status = fixture.Create<int>();

        var live = MatchConstants.ListLiveMatchStatus.FirstOrDefault(item => item == status);

        //Act
        var result = LivescoreHelper.IsLiveMatch(status);

        // Assert
        Assert.Equal(result, live != 0);
    }

    [Fact]
    public void IsPreMatch_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var status = fixture.Create<int>();

        var live = MatchConstants.ListPreMatchStatus.FirstOrDefault(item => item == status);

        //Act
        var result = LivescoreHelper.IsPreMatch(status);

        // Assert
        Assert.Equal(result, live != 0);
    }

    [Fact]
    public void GetMatchTotalScore_WhenIsHome_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var isHome = true;
        short? expected = match.HomeTeamExtraScore > 0 ? match.HomeTeamExtraScore : match.HomeTeamTotalScore;
           
        //Act
        var result = LivescoreHelper.GetMatchTotalScore(match, isHome);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void GetMatchTotalScore_WhenIsAway_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var isHome = false;
        short? expected = match.AwayTeamExtraScore > 0 ? match.AwayTeamExtraScore : match.AwayTeamTotalScore;
           
        //Act
        var result = LivescoreHelper.GetMatchTotalScore(match, isHome);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void CheckMatchResult_WhenHomeWin_ReturnExpectedResult()
    {
        // Arrange
        short? homeScore = 2;
        short? awayScore = 1;
        var expected = MatchConstants.Win;

        //Act
        var result = LivescoreHelper.CheckMatchResult(homeScore, awayScore);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void CheckMatchResult_WhenAwayWin_ReturnExpectedResult()
    {
        // Arrange
        short? homeScore = 1;
        short? awayScore = 2;
        short? expected = MatchConstants.Lose;

        //Act
        var result = LivescoreHelper.CheckMatchResult(homeScore, awayScore);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void CheckMatchResult_WhenDraw_ReturnExpectedResult()
    {
        // Arrange
        short? homeScore = 2;
        short? awayScore = 2;
        short? expected = MatchConstants.Draw;

        //Act
        var result = LivescoreHelper.CheckMatchResult(homeScore, awayScore);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void GetMatchResult_WhenHomeLoseByPEN_ReturnExpectedData()
    {
        // Arrange
        var match = new Match { HomeTeamPenaltyScore = 1, AwayTeamPenaltyScore = 2, AwayTeam = new Team { TeamId = 112 } };
        var teamId = 111;

        short? expected = MatchConstants.Lose;

        //Act
        var result = LivescoreHelper.GetMatchResult(match, teamId);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void GetMatchResult_WhenHomeWinByAGG_ReturnExpectedData()
    {
        // Arrange
        var match =  new Match { HomeTeamAggregateScore = 1, AwayTeamAggregateScore = 2, IsSecondLeg = true, AwayTeam = new Team { TeamId = 111 } };
        var teamId = 111;

        short? expected = MatchConstants.Win;

        //Act
        var result = LivescoreHelper.GetMatchResult(match, teamId);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void GetMatchResult_WhenHomeWinByExtraScore_ReturnExpectedData()
    {
        // Arrange
        var match = new Match { HomeTeamExtraScore = 2, AwayTeamExtraScore = 1, AwayTeam = new Team { TeamId = 112 } };
        var teamId = 111;

        short? expected = MatchConstants.Win;

        //Act
        var result = LivescoreHelper.GetMatchResult(match, teamId);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void GetMatchResult_WhenHomeWinByTotalScore_ReturnExpectedData()
    {
        // Arrange
        var match = new Match { HomeTeamTotalScore = 2, AwayTeamTotalScore = 1, AwayTeam = new Team { TeamId = 112 } };
        var teamId = 111;

        short? expected = MatchConstants.Win;

        //Act
        var result = LivescoreHelper.GetMatchResult(match, teamId);

        // Assert
        Assert.Equal(result, expected);
    }

        
}