namespace SabaNews.Services;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Poll;
using SabaNews.Models.Poll;
using SabaNews.Models.ViewModel.Poll;
using SabaNews.Services.Interfaces;

public class PollService(IBaseService baseService) : IPollService
{
    public async Task<PollViewModel> GetPollDetailAsync(GetPollDetailCriteria criteria)
    {
        var (polls, question, user) = await baseService.FetchMultipleAsync<PollModel, QuestionModel, PollUserModel>(criteria);
        var result = new PollViewModel
        {
            Polls = polls,
            Question = question.FirstOrDefault(),
            UserVote = user.FirstOrDefault(),
            IsUserVoted = user.Any(),
            TotalVotes = polls.Sum(item => item.Vote)
        };
        return result;
    }


    public async Task<IList<QuestionModel>> GetAllPollAsync()
    {
        var result = await baseService.GetDataAsync<QuestionModel>(new GetAllPollCriteria());
        return result.ToList();
    }

    public async Task<CommandResult> VotePollAsync(int questId, int answerId, string userIp)
    {
        var command = new VotePollSurveyCommand
        {
            QuestId = questId,
            AnswerId = answerId,
            UserIP = userIp
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }
}