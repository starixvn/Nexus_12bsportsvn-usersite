namespace SabaNews.Site.UnitTests.Extensions;

using AutoFixture;
using SabaNews.Core.Constants;
using SabaNews.Livescore.Models.Match;
using SabaNews.Models.Event.WorldCup;
using SabaNews.Site.Extensions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Xunit;

public class WorldCupHelperTests
{
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void GetMatchNamePredict_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var votes = fixture.Create<IList<UserMinigameModel>>();

        var vote = votes.Where(x => x.MatchId == match.MatchId).ToList();
        var teamName = "";
        if (vote.Count == 0)
        {
            teamName = string.Empty;
        }
        else if (vote[0].TeamId == 0)
        {
            teamName = "Hòa";
        }
        else
        {
            teamName = match.HomeTeam.TeamId == vote[0].TeamId ? LivescoreHelper.GetTeamName(match.HomeTeam) : LivescoreHelper.GetTeamName(match.AwayTeam);
        }

        //Act
        var result = WorldCupHelper.GetMatchNamePredict(match, votes);

        // Assert
        Assert.Equal(result, teamName);
    }

    [Fact]
    public void GetVotePredict_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var votes = fixture.Create<IList<UserMinigameModel>>();

        var vote = votes.Where(x => x.MatchId == match.MatchId).ToList();
        //Act
        var result = WorldCupHelper.GetVotePredict(match, votes);

        // Assert
        Assert.Equal(result, vote.Count == 0 ? null : vote[0]);
    }

    [Fact]
    public void GetResultPredict_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var votes = fixture.Create<IList<UserMinigameModel>>();

        var vote = votes.Where(x => x.MatchId == match.MatchId).ToList();
        var iconResult = "";
        const int FinishStatus = 50;

        if (vote.Count == 0 && match.Status == FinishStatus)
        {
            iconResult = "emtry";
        }
        if (vote.Count != 0 && match.Status == FinishStatus)
        {
            var (status, _) = WorldCupHelper.GetVoteResult(match, vote[0]);
            iconResult = status ? "win" : "lose";
        }
        //Act
        var result = WorldCupHelper.GetResultPredict(match, votes);

        // Assert
        Assert.Equal(result, iconResult);
    }

    [Fact]
    public void GetMatch_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var vote = fixture.Create<UserMinigameModel>();

        Match match = null;
        foreach (var item in matches)
        {
            if (item.MatchId == vote.MatchId)
            {
                match = item;
            }
        }
        //Act
        var result = WorldCupHelper.GetMatch(matches, vote);

        // Assert
        Assert.Equal(result, match);
    }

    [Fact]
    public void GetWinScore_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var stageId = fixture.Create<long>();

        var expected = stageId switch
        {
            WorldCup2022.FinalStage => WorldCup2022.MinigameScoreFinal,
            WorldCup2022.SemifinalsStage => WorldCup2022.MinigameScoreSemifinal,
            WorldCup2022.QuarterfinalsStage => WorldCup2022.MinigameScoreQuarterfinal,
            _ => WorldCup2022.MinigameScoreOthers
        };

        //Act
        var result = WorldCupHelper.GetWinScore(stageId);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void GetVoteResult_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var vote = fixture.Create<UserMinigameModel>();

        const int MatchStatusFinished = 50;
        const int MatchResultWin = 1;
        const int MatchResultDraw = 0;

        var status = false;
        var score = 0;
        if (match == null)
        {
            status = false;
            score = 0;
        }
        else if (match.Status != MatchStatusFinished)
        {
            status = false;
            score = 0;
        }
        else
        {
            var voteTeam = vote.TeamId == 0 ? match.HomeTeam.TeamId : vote.TeamId;
            var matchResult = LivescoreHelper.GetMatchResult(match, voteTeam);
            if (matchResult == MatchResultWin && vote.TeamId != 0)
            {
                score = WorldCupHelper.GetWinScore(match.Stage.StageId);
                status = true;
            }
            else if (matchResult == MatchResultDraw && vote.TeamId == 0)
            {
                score = WorldCupHelper.GetWinScore(match.Stage.StageId);
                status = true;
            }
        }

        //Act
        var result = WorldCupHelper.GetVoteResult(match, vote);

        // Assert
        Assert.Equal(result.Item1, status);
        Assert.Equal(result.Item2, score);
    }

    [Fact]
    public void GetUsersVote_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var users = fixture.Create<List<UserMinigameModel>>();
        var vote = fixture.Create<UserMinigameModel>();

        if (users.Count == 0)
        {
            users.Add(vote);
        }
        else
        {
            var count = users.Where(x => x.UserId == vote.UserId).ToList().Count;
            if (count == 0)
            {
                users.Add(vote);
            }
        }

        //Act
        var result = WorldCupHelper.GetUsersVote(users, vote);

        // Assert
        Assert.Equal(result, users);
    }

    [Fact]
    public void HandleStandings_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var users = fixture.Create<IList<UserMinigameModel>>();
        var votes = fixture.Create<IList<UserMinigameModel>>();
        var points = fixture.Create<List<int>>();

        //Act
        var result = WorldCupHelper.HandleStandings(users, votes, points);

        // Assert
        Assert.Equal(result.Count, users.Count);
    }

    [Fact]
    public void SortPlayersTime_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var standing = fixture.Create<List<UserMinigameModel>>();

        var sortPoint = new List<UserMinigameModel>();
        var sortPointZero = new List<UserMinigameModel>();
        foreach (var item in standing)
        {
            if (sortPointZero.Count == 0)
            {
                sortPointZero.Add(item);
            }
            else
            {
                var count = sortPointZero.Where(x => x.Point == item.Point).ToList().Count;
                if (count > 0)
                {
                    sortPointZero.Add(item);
                }
                if (count == 0 || item == standing[^1])
                {
                    sortPointZero = sortPointZero.OrderBy(x => x.UpdatedDate).ToList();
                    sortPoint.AddRange(sortPointZero);
                    sortPointZero = [item];
                }
            }
        }
        //Act
        var result = WorldCupHelper.SortPlayersTime(standing);

        // Assert
        Assert.Equal(result, sortPoint);
    }

    [Fact]
    public void CalculatorPointer_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var votes = fixture.Create<IList<UserMinigameModel>>();

        var points = new List<int>();
        var users = new List<UserMinigameModel>();
        foreach (var vote in votes)
        {
            var matchVote = WorldCupHelper.GetMatch(matches, vote);
            var (status, score) = WorldCupHelper.GetVoteResult(matchVote, vote);
            points.Add(status ? score : 0);
            users = WorldCupHelper.GetUsersVote(users, vote);
        }
        var standing = WorldCupHelper.HandleStandings(users, votes, points);
        //Act
        var result = WorldCupHelper.CalculatorPointer(matches, votes);

        // Assert
        Assert.Equal(result.Count, standing.Count);
    }

    [Fact]
    public void GetCountVotesStage_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var numStage = fixture.Create<int>();
        var votes = fixture.Create<IList<UserMinigameModel>>();

        var num = 0;
        foreach (var vote in votes)
        {
            if (vote.Stage == numStage)
            {
                num++;
            }
        }
        //Act
        var result = WorldCupHelper.GetCountVotesStage(votes, numStage);

        // Assert
        Assert.Equal(result, num);
    }

    [Fact]
    public void CheckActive_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var status = fixture.Create<string>();
        var expected = !(status == WorldCup2022.LockStage || status == WorldCup2022.OnEndStage);
        //Act
        var result = WorldCupHelper.CheckActive(status);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void GetIconStage_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var status = fixture.Create<string>();
        string iconStage;
        if (status == WorldCup2022.LockStage || status == WorldCup2022.BeforeStartedStage)
        {
            iconStage = WorldCup2022.IconLock;
        }
        else if (status == WorldCup2022.OnEndStage)
        {
            iconStage = WorldCup2022.IconWinner;
        }
        else if (status == WorldCup2022.OnStartedStage)
        {
            iconStage = WorldCup2022.IconStanding;
        }
        else
        {
            iconStage = string.Empty;
        }
        //Act
        var result = WorldCupHelper.GetIconStage(status);

        // Assert
        Assert.Equal(result, iconStage);
    }

    [Fact]
    public void GetCountStageActiveMinigame_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        while (matches.Count < 64)
        {
            matches.Add(fixture.Create<Match>());
        }
        var result = 0;
        const int maxCountStage = 4;
        for (var i = 0; i < maxCountStage; i++)
        {
            var statusStage = WorldCupHelper.GetStatusStage(matches, i + 1);
            if (statusStage != WorldCup2022.LockStage && statusStage != WorldCup2022.BeforeStartedStage)
            {
                result = i + 1;
            }
        }
        //Act
        var actual = WorldCupHelper.GetCountStageActiveMinigame(matches);

        // Assert
        Assert.Equal(result, actual);
    }

    [Fact]
    public void GetCountStageEndMinigame_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        while (matches.Count < 64)
        {
            matches.Add(fixture.Create<Match>());
        }
        var result = 0;
        const int MaxCountStage = 4;
        const int FinishStatus = 50;
        List<int> indexMatches = [15, 31, 47, 63];
        for (var i = 0; i < MaxCountStage; i++)
        {
            if (matches[indexMatches[i]].Status == FinishStatus)
            {
                result = i + 1;
            }
        }
        //Act
        var actual = WorldCupHelper.GetCountStageEndMinigame(matches);

        // Assert
        Assert.Equal(result, actual);
    }

    [Fact]
    public void GetCountDownStage_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var status = fixture.Create<string>();
        var matches = fixture.Create<IList<Match>>();
        var numStage = 2;
        while (matches.Count < 64)
        {
            matches.Add(fixture.Create<Match>());
        }
        List<int> indexMatches = [15, 31, 47, 63];
        const int SubtractMinutes = -30;
        List<string> startStages =
        [
            WorldCup2022.TimestampMinigameStage01Start,
            WorldCup2022.TimestampMinigameStage02Start,
            WorldCup2022.TimestampMinigameStage03Start,
            WorldCup2022.TimestampMinigameStage04Start
        ];
        var statusStage = status.Contains(WorldCup2022.BeforeStartedStage) ?
            startStages[numStage] :
            matches[indexMatches[numStage]].StartTime.AddHours(7).AddMinutes(SubtractMinutes).ToString(CultureInfo.InvariantCulture);
        //Act

        var result = WorldCupHelper.GetCountDownStage(status, matches, numStage);

        // Assert
        Assert.Equal(result, statusStage);
    }

    [Fact]
    public void GetStatusStage_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var numStage = 2;
        while (matches.Count < 64)
        {
            matches.Add(fixture.Create<Match>());
        }

        List<int> indexMatches = [15, 31, 47, 63];
        const int ThirtyMinsToSecond = 1800;
        const int SixtyMinsToSecond = 3600;
        const int NinetyMinsToSecond = 5400;
        List<string> startStages =
        [
            WorldCup2022.TimestampMinigameStage01Start,
            WorldCup2022.TimestampMinigameStage02Start,
            WorldCup2022.TimestampMinigameStage03Start,
            WorldCup2022.TimestampMinigameStage04Start
        ];

        var timeSpanNow = DateTime.UtcNow.AddHours(7) - new DateTime(1970, 1, 1, 0, 0, 0);
        var timeStartStage = DateTime.Parse(startStages[numStage - 1]) - new DateTime(1970, 1, 1, 0, 0, 0);
        var checkNow = timeStartStage.TotalSeconds - timeSpanNow.TotalSeconds;
        string statusStage;
        if (checkNow > 0)
        {
            statusStage = checkNow > SixtyMinsToSecond ? WorldCup2022.LockStage : WorldCup2022.BeforeStartedStage;
        }
        else
        {
            var timeSpanEnd = matches[indexMatches[numStage - 1]].StartTime.AddHours(7) - new DateTime(1970, 1, 1, 0, 0, 0);
            var checkNowEnd = timeSpanEnd.TotalSeconds - timeSpanNow.TotalSeconds;
            if (checkNowEnd > NinetyMinsToSecond)
            {
                statusStage = WorldCup2022.OnStartedStage;
            }
            else if (checkNowEnd <= NinetyMinsToSecond && checkNowEnd > ThirtyMinsToSecond)
            {
                statusStage = WorldCup2022.BeforeEndStage;
            }
            else { statusStage = WorldCup2022.OnEndStage; }
        }
        //Act

        var result = WorldCupHelper.GetStatusStage(matches, numStage);

        // Assert
        Assert.Equal(result, statusStage);
    }

    [Fact]
    public void CheckStartStage_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var numStage = 2;
        List<string> startStages =
        [
            WorldCup2022.TimestampMinigameStage01Start,
            WorldCup2022.TimestampMinigameStage02Start,
            WorldCup2022.TimestampMinigameStage03Start,
            WorldCup2022.TimestampMinigameStage04Start
        ];

        var timeSpanNow = DateTime.UtcNow.AddHours(7) - new DateTime(1970, 1, 1, 0, 0, 0);
        var timeStartStage = DateTime.Parse(startStages[numStage - 1]) - new DateTime(1970, 1, 1, 0, 0, 0);
        var checkNow = timeStartStage.TotalSeconds - timeSpanNow.TotalSeconds;
        var expected = checkNow <= 0;
        //Act

        var result = WorldCupHelper.CheckStartStage(numStage);

        // Assert
        Assert.Equal(result, expected);
    }
}