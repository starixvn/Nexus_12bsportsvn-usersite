namespace SabaNews.Models.Auth;

public class ConfirmEmailModel
{
    public string Email { get; set; }

    public string Token { get; set; }

    public long UserId { get; set; }
}