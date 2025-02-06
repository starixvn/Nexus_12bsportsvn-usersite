namespace SabaNews.Site.UnitTests.Extensions;

using AutoFixture;
using SabaNews.Core.Constants;
using SabaNews.Livescore.Models.Match;
using SabaNews.Site.Extensions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Models.Minigame;
using Xunit;

public class EuroHelperTests
{
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void GetMatchNamePredict_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var votes = fixture.Create<IList<MinigameModel>>();

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
        var result = EuroHelper.GetMatchNamePredict(match, votes);

        // Assert
        Assert.Equal(result, teamName);
    }

    [Fact]
    public void GetVotePredict_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var votes = fixture.Create<IList<MinigameModel>>();

        var vote = votes.Where(x => x.MatchId == match.MatchId).ToList();
        //Act
        var result = EuroHelper.GetVotePredict(match, votes);

        // Assert
        Assert.Equal(result, vote.Count == 0 ? null : vote[0]);
    }

    [Fact]
    public void GetResultPredict_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var votes = fixture.Create<IList<MinigameModel>>();

        var vote = votes.Where(x => x.MatchId == match.MatchId).ToList();
        var iconResult = "";
        const int FinishStatus = 50;

        if (vote.Count == 0 && match.Status == FinishStatus)
        {
            iconResult = "emtry";
        }
        if (vote.Count != 0 && match.Status == FinishStatus)
        {
            var (status, _) = EuroHelper.GetVoteResult(match, vote[0]);
            iconResult = status ? "win" : "lose";
        }
        //Act
        var result = EuroHelper.GetResultPredict(match, votes);

        // Assert
        Assert.Equal(result, iconResult);
    }


    [Fact]
    public void GetWinScore_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var stageId = fixture.Create<long>();

        var expected = stageId switch
        {
            Euro2024.FinalStage => Euro2024.MinigameScoreFinal,
            Euro2024.SemifinalsStage => Euro2024.MinigameScoreSemifinal,
            Euro2024.QuarterfinalsStage => Euro2024.MinigameScoreQuarterfinal,
            _ => Euro2024.MinigameScoreOthers
        };

        //Act
        var result = EuroHelper.GetWinScore(stageId);

        // Assert
        Assert.Equal(result, expected);
    }

    [Fact]
    public void GetVoteResult_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var match = fixture.Create<Match>();
        var vote = fixture.Create<MinigameModel>();

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
                score = EuroHelper.GetWinScore(match.Stage.StageId);
                status = true;
            }
            else if (matchResult == MatchResultDraw && vote.TeamId == 0)
            {
                score = EuroHelper.GetWinScore(match.Stage.StageId);
                status = true;
            }
        }

        //Act
        var result = EuroHelper.GetVoteResult(match, vote);

        // Assert
        Assert.Equal(result.Item1, status);
        Assert.Equal(result.Item2, score);
    }

    [Fact]
    public void GetUsersVote_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var users = fixture.Create<List<MinigameModel>>();
        var vote = fixture.Create<MinigameModel>();

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
        var result = EuroHelper.GetUsersVote(users, vote);

        // Assert
        Assert.Equal(result, users);
    }

    [Fact]
    public void HandleStandings_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var users = fixture.Create<IList<MinigameModel>>();
        var votes = fixture.Create<IList<MinigameModel>>();
        var points = fixture.Create<List<int>>();

        //Act
        var result = EuroHelper.HandleStandings(users, votes, points);

        // Assert
        Assert.Equal(result.Count, users.Count);
    }


    [Fact]
    public void CalculatorPointer_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var matches = fixture.Create<IList<Match>>();
        var votes = fixture.Create<IList<MinigameModel>>();

        var points = new List<int>();
        var users = new List<MinigameModel>();
        foreach (var vote in votes)
        {
            var matchVote = matches.FirstOrDefault(m => m.MatchId == vote.MatchId);
            var (status, score) = EuroHelper.GetVoteResult(matchVote, vote);
            points.Add(status ? score : 0);
            users = EuroHelper.GetUsersVote(users, vote);
        }
        var standing = EuroHelper.HandleStandings(users, votes, points);
        //Act
        var result = EuroHelper.CalculatorPointer(matches, votes);

        // Assert
        Assert.Equal(result.Count, standing.Count);
    }

    [Fact]
    public void GetCountVotesStage_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var numStage = fixture.Create<int>();
        var votes = fixture.Create<IList<MinigameModel>>();

        var num = 0;
        foreach (var vote in votes)
        {
            if (vote.Stage == numStage)
            {
                num++;
            }
        }
        //Act
        var result = EuroHelper.GetCountVotesStage(votes, numStage);

        // Assert
        Assert.Equal(result, num);
    }

    [Fact]
    public void CheckActive_WhenOnStartedStage_ReturnTrue()
    {
        // Arrange
        //Act
        var result = EuroHelper.CheckActive(Euro2024.OnStartedStage);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void CheckActive_WhenBeforeEndStage_ReturnTrue()
    {
        // Arrange
        //Act
        var result = EuroHelper.CheckActive(Euro2024.BeforeEndStage);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void CheckActive_WhenLocked_ReturnFalse()
    {
        // Arrange
        //Act
        var result = EuroHelper.CheckActive(Euro2024.LockStage);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void GetIconStage_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var status = fixture.Create<string>();
        string iconStage;
        if (status == Euro2024.LockStage || status == Euro2024.BeforeStartedStage)
        {
            iconStage = Euro2024.IconLock;
        }
        else if (status == Euro2024.OnEndStage)
        {
            iconStage = Euro2024.IconWinner;
        }
        else if (status == Euro2024.OnStartedStage)
        {
            iconStage = Euro2024.IconStanding;
        }
        else
        {
            iconStage = string.Empty;
        }
        //Act
        var result = EuroHelper.GetIconStage(status);

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
        const int maxCountStage = 2;
        for (var i = 0; i < maxCountStage; i++)
        {
            var statusStage = EuroHelper.GetStatusStage(matches, i + 1);
            if (statusStage != Euro2024.LockStage && statusStage != Euro2024.BeforeStartedStage)
            {
                result = i + 1;
            }
        }
        //Act
        var actual = EuroHelper.GetCountStageActiveMinigame(matches);

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
        var actual = EuroHelper.GetCountStageEndMinigame(matches);

        // Assert
        Assert.Equal(result, actual);
    }

    [Fact]
    public void GetCountDownStage_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var status = Euro2024.BeforeStartedStage;
        var matches = fixture.Create<IList<Match>>();
        var numStage = 1;
        while (matches.Count < 64)
        {
            matches.Add(fixture.Create<Match>());
        }
        const int SubtractMinutes = -30;

        var statusStage = status.Contains(Euro2024.BeforeStartedStage) ?
            Euro2024.startStages[numStage] :
            matches[Euro2024.indexMatches[numStage]].StartTime.AddHours(7).AddMinutes(SubtractMinutes).ToString(CultureInfo.InvariantCulture);
        //Act

        var result = EuroHelper.GetCountDownStage(status, matches, numStage);

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

        const int ThirtyMinsToSecond = 1800;
        const int SixtyMinsToSecond = 3600;
        const int NinetyMinsToSecond = 5400;
    

        var timeSpanNow = DateTime.UtcNow.AddHours(7) - new DateTime(1970, 1, 1, 0, 0, 0);
        var timeStartStage = DateTime.Parse(Euro2024.startStages[numStage - 1]) - new DateTime(1970, 1, 1, 0, 0, 0);
        var checkNow = timeStartStage.TotalSeconds - timeSpanNow.TotalSeconds;
        string statusStage;
        if (checkNow > 0)
        {
            statusStage = checkNow > SixtyMinsToSecond ? Euro2024.LockStage : Euro2024.BeforeStartedStage;
        }
        else
        {
            var timeSpanEnd = matches[Euro2024.indexMatches[numStage - 1]].StartTime.AddHours(7) - new DateTime(1970, 1, 1, 0, 0, 0);
            var checkNowEnd = timeSpanEnd.TotalSeconds - timeSpanNow.TotalSeconds;
            if (checkNowEnd > NinetyMinsToSecond)
            {
                statusStage = Euro2024.OnStartedStage;
            }
            else if (checkNowEnd <= NinetyMinsToSecond && checkNowEnd > ThirtyMinsToSecond)
            {
                statusStage = Euro2024.BeforeEndStage;
            }
            else { statusStage = Euro2024.OnEndStage; }
        }
        //Act

        var result = EuroHelper.GetStatusStage(matches, numStage);

        // Assert
        Assert.Equal(result, statusStage);
    }

    [Fact]
    public void CheckStartStage_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var numStage = 2;

        var timeSpanNow = DateTime.UtcNow.AddHours(7) - new DateTime(1970, 1, 1, 0, 0, 0);
        var timeStartStage = DateTime.Parse(Euro2024.startStages[numStage - 1]) - new DateTime(1970, 1, 1, 0, 0, 0);
        var checkNow = timeStartStage.TotalSeconds - timeSpanNow.TotalSeconds;
        var expected = checkNow <= 0;
        //Act

        var result = EuroHelper.CheckStartStage(numStage);

        // Assert
        Assert.Equal(result, expected);
    }
}