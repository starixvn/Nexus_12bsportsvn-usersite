namespace SabaNews.Criteria.Email;

using Fanex.Data.Repository;
using System;

public class GetEmailsCriteria : CriteriaBase
{
    public string Search { get; set; }

    public int Start { get; set; }

    public int End { get; set; }

    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public int Status { get; set; }

    public int CreatedBy { get; set; }

    public int TotalItems { get; set; }

    public override string GetSettingKey() => "email_get_all";

    public override bool IsValid() => true;
}