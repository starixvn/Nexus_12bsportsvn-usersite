
namespace SabaNews.Criteria.Banner;

using Fanex.Data.Repository;

public class GetBannerPostCriteria : CriteriaBase
{
    public override string GetSettingKey() => "banner_get_post";

    public override bool IsValid() => true;
}