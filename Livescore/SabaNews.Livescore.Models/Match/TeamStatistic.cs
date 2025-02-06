namespace SabaNews.Livescore.Models.Match;

public class TeamStatistic
{
    public long TeamId { get; set; }
    public string TeamNameEN { get; set; }
    public string TeamFullNameEN { get; set; }
    public string Icon { get; set; }
    public short Goal { get; set; }
    public short CornerKick { get; set; }
    public short YellowCard { get; set; }
    public short RedCard { get; set; }
    public short OutBall { get; set; }
    public short FreeKick { get; set; }
    public short GoalKick { get; set; }
    public short PenaltyKick { get; set; }
    public short YellowToRed { get; set; }
    public short FailPenaltyKick { get; set; }
    public short OwnGoal { get; set; }
    public short InjuryTime { get; set; }
    public short OnGoal { get; set; }
    public short MissGoal { get; set; }
    public short Attack { get; set; }
    public short DangerAttack { get; set; }
    public short ControlRate { get; set; }
    public short ExtraScore { get; set; }
    public short PenaltyScore { get; set; }
    public short Assists { get; set; }
    public short First { get; set; }
    public short Follow { get; set; }
    public short Foul { get; set; }
    public string Grade { get; set; }
    public short HalfCorner { get; set; }
    public string HalfPossession { get; set; }
    public short Head { get; set; }
    public short HeadSuccess { get; set; }
    public short Intercept { get; set; }
    public short OffSide { get; set; }
    public short OnDoor { get; set; }
    public short Pass { get; set; }
    public string PassSuccess { get; set; }
    public short Past { get; set; }
    public short Shoot { get; set; }
    public short ShootOut { get; set; }
    public short ShootStop { get; set; }
    public short Slide { get; set; }
    public short Steals { get; set; }
}