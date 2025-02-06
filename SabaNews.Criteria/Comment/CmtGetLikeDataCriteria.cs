namespace SabaNews.Criteria.Comment;

using Fanex.Data.Repository;

public class CmtGetLikeDataCriteria : CriteriaBase
{
    public long CommentID { get; set; }

    public override string GetSettingKey() => "cmt_get_like_data_cmtId";

    public override bool IsValid() => CommentID > 0;
}