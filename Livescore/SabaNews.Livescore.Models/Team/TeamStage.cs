namespace SabaNews.Livescore.Models.Team;

public class TeamStage
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
    public int OrderIndex { get; set; }
}