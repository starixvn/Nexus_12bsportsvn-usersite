using System;

namespace SabaNews.Criteria.Email;

public class CreateEmailCriteria : BaseNonQueryCommand
{
    public int Id { get; set; }
       
    public string EmailTitle { get; set; }

    public string EmailContent { get; set; }

    public string EmbeddedLink { get; set; }

    public DateTimeOffset SendDate { get; set; }

    public int CreatedBy { get; set; }

    public int Status { get; set; }
        
    public DateTimeOffset CreatedDate { get; set; }

    public string Users { get; set; }

    public override string GetSettingKey() => "email_create";

    public override bool IsValid() => !string.IsNullOrEmpty(EmailTitle) && !string.IsNullOrEmpty(EmailContent);

}