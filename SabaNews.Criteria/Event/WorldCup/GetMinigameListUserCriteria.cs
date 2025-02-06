namespace SabaNews.Criteria.Event.WorldCup;

using Fanex.Data.Repository;

public class GetMinigameListUserCriteria : CriteriaBase
{
    public override string GetSettingKey() => "worldcup_minigame_get_list_users";

    public override bool IsValid() => true;
}