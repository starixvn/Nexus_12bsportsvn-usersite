namespace SabaNews.Models.Email;

public class SendEmailDetailModel
{
    public int EmailId { get; set; }

    public int UserId { get; set; }

    public string EmailToken { get; set; }

    public string EmailAddress { get; set; }

    public string EmailTitle { get; set; }

    public string EmailContent { get; set; }

    public string SubscribeToken { get; set; }
}