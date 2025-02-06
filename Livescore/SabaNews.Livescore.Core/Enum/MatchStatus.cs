namespace SabaNews.Livescore.Core.Enum;

public enum MatchStatus
{
    NotStarted = 0,
    FirstHalf = 10,
    Section1,
    EndOfTheFirstQuater,
    Section2,
    EndOfTheSecondQuater,
    Intermission = 20,
    SecondHalf = 30,
    Section3,
    EndOfTheThirdQuater,
    Section4,
    ExtraTime = 40,
    PenaltyShootout,
    Finished = 50,
    Postpone = 60,
    Interrupt,
    CutInHalf,
    Postponement,
    Cancel,
    TBD = 99
}