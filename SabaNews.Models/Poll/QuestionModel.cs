namespace SabaNews.Models.Poll;

public class QuestionModel
{
    public int Id { get; set; }

    public int AnswerType { get; set; }

    public string Name { get; set; }

    public string Question { get; set; }
}