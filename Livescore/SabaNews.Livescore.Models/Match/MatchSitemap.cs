namespace SabaNews.Livescore.Models.Match;

using System;

public class MatchSitemap
{
    public long MatchId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public long HomeTeamId { get; set; }
    public string HomeTeamNameVN { get; set; }
    public string HomeTeamNameEN { get; set; }
    public string HomeTeamFullNameEN { get; set; }

    public long AwayTeamId { get; set; }
    public string AwayTeamNameVN { get; set; }
    public string AwayTeamNameEN { get; set; }
    public string AwayTeamFullNameEN { get; set; }

    public long LeagueId { get; set; }
    public string LeagueNameEN { get; set; }
    public string LeagueFullNameEN { get; set; }
    public string LeagueNameVN { get; set; }

}