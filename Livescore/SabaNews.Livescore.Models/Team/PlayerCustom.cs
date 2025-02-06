using System;

namespace SabaNews.Livescore.Models.Team;

public class PlayerCustom
{
    public long PlayerId { get; set; }
    public long TeamId { get; set; }
    public string PlayerName { get; set; }
    public string PlayerFullName { get; set; }
    public string ShirtNumber { get; set; }
    public string ClubName { get; set; }
    public DateTime Birthday { get; set; }
    public string Icon { get; set; }
    public int Position { get; set; }
}