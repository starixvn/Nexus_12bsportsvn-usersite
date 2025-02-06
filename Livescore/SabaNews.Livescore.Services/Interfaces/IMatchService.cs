namespace SabaNews.Livescore.Services.Interfaces;

using System.Collections.Generic;
using System.Threading.Tasks;
using SabaNews.Core.Models;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Lineup;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.Match;

public interface IMatchService
{
    Task<IList<Match>> GetMatchByDateAsync(GetMatchByDateCriteria criteria);

    Task<IList<Match>> GetLiveMatchAsync();

    Task<(League, IList<Match>)> GetMatchBySeasonAsync(GetMatchBySeasonCriteria criteria);

    Task<(League, IList<Match>)> GetMatchByLeagueAsync(GetMatchByLeagueCriteria criteria);

    Task<IList<SeasonStandings>> GetSeasonStandingsAsync(GetSeasonStandingsCriteria criteria);

    Task<LineupDetail> GetLineupAsync(GetMatchLineupCriteria criteria);

    Task<IEnumerable<MatchIncident>> GetMatchIncidentAsync(GetMatchIncidentCriteria criteria);

    Task<Statistic> GetMatchStatisticAsync(GetMatchStatisticCriteria criteria);

    Task<HeadToHeadDetail> GetHeadToHeadAsync(GetHeadToHeadCriteria criteria);

    Task<Match> GetMatchByIdAsync(GetMatchByIdCriteria criteria);

    Task<Match> GetSummaryMatchByIdAsync(GetSummaryMatchByIdCriteria criteria);

    Task<MatchUpdate> GetMatchByIdUpdateAsync(GetMatchByIdUpdateCriteria criteria);

    Task<IList<Match>> GetMatchByIdsAsync(GetMatchByIdsCriteria criteria);

    Task<IList<Match>> GetMatchBySeasonFilterAsync(GetMatchBySeasonFilterCriteria criteria);

    Task<CommandResult> UpdateMatchAsync(UpdateMatchCommand cmd);

    Task<IList<Match>> GetTodayMatchesAsync();

    Task<IList<MatchSitemap>> GetMatchSitemapAsync();

}