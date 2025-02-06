namespace SabaNews.Criteria.User;

using Fanex.Data.Repository;

public class GetUserByIdCriteria : CriteriaBase
{
    public int UserId { get; set; }

    public override string GetSettingKey() => "user_get_by_id";

    public override bool IsValid() => UserId > 0;
}