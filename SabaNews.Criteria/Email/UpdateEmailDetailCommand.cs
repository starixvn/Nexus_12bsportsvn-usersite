namespace SabaNews.Criteria.Email;

public class UpdateEmailDetailCommand : BaseNonQueryCommand
{
    public int EmailId { get; set; }

    public int UserId { get; set; }

    public string EmailTitle { get; set; }

    public string EmailContent { get; set; }

    public override string GetSettingKey() => "email_detail_update";

    public override bool IsValid() => EmailId > 0 && UserId > 0;
}