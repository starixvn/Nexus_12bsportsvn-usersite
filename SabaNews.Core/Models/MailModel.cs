namespace SabaNews.Core.Models;

public class MailModel
{
    public string Subject { get; set; }
    public string Body { get; set; }
    public string ReceiverEmail { get; set; }
    public bool IsSendEDM { get; set; }
}