namespace SabaNews.Services;

using System.Threading.Tasks;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Auth;
using SabaNews.Models.Auth;
using SabaNews.Services.Interfaces;

public class ExternalAuthService(IBaseService baseService) : IExternalAuthService
{
    public async Task<CommandResult> CreateUserAsync(ExternalUser user)
    {
        var command = new CreateSocialUserCommand
        {
            DisplayName = user.DisplayName,
            Email = user.Email,
            FirstName = user.FirstName,
            Identifier = user.Identifier,
            LastName = user.LastName,
            LoginType = user.LoginType,
            Photo = user.Avatar
        };
        var result = await baseService.ExecuteNonQueryAsync(command);
        user.Id = command.UserId;
        return result;
    }

    public async Task<UserSession> GetUserAsync(string identifier, string loginType)
    {
        var criteria = new GetSocialUserCriteria
        {
            Identifier = identifier,
            LoginType = loginType
        };
        return await baseService.GetDataEntityAsync<UserSession>(criteria);
    }
}