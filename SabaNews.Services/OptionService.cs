namespace SabaNews.Services;

using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Options;
using SabaNews.Models.Options;
using SabaNews.Services.Interfaces;
using System.Threading.Tasks;

public class OptionService(IBaseService baseService) : IOptionService
{
    public async Task<CommandResult> UpdateOptionAsync(string key, string value, long actorId = 0)
    {
        var cmd = new UpdateOptionCommand { OptionKey = key, OptionValue = value, ActorId = actorId };
        return await baseService.ExecuteNonQueryAsync(cmd);
    }

    public async Task<Option> GetOptionAsync(string Key)
    {
        var criteria = new GetOptionCriteria { OptionKey = Key };
        var result = await baseService.GetDataEntityAsync<Option>(criteria);
        return result;
    }

    public async Task<CommandResult> CountOptionValueAsync(string Key)
    {
        var cmd = new CountOptionValueCommand { OptionKey = Key };
        var result = await baseService.ExecuteNonQueryAsync(cmd);
        return result;
    }
}