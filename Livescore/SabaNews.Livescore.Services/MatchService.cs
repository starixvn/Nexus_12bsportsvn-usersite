namespace SabaNews.Livescore.Services;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Interfaces;
using Repositories.Interfaces;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Lineup;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using SabaNews.Livescore.Services.Criteria.Match;

public class MatchService(IMatchRepository matchRepository, IBaseService baseService) : IMatchService
{
    public async Task<IList<Match>> GetMatchByDateAsync(GetMatchByDateCriteria criteria)
    {
        return await matchRepository.GetMatchByDateAsync(criteria);
    }

    public async Task<IList<Match>> GetLiveMatchAsync()
    {
        var criteria = new GetLiveMatchCriteria();
        return await matchRepository.GetMatchByDateAsync(criteria);
    }

    public async Task<(League, IList<Match>)> GetMatchBySeasonAsync(GetMatchBySeasonCriteria criteria)
    {
        var (leagues, season, floatMatches) = await baseService.FetchMultipleAsync<League, Season, FloatMatchModel>(criteria);
        var league = leagues.FirstOrDefault();
        if (league != null)
        {
            league.Season = season.FirstOrDefault();
        }
            
        var matches = ProcessFloatMatches(floatMatches);

        return (league, matches);
    }

    public async Task<(League, IList<Match>)> GetMatchByLeagueAsync(GetMatchByLeagueCriteria criteria)
    {
        var (leagues, season, floatMatches) = await baseService.FetchMultipleAsync<League, Season, FloatMatchModel>(criteria);
        var league = leagues.FirstOrDefault();
        if (league != null)
        {
            league.Season = season.FirstOrDefault();
        }

        var matches = ProcessFloatMatches(floatMatches);

        return (league, matches);
    }

    public async Task<IList<SeasonStandings>> GetSeasonStandingsAsync(GetSeasonStandingsCriteria criteria)
    {
        var (standings, floatMatches) = await baseService.FetchMultipleAsync<SeasonStandings, FloatMatchModel>(criteria);
        if (standings is not null && standings.Any())
        {
            foreach (var item in standings)
            {
                item.Matches = floatMatches.Where(match => match.StageId == item.StageId
                                                           && (match.HomeTeamId == item.TeamId || match.AwayTeamId == item.TeamId))
                    .OrderByDescending(x => x.StartTime).ToList();
            }
        }
        return standings?.ToList();
    }

    public async Task<Match> GetMatchByIdAsync(GetMatchByIdCriteria criteria)
    {
        return await matchRepository.GetMatchByIdAsync(criteria);
    }

    public async Task<Match> GetSummaryMatchByIdAsync(GetSummaryMatchByIdCriteria criteria)
    {
        return await matchRepository.GetSummaryMatchByIdAsync(criteria);
    }

    public async Task<MatchUpdate> GetMatchByIdUpdateAsync(GetMatchByIdUpdateCriteria criteria)
    {
        return await matchRepository.GetMatchByIdUpdateAsync(criteria);
    }

    public async Task<IEnumerable<MatchIncident>> GetMatchIncidentAsync(GetMatchIncidentCriteria criteria)
    {
        return await baseService.GetDataAsync<MatchIncident>(criteria);
    }

    public async Task<Statistic> GetMatchStatisticAsync(GetMatchStatisticCriteria criteria)
    {
        var (homeStatictis, awayStatistic) = await baseService.FetchMultipleAsync<TeamStatistic, TeamStatistic>(criteria);
        var data = new Statistic
        {
            HomeStatistic = homeStatictis.FirstOrDefault(),
            AwayStatistic = awayStatistic.FirstOrDefault()
        };
        return data;
    }

    public async Task<LineupDetail> GetLineupAsync(GetMatchLineupCriteria criteria)
    {
        var (generalInfo, home, away) = await baseService.FetchMultipleAsync<Lineup, LineupTeam, LineupTeam>(criteria);
        var data = new LineupDetail
        {
            GeneralInfo = generalInfo.FirstOrDefault(),
            Home = home.ToList(),
            Away = away.ToList()
        };
        return data;
    }

    public async Task<HeadToHeadDetail> GetHeadToHeadAsync(GetHeadToHeadCriteria criteria)
    {
        return await matchRepository.GetHeadToHeadAsync(criteria);
    }

    public async Task<IList<Match>> GetMatchByIdsAsync(GetMatchByIdsCriteria criteria)
    {
        return await matchRepository.GetMatchByIdsAsync(criteria);
    }

    public async Task<IList<Match>> GetMatchBySeasonFilterAsync(GetMatchBySeasonFilterCriteria criteria)
    {
        return await matchRepository.GetMatchBySeasonFilterAsync(criteria);
    }


    public async Task<CommandResult> UpdateMatchAsync(UpdateMatchCommand cmd)
    {
        return await baseService.ExecuteNonQueryAsync(cmd);
    }

    public async Task<IList<Match>> GetTodayMatchesAsync()
    {
        var today = DateTimeUtilize.UtcNow().ConvertToClient().DateTime;
        var criteria = new GetHotLeagueMatchTodayCriteria
        {
            FromTime = today.ToStartOfDay().ConvertToGMT(),
            ToTime = today.ToEndOfDay().ConvertToGMT()
        };
        return await matchRepository.GetTodayMatchesAsync(criteria);
    }

    public async Task<IList<MatchSitemap>> GetMatchSitemapAsync()
    {
        var matches = await baseService.GetDataAsync<MatchSitemap>(new GetMatchSitemapCriteria());
        return matches.ToList();
    }


    private List<Match> ProcessFloatMatches(IEnumerable<FloatMatchModel> floatMatches)
    {
        var matches = new List<Match>();
        foreach (var match in floatMatches)
        {
            var stage = match.StageId.HasValue
                ? new SeasonStage
                {
                    StageId = match.StageId.Value,
                    StageNameEN = match.StageNameEN,
                    StageNameVN = match.StageNameVN,
                    Mode = match.StageMode,
                    GroupCount = match.GroupCount,
                    RoundCount = match.RoundCount,
                    OrderIndex = match.OrderIndex
                }
                : null;
            matches.Add(new Match
            {
                MatchId = match.MatchId,
                FootballAddStartTime = match.FootballAddStartTime,
                FootballStartTime = match.FootballStartTime,
                FootballNextHalfStartTime = match.FootballNextHalfStartTime,
                StartTime = match.StartTime,
                EndTime = match.EndTime,
                Status = match.Status,
                GroupNum = match.GroupNum,
                Round = match.Round,
                HomeTeamHalfScore = match.HomeTeamHalfScore,
                AwayTeamHalfScore = match.AwayTeamHalfScore,
                HomeTeamTotalScore = match.HomeTeamTotalScore,
                AwayTeamTotalScore = match.AwayTeamTotalScore,
                HomeTeamAggregateScore = match.HomeTeamAggregateScore,
                AwayTeamAggregateScore = match.AwayTeamAggregateScore,
                HomeTeamExtraScore = match.HomeTeamExtraScore,
                AwayTeamExtraScore = match.AwayTeamExtraScore,
                HomeTeamPenaltyScore = match.HomeTeamPenaltyScore,
                AwayTeamPenaltyScore = match.AwayTeamPenaltyScore,
                HomeTeam = new Team
                {
                    TeamId = match.HomeTeamId,
                    TeamNameEN = match.HomeTeamNameEN,
                    TeamFullNameEN = match.HomeTeamFullNameEN,
                    TeamNameVN = match.HomeTeamNameVN,
                    Icon = match.HomeTeamIcon,
                    IconVN = match.HomeTeamIconVN
                },
                AwayTeam = new Team
                {
                    TeamId = match.AwayTeamId,
                    TeamNameEN = match.AwayTeamNameEN,
                    TeamFullNameEN = match.AwayTeamFullNameEN,
                    TeamNameVN = match.AwayTeamNameVN,
                    Icon = match.AwayTeamIcon,
                    IconVN = match.AwayTeamIconVN
                },
                Stage = stage,
                IsSecondLeg = match.IsSecondLeg
            });
        }
        return matches;
    }
}