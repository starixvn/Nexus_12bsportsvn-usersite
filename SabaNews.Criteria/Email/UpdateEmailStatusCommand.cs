namespace SabaNews.Criteria.Email;

public class UpdateEmailStatusCommand : BaseNonQueryCommand
{
    public int _EmailId { get; set; }

    public int _UserId { get; set; }

    public int Status { get; set; }

    public override string GetSettingKey() => "email_detail_update_status";

    public override bool IsValid() => true;
}