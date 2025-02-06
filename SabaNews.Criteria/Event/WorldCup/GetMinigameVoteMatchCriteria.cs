namespace SabaNews.Criteria.Event.WorldCup;

using Fanex.Data.Repository;

public class GetMinigameVoteMatchCriteria : CriteriaBase
{
    public long MatchId { get; set; }

    public override string GetSettingKey() => "worldcup_minigame_getVoteMatch";

    public override bool IsValid() => MatchId > 0 ;
}