namespace SabaNews.Services;

using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.User;
using SabaNews.Models.User;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;


public class UserService(IBaseService baseService) : IUserService
{
    public async Task<CommandResult> UpdateUserSavePostAsync(int userID, string listPosts)
    {
        var command = new UpdateUserSavePostCommand
        {
            UserID = userID,
            ListPosts = listPosts
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<UserSession> GetUserByIdAsync(int userID)
    {
        var criteria = new GetUserByIdCriteria
        {
            UserId = userID
        };
        return await baseService.GetDataEntityAsync<UserSession>(criteria);
    }

    public async Task<CommandResult> UpdateUserInfoAsync(UserSession user)
    {
        var command = new UpdateUserInfoCommand
        {
            UserID = user.Id,
            _name = user.Name,
            _password = user.Password,
            _phone = user.Phone,
            _gender = user.Gender,
            _photo = user.Photo,
            _yearOfBirth = user.YearOfBirth,
            _isSubscribe = user.IsSubscribe
        };
            
        var result = await baseService.ExecuteNonQueryAsync(command);
        return result;
    }

    public async Task<IEnumerable<UserSession>> GetAllUserAsync(GetAllUserCriteria criteria)
    {
        return await baseService.GetDataAsync<UserSession>(criteria);
    }

    public async Task<IEnumerable<UserReportModel>> GetUserReportAsync(GetUserReportCriteria criteria)
    {
        return await baseService.GetDataAsync<UserReportModel>(criteria);
    }

    public async Task<CommandResult> UnSubcriteUserAsync(int UserId, string token)
    {
        var command = new UserUnsubribeCommand
        {
            UserId = UserId,
            Token = token
        };
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> DisconnectLoginTypeAsync(int userId, string loginType)
    {
        var command = new SocialDisconnectTypeCommand
        {
            UserId = userId,
            LoginType = loginType
        };
        var result = await baseService.ExecuteNonQueryAsync(command);
        result.Message = command.NewLoginType;
        return result;
    }

    public async Task<CommandResult> CreateUserMembershipEventDataAsync(CreateUserMembershipEventDataCommand command)
    {
        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<IEnumerable<MembershipEventModel>> GetUserMembershipEventDataAsync(GetMembershipEventDataCriteria criteria)
    {
        return await baseService.GetDataAsync<MembershipEventModel>(criteria);
    }

    public async Task<MembershipEventModel> GetDetailMembershipEventDataAsync(GetDetailMembershipEventCriteria criteria)
    {
        return await baseService.GetDataEntityAsync<MembershipEventModel>(criteria);
    }

    public async Task<IEnumerable<MembershipEventModel>> GetMembershipEventResultAsync(GetMembershipEventResultCriteria criteria)
    {
        return await baseService.GetDataAsync<MembershipEventModel>(criteria);
    }

    public async Task<IEnumerable<UserSendEmail>> GetUserForSendEmail(GetUserForSendEmailCriteria criteria)
    {
        return await baseService.GetDataAsync<UserSendEmail>(criteria);
    }
}