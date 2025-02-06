namespace SabaNews.Models.Email;

public class SendEDMModel
{
    public string EmailAddress { get; set; }

    public string EmailTitle { get; set; }

    public string EmailContent { get; set; }

    public string EmailTemplatePath { get; set; }

    public string SubscribeLink { get; set; }

    public string BaseUrl { get; set; }
}