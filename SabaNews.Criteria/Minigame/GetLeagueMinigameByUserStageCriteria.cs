namespace SabaNews.Criteria.Minigame;

using Fanex.Data.Repository;

public class GetLeagueMinigameByUserStageCriteria : CriteriaBase
{
    public long UserId { get; set; }
    public byte Stage { get; set; }
    public long LeagueId { get; set; }
    public long SeasonId { get; set;}

    public override string GetSettingKey() => "minigame_League_getByUserStage";

    public override bool IsValid() => UserId > 0 && Stage > 0 && LeagueId > 0 && SeasonId > 0;
}