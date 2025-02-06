namespace SabaNews.Services;

using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Livescore.Services.Criteria.Team;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Criteria.Minigame;
using Livescore.Repositories.Interfaces;
using Models.Minigame;

public class Euro2024Service(IBaseService baseService, IMatchRepository matchRepository) : IEuro2024Service
{
    public async Task<IList<TeamStage>> GetTeamByStage(long seasonId, long stageId)
    {
        var criteria = new GetTeamByStageCriteria { SeasonId = seasonId, StageId = stageId };
        var teams = await baseService.GetDataAsync<TeamStage>(criteria);
        return teams.ToList();
    }

    public async Task<IList<PlayerCustom>> GetTeamPlayerById(long teamId)
    {
        var criteria = new GetPlayerCustomByTeamIdCriteria { TeamId = teamId };
        var players = await baseService.GetDataAsync<PlayerCustom>(criteria);
        return players.ToList();
    }

    public async Task<PlayerCustom> GetPlayerById(long playerId)
    {
        var criteria = new GetPlayerCustomByIdCriteria { PlayerId = playerId };
        var players = await baseService.GetDataEntityAsync<PlayerCustom>(criteria);
        return players;
    }

    public async Task<IList<Match>> GetMatchByTeamSeasonAsync(GetMatchByTeamSeasonCriteria criteria)
    {
        return await matchRepository.GetMatchBySeasonFilterAsync(criteria);
    }

    public async Task<CommandResult> CreatePlayerAsync(CreateTeamPlayerCommand cmd)
    {
        return await baseService.ExecuteNonQueryAsync(cmd);
    }

    public async Task<CommandResult> UpdatePlayerAsync(UpdateTeamPlayerCommand cmd)
    {
        return await baseService.ExecuteNonQueryAsync(cmd);
    }

    public async Task<CommandResult> DeletePlayerAsync(long playerId)
    {
        return await baseService.ExecuteNonQueryAsync(new DeleteTeamPlayerCommand { PlayerId = playerId });
    }

    public async Task<IList<MinigameModel>> GetLeagueMinigameByUserStageAsync(GetLeagueMinigameByUserStageCriteria criteria)
    {
        var result = await baseService.GetDataAsync<MinigameModel>(criteria);
        return result.ToList();
    }

    public async Task<IList<MinigameModel>> GetMinigameByUserAsync(long userId, long leagueId, long seasonId)
    {
        var criteria = new GetLeagueMinigameByUserCriteria { UserId = userId, LeagueId = leagueId, SeasonId = seasonId };
        var result = await baseService.GetDataAsync<MinigameModel>(criteria);
        return result.ToList();
    }

    public async Task<IList<UserMinigameModel>> GetLeagueMinigameByStageAsync(GetLeagueMinigameByStageCriteria criteria)
    {
        var result = await baseService.GetDataAsync<UserMinigameModel>(criteria);
        return result.ToList();
    }

    public async Task<MinigameMatchVotedModel> GetMinigameVoteMatchAsync(GetMinigameVotedMatchCriteria criteria)
    {
        var result = await baseService.GetDataEntityAsync<MinigameMatchVotedModel>(criteria);
        return result;
    }

    public async Task<CommandResult> UpdateMinigameVoteAsync(UpdateMinigameVoteCommand cmd)
    {
        return await baseService.ExecuteNonQueryAsync(cmd);
    }


    public async Task<IList<MinigameModel>> GetLeagueMinigameByStageWithEmailAsync(GetLeagueMinigameByStageCriteria criteria)
    {
        var result = await baseService.GetDataAsync<MinigameModel>(criteria);
        return result.ToList();
    }




}