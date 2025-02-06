namespace SabaNews.Criteria.Poll;

using Fanex.Data.Repository;

public class GetAllPollCriteria : CriteriaBase
{

    public override string GetSettingKey() => "poll_get_all";

    public override bool IsValid() => true;


}