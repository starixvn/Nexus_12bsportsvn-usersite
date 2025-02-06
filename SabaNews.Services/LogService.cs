namespace SabaNews.Services;

using System.Threading.Tasks;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Logs;
using SabaNews.Services.Interfaces;

public class LogService(IBaseService baseService) : ILogService
{
    public async Task<CommandResult> WriteLog(WriteLogCommand cmd)
    {
        return await baseService.ExecuteNonQueryAsync(cmd);
    }
}