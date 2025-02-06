namespace SabaNews.Livescore.Models.Team;

public class Player
{
    public long PlayerId { get; set; }
    public long TeamId { get; set; }
    public string NameEN { get; set; }
    public string FullNameEN { get; set; }

    public string Position { get; set; }

    public int JerseyNumner { get; set; }

    public int Order { get; set; }

    public bool IsFirst { get; set; }
}