namespace SabaNews.Models.Auth;

public class ResetPasswordModel
{
    public string Password { get; set; }

    public int Id { get; set; }

    public string Token { get; set; }
}