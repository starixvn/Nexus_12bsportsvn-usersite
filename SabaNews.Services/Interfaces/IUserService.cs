namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using SabaNews.Criteria.User;
using SabaNews.Models.User;
using SabaNews.Models.ViewModel.User;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IUserService
{
    Task<CommandResult> UpdateUserSavePostAsync(int userID, string listPosts);

    Task<UserSession> GetUserByIdAsync(int userID);

    Task<CommandResult> UpdateUserInfoAsync(UserSession user);

    Task<CommandResult> DisconnectLoginTypeAsync(int userId, string loginType);

    Task<IEnumerable<UserSession>> GetAllUserAsync(GetAllUserCriteria criteria);

    Task<IEnumerable<UserReportModel>> GetUserReportAsync(GetUserReportCriteria criteria);

    Task<CommandResult> UnSubcriteUserAsync(int UserId, string token);

    Task<CommandResult> CreateUserMembershipEventDataAsync(CreateUserMembershipEventDataCommand command);

    Task<IEnumerable<MembershipEventModel>> GetUserMembershipEventDataAsync(GetMembershipEventDataCriteria criteria);

    Task<MembershipEventModel> GetDetailMembershipEventDataAsync(GetDetailMembershipEventCriteria criteria);

    Task<IEnumerable<MembershipEventModel>> GetMembershipEventResultAsync(GetMembershipEventResultCriteria criteria);

    Task<IEnumerable<UserSendEmail>> GetUserForSendEmail(GetUserForSendEmailCriteria criteria);
}