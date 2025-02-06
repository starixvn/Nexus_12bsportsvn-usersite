namespace SabaNews.Models.Auth;

public class ExternalUser
{
    public int Id { get; set; }

    public string Identifier { get; set; }

    public string DisplayName { get; set; }

    public string LastName { get; set; }

    public string FirstName { get; set; }

    public string Email { get; set; }

    public string LoginType { get; set; }

    public string Avatar { get; set; }
}