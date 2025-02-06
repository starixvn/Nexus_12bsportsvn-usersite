using System;

namespace SabaNews.Criteria.Email;

public class CreateEmailDetailCriteria : BaseNonQueryCommand
{
    public int EmailId { get; set; }

    public int UserId { get; set; }

    public string TokenId { get; set; }

    public string EmailAddress { get; set; }

    public string EmailTitle { get; set; }

    public string EmailContent { get; set; }

    public DateTimeOffset SendTime { get; set; }

    public int Status { get; set; }

    public override string GetSettingKey() => "email_detail_create";

    public override bool IsValid() => EmailId > 0 && UserId > 0;
}