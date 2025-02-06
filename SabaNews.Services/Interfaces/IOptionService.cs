namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using SabaNews.Models.Options;
using System.Threading.Tasks;

public interface IOptionService
{
    Task<CommandResult> UpdateOptionAsync(string key, string value, long actorId = 0);
    Task<Option> GetOptionAsync(string Key);
    Task<CommandResult> CountOptionValueAsync(string Key);
}