namespace SabaNews.Criteria.Email;

public class RemoveEmailDetailCommand : BaseNonQueryCommand
{
    public int EmailId { get; set; }

    public int UserId { get; set; }

    public override string GetSettingKey() => "email_detail_remove";

    public override bool IsValid() => EmailId > 0 && UserId > 0;
}