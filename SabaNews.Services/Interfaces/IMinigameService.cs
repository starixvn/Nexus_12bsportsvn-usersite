namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Criteria.Minigame;
using Models.Minigame;

public interface IMinigameService
{
    Task<IList<MinigameModel>> GetLeagueMinigameByUserStageAsync(GetLeagueMinigameByUserStageCriteria criteria);

    Task<IList<MinigameModel>> GetMinigameByUserAsync(long userId, long leagueId, long seasonId);

    Task<IList<MinigameModel>> GetLeagueMinigameByStageAsync(GetLeagueMinigameByStageCriteria criteria);

    Task<MinigameMatchVotedModel> GetMinigameVoteMatchAsync(GetMinigameVotedMatchCriteria criteria);

    Task<CommandResult> UpdateMinigameVoteAsync(UpdateMinigameVoteCommand cmd);


}