namespace SabaNews.Models.Poll;

public class PollModel
{
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public string Answer { get; set; }

    public int AnswerName { get; set; }

    public int Vote { get; set; }
}