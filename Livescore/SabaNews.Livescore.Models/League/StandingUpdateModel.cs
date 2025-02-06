namespace SabaNews.Livescore.Models.League;

public class StandingUpdateModel
{
    public long SeasonId { get; set; }
    public long StageId { get; set; }
    public long TeamId { get; set; }
    public int Position { get; set; }
    public bool IsUpdatePosition { get; set; }
    public bool IsUpdateGroupName { get; set; }
    public string GroupName { get; set; }
    public string OldGroupName { get; set; }
    public short? Total { get; set; }
    public short? Won { get; set; }
    public short? Loss { get; set; }
    public short? Draw { get; set; }
    public short? Points { get; set; }
    public short? Goals { get; set; }
    public short? GoalsAgainst { get; set; }
    public short? GoalDiff { get; set; }
}