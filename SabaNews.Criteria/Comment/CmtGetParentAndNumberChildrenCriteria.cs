namespace SabaNews.Criteria.Comment;

using Fanex.Data.Repository;

public class CmtGetParentAndNumberChildrenCriteria : CriteriaBase
{
    public int PostID { get; set; }

    public string FilterType { get; set; }

    public int Start { get; set; }

    public int End { get; set; }

    public int TotalItems { get; set; }

    public int TotalParentCmt { get; set; }

    public override string GetSettingKey() => "cmt_get_parent_and_number_children";

    public override bool IsValid() => PostID > 0;
}