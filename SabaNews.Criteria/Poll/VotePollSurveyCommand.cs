namespace SabaNews.Criteria.Poll;

public class VotePollSurveyCommand : BaseNonQueryCommand
{
    public int QuestId { get; set; }

    public int AnswerId { get; set; }

    public string UserIP { get; set; }

    public override string GetSettingKey() => "poll_vote";

    public override bool IsValid() => QuestId > 0 && AnswerId > 0;
}