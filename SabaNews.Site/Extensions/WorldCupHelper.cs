namespace SabaNews.Site.Extensions;

using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Livescore.Models.Match;
using SabaNews.Models.Event.WorldCup;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

public static class WorldCupHelper
{
    private const int MGTPlus = 7;
    public static string GetMatchNamePredict(Match match, IList<UserMinigameModel> votes)
    {
        var vote = votes.Where(x => x.MatchId == match.MatchId).ToList();
        string teamName;
        if (vote.Count == 0)
        {
            return string.Empty;
        }

        teamName = vote[0].TeamId == 0 ? "Hòa" :
            match.HomeTeam.TeamId == vote[0].TeamId ? LivescoreHelper.GetTeamName(match.HomeTeam) :
            LivescoreHelper.GetTeamName(match.AwayTeam);
        return teamName;
    }

    public static UserMinigameModel GetVotePredict(Match match, IList<UserMinigameModel> votes)
    {
        var vote = votes.Where(x => x.MatchId == match.MatchId).ToList();
        if (vote.Count == 0)
        {
            return null;
        }
        return vote[0];
    }

    public static string GetResultPredict(Match match, IList<UserMinigameModel> votes)
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

    public static Match GetMatch(IList<Match> matches, UserMinigameModel vote)
    {
        Match match = null;
        foreach (var item in matches)
        {
            if (item.MatchId == vote.MatchId)
            {
                match = item;
            }
        }
        return match;
    }

    public static int GetWinScore(long stageId)
    {
        return stageId switch
        {
            WorldCup2022.FinalStage => WorldCup2022.MinigameScoreFinal,
            WorldCup2022.SemifinalsStage => WorldCup2022.MinigameScoreSemifinal,
            WorldCup2022.QuarterfinalsStage => WorldCup2022.MinigameScoreQuarterfinal,
            _ => WorldCup2022.MinigameScoreOthers
        };
    }

    public static (bool, int) GetVoteResult(Match match, UserMinigameModel vote)
    {
        const int MatchStatusFinished = 50;
        const int MatchResultWin = 1;
        const int MatchResultDraw = 0;
        if (match == null)
        {
            return (false, 0);
        }
        if (match.Status != MatchStatusFinished)
        {
            return (false, 0);
        }
        var status = false;
        var score = 0;
        var voteTeam = vote.TeamId == 0 ? match.HomeTeam.TeamId : vote.TeamId;
        var matchResult = LivescoreHelper.GetMatchResult(match, voteTeam);
        if (matchResult == MatchResultWin && vote.TeamId != 0)
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

    public static List<UserMinigameModel> GetUsersVote(List<UserMinigameModel> users, UserMinigameModel vote)
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

    public static List<UserMinigameModel> HandleStandings(IList<UserMinigameModel> users,
        IList<UserMinigameModel> votes, List<int> points)
    {
        var standing = new List<UserMinigameModel>();
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
                if (createdDate < votes[j].CreatedDate && users[i].UserId == votes[j].UserId)
                {
                    createdDate = votes[j].CreatedDate;
                }
            }
            standing.Add(new UserMinigameModel
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
        standing = standing.OrderByDescending(x => x.Point).ToList();
        standing = SortPlayersTime(standing);
        return standing;
    }

    public static List<UserMinigameModel> SortPlayersTime(List<UserMinigameModel> standing)
    {
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
        return sortPoint;
    }

    public static List<UserMinigameModel> CalculatorPointer(IList<Match> matches, IList<UserMinigameModel> votes)
    {
        var points = new List<int>();
        var users = new List<UserMinigameModel>();
        foreach (var vote in votes)
        {
            var matchVote = GetMatch(matches, vote);
            var (status, score) = GetVoteResult(matchVote, vote);
            points.Add(status ? score : 0);
            users = GetUsersVote(users, vote);
        }
        var standing = HandleStandings(users, votes, points);
        return standing;
    }

    public static int GetCountVotesStage(IList<UserMinigameModel> votes, int numStage)
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
        var result = !(status == WorldCup2022.LockStage || status == WorldCup2022.OnEndStage);
        return result;
    }

    public static string GetIconStage(string status)
    {
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
        return iconStage;
    }

    public static int GetCountStageActiveMinigame(IList<Match> matches)
    {
        var result = 0;
        const int maxCountStage = 4;
        for (var i = 0; i < maxCountStage; i++)
        {
            var statusStage = GetStatusStage(matches, i + 1);
            if (statusStage != WorldCup2022.LockStage && statusStage != WorldCup2022.BeforeStartedStage)
            {
                result = i + 1;
            }
        }
        return result;
    }

    public static int GetCountStageEndMinigame(IList<Match> matches)
    {
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
        return result;
    }

    public static string GetCountDownStage(string status, IList<Match> matches, int numStage)
    {
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
            matches[indexMatches[numStage]].StartTime.AddHours(MGTPlus).AddMinutes(SubtractMinutes).ToString(CultureInfo.InvariantCulture);
        return statusStage;
    }

    public static string GetStatusStage(IList<Match> matches, int numStage)
    {
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

        var timeSpanNow = DateTimeUtilize.UtcNow().DateTime.AddHours(MGTPlus) - DateTimeOffset.UnixEpoch.DateTime;
        var timeStartStage = DateTimeOffset.Parse(startStages[numStage - 1], CultureInfo.InvariantCulture).DateTime - DateTimeOffset.UnixEpoch.DateTime;
        var checkNow = timeStartStage.TotalSeconds - timeSpanNow.TotalSeconds;
        string statusStage;
        if (checkNow > 0)
        {
            statusStage = checkNow > SixtyMinsToSecond ? WorldCup2022.LockStage : WorldCup2022.BeforeStartedStage;
        }
        else
        {
            var timeSpanEnd = matches[indexMatches[numStage - 1]].StartTime.AddHours(MGTPlus) - DateTimeOffset.UnixEpoch.DateTime;
            var checkNowEnd = timeSpanEnd.TotalSeconds - timeSpanNow.TotalSeconds;
            if (checkNowEnd > NinetyMinsToSecond)
            {
                statusStage = WorldCup2022.OnStartedStage;
            }
            else if (checkNowEnd > ThirtyMinsToSecond)
            {
                statusStage = WorldCup2022.BeforeEndStage;
            }
            else { statusStage = WorldCup2022.OnEndStage; }
        }

        return statusStage;
    }

    public static bool CheckStartStage(int numStage)
    {
        List<string> startStages =
        [
            WorldCup2022.TimestampMinigameStage01Start,
            WorldCup2022.TimestampMinigameStage02Start,
            WorldCup2022.TimestampMinigameStage03Start,
            WorldCup2022.TimestampMinigameStage04Start
        ];

        var timeSpanNow = DateTimeUtilize.UtcNow().AddHours(MGTPlus).DateTime - DateTimeOffset.UnixEpoch.DateTime;
        var timeStartStage = DateTimeOffset.Parse(startStages[numStage - 1], CultureInfo.InvariantCulture).DateTime - DateTimeOffset.UnixEpoch.DateTime;
        var checkNow = timeStartStage.TotalSeconds - timeSpanNow.TotalSeconds;
        if (checkNow > 0)
        {
            return false;
        }
        return true;
    }
}