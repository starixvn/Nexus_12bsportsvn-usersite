namespace SabaNews.Models.Minigame;

using System;

public class UserMinigameModel
{
    public long UserId { get; set; }
    public long MatchId { get; set; }
    public long TeamId { get; set; }
    public byte Stage { get; set; }
    public long LeagueId { get; set; }
    public long SeasonId { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public string UserName { get; set; }
    public string Icon { get; set; }
    public int Point { get; set; }
}