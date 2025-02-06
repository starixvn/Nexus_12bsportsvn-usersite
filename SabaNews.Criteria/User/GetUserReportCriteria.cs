namespace SabaNews.Criteria.User;

using Fanex.Data.Repository;
using System;

public class GetUserReportCriteria : CriteriaBase
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public string Search { get; set; }

    public string SearchType { get; set;}

    public string DateSort { get; set; }

    public int Start { get; set; }

    public int End { get; set; }

    public int TotalItems { get; set; }

    public override string GetSettingKey() => "user_get_report";

    public override bool IsValid() => ToDate >= FromDate;
}