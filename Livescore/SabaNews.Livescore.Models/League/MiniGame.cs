using System;

namespace SabaNews.Livescore.Models.League;

public class MiniGame
{
    public long ID { get; set; }
    public long TeamId { get; set; }
    public string Name { get; set; }
    public string LuckyNumber { get; set; }
    public DateTime JoinDate { get; set; }
    public string Email { get; set; }
    public string TeamFullNameEN { get; set; }
    public string TeamNameEN { get; set; }
    public string TeamNameVN { get; set; }
    public string TeamLogo { get; set; }
}