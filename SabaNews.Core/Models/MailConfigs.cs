namespace SabaNews.Core.Models;

using MimeKit;

public class MailConfigs
{
    public bool Enabled { get; set; }
    public string SenderName { get; set; }
    public string SmtpServer { get; set; }
    public int SmtpPort { get; set; }
    public bool EnableSsl { get; set; }
    public MessagePriority MailPriority { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public string AppMailId { get; set; }
    public string AppMailAddress { get; set; }
    public string MailFrom { get; set; }
    public bool IsAuthenticate { get; set; }
}