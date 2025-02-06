namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using SabaNews.Criteria.Logs;
using System.Threading.Tasks;

public interface ILogService
{
    Task<CommandResult> WriteLog(WriteLogCommand cmd);
}