namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;

public class UpdatePriorityTopScorersCriteria : BaseNonQueryCommand
{
    public bool IsCheck { get; set; }
    public int TopUpdate { get; set; }
    public int RowNum { get; set; }
    public int Top { get; set; }
    public override string GetSettingKey() => "Livescore_Top_Scorers_UpdateTop";
    public override bool IsValid() => Top > 0;
}