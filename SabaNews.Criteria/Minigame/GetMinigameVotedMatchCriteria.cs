namespace SabaNews.Criteria.Minigame;

using Fanex.Data.Repository;

public class GetMinigameVotedMatchCriteria : CriteriaBase
{
    public long MatchId { get; set; }

    public override string GetSettingKey() => "worldcup_minigame_getVoteMatch";

    public override bool IsValid() => MatchId > 0 ;
}