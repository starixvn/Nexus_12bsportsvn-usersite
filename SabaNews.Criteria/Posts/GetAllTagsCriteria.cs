namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;

public class GetAllTagsCriteria : CriteriaBase
{
    public override string GetSettingKey() => "tag_get_all";

    public override bool IsValid() => true;
}