namespace SabaNews.Models.ViewModel.Poll;

using SabaNews.Models.Poll;
using System.Collections.Generic;

public class PollViewModel
{
    public IEnumerable<PollModel> Polls { get; set; }
        
    public QuestionModel Question { get; set; }

    public PollUserModel UserVote { get; set; }

    public string ClassName { get; set; }

    public bool IsUserVoted { get; set; } 

    public int TotalVotes { get; set; }

}