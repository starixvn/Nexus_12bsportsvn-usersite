namespace SabaNews.Site.Extensions;

using SabaNews.Core.Constants;
using SabaNews.Core.Constants.Livescore;
using SabaNews.Core.Helper;
using SabaNews.Livescore.Models.Match;
using SabaNews.Models.ViewModel.Event.Euro2024;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Models.Minigame;

public static class EuroHelper
{
    private const int MGTPlus = 7;
    private const int ThirtyMinsToSecond = 1800;
    private const int ThirtyMins = 31;
    private const int SixtyMinsToSecond = 3600;
    private const int NinetyMinsToSecond = 5400;

    public static string GetMatchNamePredict(Match match, IList<MinigameModel> votes)
    {
        var vote = votes.FirstOrDefault(x => x.MatchId == match.MatchId);
        if (vote == null)
        {
            return string.Empty;
        }
        return vote.TeamId switch
        {
            0 => "Hòa",
            var teamId when teamId == match.HomeTeam.TeamId => LivescoreHelper.GetTeamName(match.HomeTeam),
            var teamId when teamId == match.AwayTeam.TeamId => LivescoreHelper.GetTeamName(match.AwayTeam),
            _ => string.Empty
        };
    }

    public static MinigameModel GetVotePredict(Match match, IList<MinigameModel> votes)
    {
        var vote = votes.FirstOrDefault(x => x.MatchId == match.MatchId);
        return vote;
    }

    public static string GetResultPredict(Match match, IList<MinigameModel> votes)
    {
        var vote = votes.Where(x => x.MatchId == match.MatchId).ToList();
        var iconResult = "";
        const int FinishStatus = 50;

        if (vote.Count == 0 && match.Status == FinishStatus)
        {
            iconResult = "emtry";
        }
        if (vote.Count != 0 && match.Status == FinishStatus)
        {
            var (status, _) = GetVoteResult(match, vote[0]);
            iconResult = status ? "win" : "lose";
        }
        return iconResult;
    }


    public static int GetWinScore(long stageId)
    {
        return stageId switch
        {
            Euro2024.FinalStage => Euro2024.MinigameScoreFinal,
            Euro2024.SemifinalsStage => Euro2024.MinigameScoreSemifinal,
            Euro2024.QuarterfinalsStage => Euro2024.MinigameScoreQuarterfinal,
            _ => Euro2024.MinigameScoreOthers
        };
    }

    public static (bool, int) GetVoteResult(Match match, MinigameModel vote)
    {
        var status = false;
        var score = 0;
        const int MatchStatusFinished = 50;
        const int MatchResultWin = 1;
        const int MatchResultDraw = 0;
        if (match == null)
        {
            return (status, score);
        }
        if (match.Status != MatchStatusFinished)
        {
            return (status, score);
        }
            
        var voteTeam = vote.TeamId == 0 ? match.HomeTeam.TeamId : vote.TeamId;
        var matchResult = LivescoreHelper.GetMatchResult(match, voteTeam);
        if (matchResult == MatchResultWin && (vote.TeamId == match.HomeTeam.TeamId || vote.TeamId == match.AwayTeam.TeamId))
        {
            score = GetWinScore(match.Stage.StageId);
            status = true;
        }
        if (matchResult == MatchResultDraw && vote.TeamId == 0)
        {
            score = GetWinScore(match.Stage.StageId);
            status = true;
        }
        return (status, score);
    }

    public static List<MinigameModel> GetUsersVote(List<MinigameModel> users, MinigameModel vote)
    {
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
        return users;
    }

    public static List<MinigameModel> HandleStandings(IList<MinigameModel> users,
        IList<MinigameModel> votes, List<int> points)
    {
        var standing = new List<MinigameModel>();
        for (var i = 0; i < users.Count; i++)
        {
            var createdDate = users[i].CreatedDate;
            var updatedDate = users[i].UpdatedDate;
            var pointNumber = 0;
            for (var j = 0; j < votes.Count; j++)
            {
                if (users[i].UserId == votes[j].UserId)
                {
                    pointNumber += points[j];
                }
                if (updatedDate < votes[j].UpdatedDate && users[i].UserId == votes[j].UserId)
                {
                    updatedDate = votes[j].UpdatedDate;
                }
                if (createdDate > votes[j].CreatedDate && users[i].UserId == votes[j].UserId)
                {
                    createdDate = votes[j].CreatedDate;
                }
            }
            standing.Add(new MinigameModel
            {
                UserId = users[i].UserId,
                MatchId = users[i].MatchId,
                TeamId = users[i].TeamId,
                Stage = users[i].Stage,
                UserName = users[i].UserName,
                Icon = users[i].Icon,
                Point = pointNumber,
                CreatedDate = createdDate,
                UpdatedDate = updatedDate,
                Email = users[i].Email
            });
        }
        standing = standing.OrderByDescending(x => x.Point).ThenBy( x => x.UpdatedDate).ToList();
        return standing;
    }

    public static List<MinigameModel> CalculatorPointer(IList<Match> matches, IList<MinigameModel> votes)
    {
        var points = new List<int>();
        var users = new List<MinigameModel>();
        foreach (var vote in votes)
        {
            var matchVote = matches.FirstOrDefault(m => m.MatchId == vote.MatchId);
            var (status, score) = GetVoteResult(matchVote, vote);
            points.Add(status ? score : 0);
            users = GetUsersVote(users, vote);
        }
        var standing = HandleStandings(users, votes, points);
        return standing;
    }

    public static int GetCountVotesStage(IList<MinigameModel> votes, int numStage)
    {
        var num = 0;
        foreach (var vote in votes)
        {
            if (vote.Stage == numStage)
            {
                num++;
            }
        }
        return num;
    }

    public static bool CheckActive(string status)
    {
        return status == Euro2024.OnStartedStage || status == Euro2024.BeforeEndStage;
    }

    public static string GetIconStage(string status)
    {
        string iconStage;
        if (status == Euro2024.LockStage || status == Euro2024.BeforeStartedStage)
        {
            iconStage = Euro2024.IconLock;
        }
        else if (status == Euro2024.OnEndStage)
        {
            iconStage = Euro2024.IconWinner;
        }
        else if (status == Euro2024.OnStartedStage ||status == Euro2024.BeforeEndStage)
        {
            iconStage = Euro2024.IconStanding;
        }
        else
        {
            iconStage = string.Empty;
        }
        return iconStage;
    }

    public static int GetCountStageActiveMinigame(IList<Match> matches)
    {
        var result = 0;
        for (var i = 0; i < Euro2024.maxCountStage; i++)
        {
            var statusStage = GetStatusStage(matches, i + 1);
            if (statusStage != Euro2024.LockStage && statusStage != Euro2024.BeforeStartedStage)
            {
                result = i + 1;
            }
        }
        return result;
    }

    public static int GetCountStageEndMinigame(IList<Match> matches)
    {
        var result = 0;
        for (var i = 0; i < Euro2024.maxCountStage; i++)
        {
            if (matches[Euro2024.indexMatches[i]].Status == MatchConstants.Finished)
            {
                result = i + 1;
            }
        }
        return result;
    }

    public static string GetCountDownStage(string status, IList<Match> matches, int numStage)
    {
        const int SubtractMinutes = -30;
        var statusStage = status.Contains(Euro2024.BeforeStartedStage) ?
            Euro2024.startStages[numStage] :
            matches[Euro2024.indexMatches[numStage]].StartTime.AddHours(MGTPlus).AddMinutes(SubtractMinutes).ToString(CultureInfo.InvariantCulture);
        return statusStage;
    }

    public static string GetStatusStage(IList<Match> matches, int numStage)
    {
        var timeSpanNow = DateTimeUtilize.UtcNow().DateTime.AddHours(MGTPlus) - DateTimeOffset.UnixEpoch.DateTime;
        var timeStartStage = DateTimeOffset.Parse(Euro2024.startStages[numStage - 1], CultureInfo.InvariantCulture).DateTime - DateTimeOffset.UnixEpoch.DateTime;
        var secondsUntilStageStart = timeStartStage.TotalSeconds - timeSpanNow.TotalSeconds;
        string statusStage;
        if (secondsUntilStageStart > 0)
        {
            statusStage = secondsUntilStageStart > SixtyMinsToSecond ? Euro2024.LockStage : Euro2024.BeforeStartedStage;
        }
        else
        {
            var lastMatchStage = matches[Euro2024.indexMatches[numStage - 1]];
            var timeSpanEnd = lastMatchStage.StartTime.AddHours(MGTPlus) - DateTimeOffset.UnixEpoch.DateTime;
            var secondsUntilMatchEnd = timeSpanEnd.TotalSeconds - timeSpanNow.TotalSeconds;
            if(lastMatchStage.Status == MatchConstants.Finished)
            {
                statusStage = Euro2024.OnEndStage;
            }
            else if (secondsUntilMatchEnd  > NinetyMinsToSecond)
            {
                statusStage = Euro2024.OnStartedStage;
            }
            else if (secondsUntilMatchEnd > ThirtyMinsToSecond)
            {
                statusStage = Euro2024.BeforeEndStage;
            }
            else
            {
                statusStage = Euro2024.OnEndStage;
            }
        }

        return statusStage;
    }

    public static bool IsVoted(DateTime startTime)
    {
        var timeSpanNow = DateTimeUtilize.UtcNow().DateTime.AddHours(MGTPlus) - DateTimeOffset.UnixEpoch.DateTime;
        var timeSpanMatch = startTime.AddHours(MGTPlus) - DateTimeOffset.UnixEpoch.DateTime;
        var secondsUntilMatchStart = timeSpanMatch.TotalMinutes - timeSpanNow.TotalMinutes;
        return secondsUntilMatchStart > ThirtyMins;
    }

    public static bool CheckStartStage(int numStage)
    {

        var timeSpanNow = DateTimeUtilize.UtcNow().AddHours(MGTPlus).DateTime - DateTimeOffset.UnixEpoch.DateTime;
        var timeStartStage = DateTimeOffset.Parse(Euro2024.startStages[numStage - 1], CultureInfo.InvariantCulture).DateTime - DateTimeOffset.UnixEpoch.DateTime;
        var checkNow = timeStartStage.TotalSeconds - timeSpanNow.TotalSeconds;
        if (checkNow > 0)
        {
            return false;
        }
        return true;
    }

    public static List<GetMinigameStageStatusModel> GetMinigameStageStatus(IList<Match> matches)
    {
        var result = new List<GetMinigameStageStatusModel>();
        for (var i = 1; i <= Euro2024.maxCountStage; i++)
        {
            var statusStage = GetStatusStage(matches, i);
            var isActive = CheckActive(statusStage);
            result.Add(new GetMinigameStageStatusModel { Stage = i, IsActive = isActive, Status = statusStage });
        }
        return result;
    }

}