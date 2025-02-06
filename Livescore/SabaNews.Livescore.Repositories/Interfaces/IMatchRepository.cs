namespace SabaNews.Livescore.Repositories.Interfaces;

using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using SabaNews.Livescore.Models.Match;

public interface IMatchRepository
{
    Task<IList<Match>> GetMatchByDateAsync(ICriteria criteria);

    Task<Match> GetMatchByIdAsync(ICriteria criteria);

    Task<HeadToHeadDetail> GetHeadToHeadAsync(ICriteria criteria);

    Task<IList<Match>> GetMatchByIdsAsync(ICriteria criteria);
    Task<IList<Match>> GetMatchBySeasonFilterAsync(ICriteria criteria);
    Task<MatchUpdate> GetMatchByIdUpdateAsync(ICriteria criteria);
    Task<Match> GetSummaryMatchByIdAsync(ICriteria criteria);
    Task<IList<Match>> GetTodayMatchesAsync(ICriteria criteria);
}