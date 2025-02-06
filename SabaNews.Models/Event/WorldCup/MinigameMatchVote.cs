namespace SabaNews.Models.Event.WorldCup;

using System;

public class MinigameMatchVote
{
    public long MatchId { get; set; }

    public DateTime StartTime { get; set; }

    public byte Status { get; set; }
}