namespace SabaNews.Criteria.Category;

public class UpdateCateLivescoreCommand : BaseNonQueryCommand
{
    public long CateId {get;set;}

    public long LeagueId {get;set;}

    public long SeasonId {get;set;}

    public int Status {get;set;}

    public long ActorId { get; set;}

    public override string GetSettingKey() => "cate_update_livescore";

    public override bool IsValid() => CateId > 0;
}