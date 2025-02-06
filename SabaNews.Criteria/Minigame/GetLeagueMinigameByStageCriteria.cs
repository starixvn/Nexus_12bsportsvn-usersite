namespace SabaNews.Criteria.Minigame;

using Fanex.Data.Repository;

public class GetLeagueMinigameByStageCriteria : CriteriaBase
{
    public byte Stage { get; set; }
    public long LeagueId { get; set; }
    public long SeasonId { get; set;}

    public override string GetSettingKey() => "minigame_League_getByStage";

    public override bool IsValid() =>  Stage > 0 && LeagueId > 0 && SeasonId > 0;
}