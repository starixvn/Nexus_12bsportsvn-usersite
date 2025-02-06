namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Livescore.Services.Criteria.Team;
using System.Collections.Generic;
using System.Threading.Tasks;
using Criteria.Minigame;
using Models.Minigame;

public interface IEuro2024Service
{
    Task<IList<TeamStage>> GetTeamByStage(long seasonId, long stageId);

    Task<IList<PlayerCustom>> GetTeamPlayerById(long teamId);

    Task<CommandResult> CreatePlayerAsync(CreateTeamPlayerCommand cmd);

    Task<PlayerCustom> GetPlayerById(long playerId);

    Task<CommandResult> UpdatePlayerAsync(UpdateTeamPlayerCommand cmd);

    Task<CommandResult> DeletePlayerAsync(long playerId);

    Task<IList<Match>> GetMatchByTeamSeasonAsync(GetMatchByTeamSeasonCriteria criteria);

    Task<IList<MinigameModel>> GetLeagueMinigameByUserStageAsync(GetLeagueMinigameByUserStageCriteria criteria);

    Task<IList<MinigameModel>> GetMinigameByUserAsync(long userId, long leagueId, long seasonId);

    Task<IList<UserMinigameModel>> GetLeagueMinigameByStageAsync(GetLeagueMinigameByStageCriteria criteria);
    Task<IList<MinigameModel>> GetLeagueMinigameByStageWithEmailAsync(GetLeagueMinigameByStageCriteria criteria);

    Task<MinigameMatchVotedModel> GetMinigameVoteMatchAsync(GetMinigameVotedMatchCriteria criteria);

    Task<CommandResult> UpdateMinigameVoteAsync(UpdateMinigameVoteCommand cmd);


}