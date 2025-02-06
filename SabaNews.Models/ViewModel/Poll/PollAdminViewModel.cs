namespace SabaNews.Models.ViewModel.Poll;

using SabaNews.Models.Poll;
using System.Collections.Generic;

public class PollAdminViewModel
{
    public IList<QuestionModel> Polls { get; set; }

    public string SelectedQuest { get; set; }

    public int SelectedQuestId { get; set; }


}