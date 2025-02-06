namespace SabaNews.Livescore.Repositories;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data;
using Fanex.Data.Repository;
using Interfaces;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;

public class MatchRepository : IMatchRepository
{
    private const string splitOnMatch = "LeagueId, HomeTeamId, AwayTeamId";

    public async Task<IList<Match>> GetMatchByDateAsync(ICriteria criteria)
    {
        using var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey());
        var matches = await db.QueryAsync<Match, League, Country, Season, SeasonStage, Team, Team, Match>(
            (match, league, country, season, stage, home, away) =>
            {
                league.Season = season;
                league.Stage = stage;
                league.Country = country;

                match.League = league;
                match.HomeTeam = home;
                match.AwayTeam = away;
                match.Stage = stage;

                return match;
            },
            splitOn: "LeagueId, CountryId, SeasonId, StageId, HomeTeamId, AwayTeamId",
            parameterSet: criteria);
        return matches.ToList();
    }

    public async Task<HeadToHeadDetail> GetHeadToHeadAsync(ICriteria criteria)
    {
        using var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey());
        using var multi = await db.QueryMultipleAsync(criteria);
        var matches = multi.Read<Match, League, Team, Team, Match>(
            (match, league, home, away) =>
            {
                match.League = league;
                match.HomeTeam = home;
                match.AwayTeam = away;

                return match;
            },
            splitOnMatch);

        var team = await multi.ReadFirstOrDefaultAsync<H2HTeam>();
        var common = new List<Match>();
        var home = new List<Match>();
        var away = new List<Match>();
        if (matches.Any() && team != null)
        {
            const byte TotalMatches = 5;
            common = matches.Where(item => (item.HomeTeam.TeamId == team.HomeId && item.AwayTeam.TeamId == team.AwayId)
                                           || (item.HomeTeam.TeamId == team.AwayId && item.AwayTeam.TeamId == team.HomeId))
                .Skip(0).Take(TotalMatches).ToList();

            home = matches.Where(item => item.HomeTeam.TeamId == team.HomeId || item.AwayTeam.TeamId == team.HomeId)
                .Skip(0).Take(TotalMatches).ToList();

            away = matches.Where(item => item.HomeTeam.TeamId == team.AwayId || item.AwayTeam.TeamId == team.AwayId)
                .Skip(0).Take(TotalMatches).ToList();
        }

        return new HeadToHeadDetail
        {
            Common = common,
            Home = home,
            Away = away
        };
    }

    public async Task<Match> GetMatchByIdAsync(ICriteria criteria)
    {
        using var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey());
        var matches = await db.QueryEntityAsync<Match, League, Season, SeasonStage, Team, Team, Match>(
            (match, league, season, stage, home, away) =>
            {
                league.Season = season;
                match.League = league;

                match.HomeTeam = home;
                match.AwayTeam = away;
                match.Stage = stage;

                return match;
            },
            splitOn: "LeagueId, SeasonId, StageId, HomeTeamId, AwayTeamId",
            parameterSet: criteria);
        return matches;
    }

    public async Task<Match> GetSummaryMatchByIdAsync(ICriteria criteria)
    {
        using var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey());
        var matches = await db.QueryEntityAsync<Match, League, Season, Team, Team, Match>(
            (match, league, season, home, away) =>
            {
                league.Season = season;
                match.League = league;

                match.HomeTeam = home;
                match.AwayTeam = away;

                return match;
            },
            splitOn: "LeagueId, SeasonId, HomeTeamId, AwayTeamId",
            parameterSet: criteria);
        return matches;
    }

    public async Task<MatchUpdate> GetMatchByIdUpdateAsync(ICriteria criteria)
    {
        using var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey());
        var matches = await db.QueryEntityAsync<MatchUpdate, League, Season, SeasonStage, Team, Team, MatchUpdate>(
            (match, league, season, stage, home, away) =>
            {
                league.Season = season;
                match.League = league;

                match.HomeTeam = home;
                match.AwayTeam = away;
                match.Stage = stage;

                return match;
            },
            splitOn: "LeagueId, SeasonId, StageId, HomeTeamId, AwayTeamId",
            parameterSet: criteria);
        return matches;
    }

    public async Task<IList<Match>> GetMatchByIdsAsync(ICriteria criteria)
    {
        using var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey());
        var matches = await db.QueryAsync<Match, League, Country, Team, Team, Match>(
            (match, league, country, home, away) =>
            {
                match.League = league;
                match.League.Country = country;
                match.HomeTeam = home;
                match.AwayTeam = away;

                return match;
            },
            splitOn: "LeagueId, CountryId, HomeTeamId, AwayTeamId",
            parameterSet: criteria);
        return matches.ToList();
    }

    public async Task<IList<Match>> GetMatchBySeasonFilterAsync(ICriteria criteria)
    {
        using var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey());
        var matches = await db.QueryAsync<Match, Team, Team, SeasonStage, Match >(
            (match, home, away, stage) =>
            {
                match.HomeTeam = home;
                match.AwayTeam = away;
                match.Stage = stage;

                return match;
            },
            splitOn: "HomeTeamId, AwayTeamId, StageId",
            parameterSet: criteria);
        return matches.ToList();
    }

    public async Task<IList<Match>> GetTodayMatchesAsync(ICriteria criteria)
    {
        using var db = ObjectDbFactory.CreateInstance(criteria.GetSettingKey());
        var matches = await db.QueryAsync<Match, League, Team, Team, Match >(
            (match, league, home, away) =>
            {
                match.League = league;
                match.HomeTeam = home;
                match.AwayTeam = away;

                return match;
            },
            splitOn: "LeagueId, HomeTeamId, AwayTeamId",
            parameterSet: criteria);
        return matches.ToList();
    }
}