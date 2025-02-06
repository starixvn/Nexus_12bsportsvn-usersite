namespace SabaNews.Livescore.Core.Enum;

using System.ComponentModel;

public enum EventReasonStatus
{
    Unknown,

    [Description("Foul")]
    Foul,

    [Description("PersonalFoul")]
    PersonalFoul,

    [Description("Violation of opponent/injured substitution")]
    InjuredSubstitution,

    [Description("Tactical foul/tactical substitution")]
    TacticalSubstitution,

    [Description("Offensive Foul")]
    OffensiveFoul,

    [Description("Off the Ball Foul")]
    OffTheBallFoul
}