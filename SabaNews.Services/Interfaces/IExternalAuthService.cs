namespace SabaNews.Services.Interfaces;

using System.Threading.Tasks;
using SabaNews.Core.Models;
using SabaNews.Models.Auth;

public interface IExternalAuthService
{
    Task<UserSession> GetUserAsync(string identifier, string loginType);

    Task<CommandResult> CreateUserAsync(ExternalUser user);
}