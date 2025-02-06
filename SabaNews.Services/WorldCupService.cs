namespace SabaNews.Services;

using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Event.WorldCup;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Event.WorldCup;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class WorldCupService(IBaseService baseService) : IWorldCupService
{
    public async Task<IList<UserMinigameModel>> GetMinigameByUserStageAsync(GetMinigameByUserStageCriteria criteria)
    {
        var result = await baseService.GetDataAsync<UserMinigameModel>(criteria);
        return result.ToList();
    }

    public async Task<IList<UserMinigameModel>> GetMinigameByUserAsync(long userId)
    {
        var result = await baseService.GetDataAsync<UserMinigameModel>(new GetMinigameByUserCriteria { UserId = userId });
        return result.ToList();
    }

    public async Task<CommandResult> UpdateMinigameVoteAsync(UpdateMinigameVoteCommand cmd)
    {
        return await baseService.ExecuteNonQueryAsync(cmd);
    }

    public async Task<MinigameMatchVote> GetMinigameVoteMatchAsync(GetMinigameVoteMatchCriteria criteria)
    {
        var result = await baseService.GetDataEntityAsync<MinigameMatchVote>(criteria);
        return result;
    }

    public async Task<IList<UserMinigameModel>> GetMinigameUsersAsync(GetMinigameUsersByStageCriteria criteria)
    {
        var result = await baseService.GetDataAsync<UserMinigameModel>(criteria);
        return result.ToList();
    }

    public async Task<IList<UserMinigameModel>> GetMinigameAllUsersAsync()
    {
        var result = await baseService.GetDataAsync<UserMinigameModel>(new GetMinigameListUserCriteria());
        return result.ToList();
    }

    public async Task<IList<Match>> GetMatchWCBySeasonAsync(GetMatchBySeasonCriteria criteria)
    {
        var (leagues, season, floatMatches) = await baseService.FetchMultipleAsync<League, Season, FloatMatchModel>(criteria);
        var league = leagues.FirstOrDefault();
        if (league != null)
        {
            league.Season = season.FirstOrDefault();
        }

        var matches = new List<Match>();
        foreach (var item in floatMatches)
        {
            var stage = item.StageId.HasValue
                ? new SeasonStage
                {
                    StageNameEN = item.StageNameEN,
                    StageNameVN = item.StageNameVN,
                    StageId = item.StageId.Value,
                    RoundCount = item.RoundCount,
                    GroupCount = item.GroupCount,
                    Mode = item.StageMode,
                    OrderIndex = item.OrderIndex
                }
                : null;
            matches.Add(new Match
            {
                MatchId = item.MatchId,
                FootballStartTime = item.FootballStartTime,
                FootballAddStartTime = item.FootballAddStartTime,
                StartTime = item.StartTime,
                FootballNextHalfStartTime = item.FootballNextHalfStartTime,
                EndTime = item.EndTime,
                GroupNum = item.GroupNum,
                Status = item.Status,
                HomeTeamHalfScore = item.HomeTeamHalfScore,
                AwayTeamHalfScore = item.AwayTeamHalfScore,
                Round = item.Round,
                HomeTeamTotalScore = item.HomeTeamTotalScore,
                AwayTeamTotalScore = item.AwayTeamTotalScore,
                HomeTeamAggregateScore = item.HomeTeamAggregateScore,
                AwayTeamExtraScore = item.AwayTeamExtraScore,
                AwayTeamAggregateScore = item.AwayTeamAggregateScore,
                HomeTeamPenaltyScore = item.HomeTeamPenaltyScore,
                HomeTeamExtraScore = item.HomeTeamExtraScore,
                AwayTeamPenaltyScore = item.AwayTeamPenaltyScore,
                HomeTeam = new Team
                {
                    TeamId = item.HomeTeamId,
                    TeamFullNameEN = item.HomeTeamFullNameEN,
                    TeamNameEN = item.HomeTeamNameEN,
                    Icon = item.HomeTeamIcon,
                    TeamNameVN = item.HomeTeamNameVN,
                    IconVN = item.HomeTeamIconVN
                },
                AwayTeam = new Team
                {
                    TeamId = item.AwayTeamId,
                    TeamFullNameEN = item.AwayTeamFullNameEN,
                    TeamNameEN = item.AwayTeamNameEN,
                    Icon = item.AwayTeamIcon,
                    TeamNameVN = item.AwayTeamNameVN,
                    IconVN = item.AwayTeamIconVN
                },
                Stage = stage,
                IsSecondLeg = item.IsSecondLeg
            });
        }

        return matches;
    }
}