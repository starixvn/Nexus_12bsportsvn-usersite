namespace SabaNews.Criteria.Event.WorldCup;

using Fanex.Data.Repository;
public class GetMinigameUsersByStageCriteria : CriteriaBase
{
    public byte stage { get; set; }

    public override string GetSettingKey() => "worldcup_minigame_get_by_stage";

    public override bool IsValid() => stage > 0;
}