namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using SabaNews.Criteria.Poll;
using SabaNews.Models.Poll;
using SabaNews.Models.ViewModel.Poll;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IPollService
{
    Task<PollViewModel> GetPollDetailAsync(GetPollDetailCriteria criteria);

    Task<CommandResult> VotePollAsync(int questId, int answerId, string userIp);

    Task<IList<QuestionModel>> GetAllPollAsync();
}