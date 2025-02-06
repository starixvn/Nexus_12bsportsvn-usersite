namespace SabaNews.Site.Extensions;

using SabaNews.Core.Constants.Livescore;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Models.Team;
using System.Collections.Generic;
using System.Linq;

public static class LivescoreHelper
{
    public static string GetTeamName(Team team)
    {
        var teamName = !string.IsNullOrEmpty(team.TeamNameEN) ? team.TeamNameEN : team.TeamFullNameEN;
        teamName = !string.IsNullOrEmpty(team.TeamNameVN) ? team.TeamNameVN : teamName;
        return teamName;
    }


    public static string GetStandingTeamName(SeasonStandings standing)
    {
        var teamName = !string.IsNullOrEmpty(standing.TeamNameEN) ? standing.TeamNameEN : standing.TeamFullNameEN;
        teamName = !string.IsNullOrEmpty(standing.TeamNameVN) ? standing.TeamNameVN : teamName;
        return teamName;
    }

    public static string GetTopScorersPlayerName(TopScorers topScorers)
    {
        var teamName = string.IsNullOrEmpty(topScorers.PlayerNameEN) ? topScorers.PlayerFullNameEN : topScorers.PlayerNameEN;
        return teamName;
    }

    public static string GetTeamIcon(string src)
    {
        return string.IsNullOrEmpty(src) ? "/css/images/logo-dummy.png" : src;
    }

    public static string GetLeagueName(League league)
    {
        var leagueName = !string.IsNullOrEmpty(league.LeagueNameEN) ? league.LeagueNameEN : league.LeagueFullNameEN;
        leagueName = !string.IsNullOrEmpty(league.LeagueNameVN) ? league.LeagueNameVN : leagueName;
        return leagueName;
    }

    public static string GetGeneralName(string nameEN, string nameFullEN, string nameVN)
    {
        var name = !string.IsNullOrEmpty(nameEN) ? nameEN : nameFullEN;
        name = !string.IsNullOrEmpty(nameVN) ? nameVN : name;
        return name;
    }


    public static List<StandingGroupModel> GroupStandingsByGroupName(IList<SeasonStandings> seasonStandings)
    {
        var groupNames = GetGroupNames(seasonStandings);
        var standingsViewModels = new List<StandingGroupModel>();

        for (var i = 0; i < groupNames.Count; i++)
        {
            standingsViewModels.Add(new StandingGroupModel
            {
                GroupName = groupNames[i],
                Standings = seasonStandings.Where(x => x.GroupName == groupNames[i]).ToList()
            });
        }
        return standingsViewModels;
    }

    public static List<string> GetGroupNames(IList<SeasonStandings> seasonStandings)
    {
        var groupNames = new List<string>();
        foreach (var item in seasonStandings.Where(standing => !groupNames.Exists(x => x == standing.GroupName)))
        {
            groupNames.Add(item.GroupName);
        }
        return groupNames;
    }

    public static bool IsLiveMatch(int status)
    {
        var live = MatchConstants.ListLiveMatchStatus.Where(item => item == status);
        return live.Any();

    }

    public static bool IsPreMatch(int status)
    {
        var result = MatchConstants.ListPreMatchStatus.Where(item => item == status);
        return result.Any();

    }

    public static short GetMatchTotalScore(Match match, bool isHome)
    {
        if (isHome)
        {
            return match.HomeTeamExtraScore > 0 ? match.HomeTeamExtraScore : match.HomeTeamTotalScore;
        }
        return match.AwayTeamExtraScore > 0 ? match.AwayTeamExtraScore : match.AwayTeamTotalScore;
    }

    public static short CheckMatchResult(short? homeScore, short? awayScore)
    {
        short result;
        if (homeScore > awayScore)
        {
            result = MatchConstants.Win;
        }
        else if (homeScore < awayScore)
        {
            result = MatchConstants.Lose;
        }
        else
        {
            result = MatchConstants.Draw;
        }
        return result;
    }

    public static short GetMatchResult(Match match, long teamId)
    {
        var homePEN = match.HomeTeamPenaltyScore;
        var awayPEN = match.AwayTeamPenaltyScore;
        var homeAGG = match.HomeTeamAggregateScore;
        var awayAGG = match.AwayTeamAggregateScore;
        var homeExtra = match.HomeTeamExtraScore;
        var awayExtra = match.AwayTeamExtraScore;
        var homeTotal = match.HomeTeamTotalScore;
        var awayTotal = match.AwayTeamTotalScore;
        if (match.AwayTeam.TeamId == teamId)
        {
            awayPEN = match.HomeTeamPenaltyScore;
            homePEN = match.AwayTeamPenaltyScore;
            awayAGG = match.HomeTeamAggregateScore;
            homeAGG = match.AwayTeamAggregateScore;
            awayExtra = match.HomeTeamExtraScore;
            homeExtra = match.AwayTeamExtraScore;
            awayTotal = match.HomeTeamTotalScore;
            homeTotal = match.AwayTeamTotalScore;
        }
        short result;
        if (homePEN > 0 || awayPEN > 0)
        {
            result = CheckMatchResult(homePEN, awayPEN);
        }
        else if (match.IsSecondLeg && (homeAGG > 0 || awayAGG > 0))
        {
            result = CheckMatchResult(homeAGG, awayAGG);
        }
        else if (homeExtra > 0 || awayExtra > 0)
        {
            result = CheckMatchResult(homeExtra, awayExtra);
        }
        else
        {
            result = CheckMatchResult(homeTotal, awayTotal);
        }
        return result;
    }


        

}