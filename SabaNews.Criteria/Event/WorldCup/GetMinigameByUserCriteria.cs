namespace SabaNews.Criteria.Event.WorldCup;

using Fanex.Data.Repository;

public class GetMinigameByUserCriteria : CriteriaBase
{
    public long UserId { get; set; }

    public override string GetSettingKey() => "worldcup_minigame_getByUser";

    public override bool IsValid() => UserId > 0;
}