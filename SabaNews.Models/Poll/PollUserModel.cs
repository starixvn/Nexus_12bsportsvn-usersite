namespace SabaNews.Models.Poll;

public class PollUserModel
{
    public int Id { get; set; }

    public int QuestionId { get; set; }

    public string UserIP { get; set; }

    public int Answer { get; set; }

}