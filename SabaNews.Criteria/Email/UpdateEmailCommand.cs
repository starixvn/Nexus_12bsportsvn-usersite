namespace SabaNews.Criteria.Email;

using System;

public class UpdateEmailCommand : BaseNonQueryCommand
{
    public int _EmailId { get; set; }

    public string EmailTitle { get; set; }

    public string EmailContent { get; set; }

    public string EmbeddedLink { get; set; }

    public DateTimeOffset SendDate { get; set; }

    public int CreatedBy { get; set; }

    public int Status { get; set; }

    public string Users { get; set; }

    public override string GetSettingKey() => "email_update";

    public override bool IsValid() => _EmailId > 0;
}