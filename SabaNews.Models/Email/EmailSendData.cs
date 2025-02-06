namespace SabaNews.Models.Email;

public class EmailSendData
{
    public int UserId { get; set; }

    public string Email { get; set; }

    public string Name { get; set; }

    public string SubscribeToken { get; set; }

    public string EmailToken { get; set; }

    public string EmailTitle { get; set; }

    public string EmailContent { get; set; }
}