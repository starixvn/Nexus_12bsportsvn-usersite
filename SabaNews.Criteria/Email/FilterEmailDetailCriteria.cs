namespace SabaNews.Criteria.Email;

using Fanex.Data.Repository;

public class FilterEmailDetailCriteria : CriteriaBase
{
    public int EmailID { get; set; }

    public string Search { get; set; } = "";

    public int IsClicked { get; set; } = -1;

    public int Status { get; set; } = -1;

    public int Start { get; set; }

    public int End { get; set; }

    public int TotalItems { get; set; }

    public override string GetSettingKey() => "email_detail_filter";

    public override bool IsValid() => true;
}