namespace SabaNews.Criteria.Category;

using Fanex.Data.Repository;

public class GetCateLivescoreCriteria : CriteriaBase
{
    public override string GetSettingKey() => "cate_get_livescore";

    public override bool IsValid() => true;
}