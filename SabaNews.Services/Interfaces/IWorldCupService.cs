namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using SabaNews.Criteria.Event.WorldCup;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Event.WorldCup;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IWorldCupService
{
    Task<IList<UserMinigameModel>> GetMinigameByUserStageAsync(GetMinigameByUserStageCriteria criteria);

    Task<CommandResult> UpdateMinigameVoteAsync(UpdateMinigameVoteCommand cmd);

    Task<MinigameMatchVote> GetMinigameVoteMatchAsync(GetMinigameVoteMatchCriteria criteria);

    Task<IList<UserMinigameModel>> GetMinigameByUserAsync(long userId);
    Task<IList<UserMinigameModel>> GetMinigameUsersAsync(GetMinigameUsersByStageCriteria criteria);
    Task<IList<Match>> GetMatchWCBySeasonAsync(GetMatchBySeasonCriteria criteria);

    Task<IList<UserMinigameModel>> GetMinigameAllUsersAsync();

}