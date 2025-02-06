namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;
using System;

public class GetPostlistCriteria : CriteriaBase
{
    public DateTime _fromDate { get; set; }
    public int _Category { get; set; }

    public int _Subject { get; set; }

    public int _startItem { get; set; }

    public int _rowLimit { get; set;}

    public override string GetSettingKey() => "get_posts";

    public override bool IsValid() => _startItem >= 0 && _rowLimit <= 1000;
}