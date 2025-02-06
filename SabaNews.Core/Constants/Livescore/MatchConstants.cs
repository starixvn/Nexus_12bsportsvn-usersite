namespace SabaNews.Core.Constants.Livescore;

using SabaNews.Core.Models;
using System.Collections.Generic;

public static class MatchConstants
{
    public const short Draw = 0;
    public const short Win = 1;
    public const short Lose = 2;
    public const int NotStarted = 0;
    public const int FirstHalf = 10;
    public const int Intermission = 20;
    public const int SecondHalf = 30;
    public const int ExtraTime = 40;
    public const int PenaltyShootout = 41;
    public const int Finished = 50;
    public const int Delay = 60;
    public const int Interrupt = 61;
    public const int CutInHalf = 62;
    public const int Postpone = 63;
    public const int Cancel = 64;
    public const int TBD = 99;
    public static readonly IReadOnlyList<MatchStatus> ListMatchStatus = new List<MatchStatus>
    {
        new() { Id = NotStarted, Name = "Not Started" },
        new() { Id = FirstHalf, Name = "First Half" },
        new() { Id = Intermission, Name = "Intermission" },
        new() { Id = SecondHalf, Name = "Second Half" },
        new() { Id = ExtraTime, Name = "ExtraTime" },
        new() { Id = PenaltyShootout, Name = "Penalty Shootout" },
        new() { Id = Finished, Name = "Finished" },
        new() { Id = Delay, Name = "Delay" },
        new() { Id = Interrupt, Name = "Interrupt" },
        new() { Id = CutInHalf, Name = "Cut In Half" },
        new() { Id = Postpone, Name = "Postpone" },
        new() { Id = Cancel, Name = "Cancel" },
        new() { Id = TBD, Name = "TBD" }
    };

    public static readonly IReadOnlyList<KeyValue> ListPlayerPosition = new List<KeyValue>
    {
        new() { Id = 1, Name = "Coach" },
        new() { Id = 2, Name = "Goalkeeper" },
        new() { Id = 3, Name = "Defender" },
        new() { Id = 4, Name = "Midfielder" },
        new() { Id = 5, Name = "Striker" }
    };

    public static readonly IReadOnlyList<int> ListLiveMatchStatus = new List<int> { FirstHalf, Intermission, SecondHalf, ExtraTime, PenaltyShootout };

    public static readonly IReadOnlyList<int> ListPreMatchStatus = new List<int> { NotStarted, Postpone, Cancel, TBD, Delay };
}