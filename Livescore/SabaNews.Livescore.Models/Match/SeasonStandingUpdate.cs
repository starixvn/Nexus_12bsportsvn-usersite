namespace SabaNews.Livescore.Models.Match;

public class SeasonStandingUpdate
{

    public long TeamId { get; set; }
    public string TeamNameEN { get; set; }
    public string TeamFullNameEN { get; set; }
    public string TeamNameVN { get; set; }
    public string Icon { get; set; }
    public string IconVN { get; set; }

    public long StageId { get; set; }
    public string StageNameEN { get; set; }
    public string StageNameVN { get; set; }
    public short OrderIndex { get; set; }

    public string GroupName { get; set; }
    public string GroupNameCustom { get; set; }
    public short Position { get; set; }
    public short Total { get; set; }
    public short? TotalCustom { get; set; }
    public short Won { get; set; }
    public short? WonCustom { get; set; }
    public short Loss { get; set; }
    public short? LossCustom { get; set; }
    public short Draw { get; set; }
    public short? DrawCustom { get; set; }

    public object Promotion { get; set; }

    public short Points { get; set; }
    public short? PointsCustom { get; set; }
    public short Goals { get; set; }
    public short? GoalsCustom { get; set; }
    public short GoalsAgainst { get; set; }
    public short? GoalsAgainstCustom { get; set; }
    public short GoalDiff { get; set; }
    public short? GoalDiffCustom { get; set; }
}