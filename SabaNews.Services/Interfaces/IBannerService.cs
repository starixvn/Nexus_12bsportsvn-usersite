namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using SabaNews.Models.Banner;
using System.Threading.Tasks;

public interface IBannerService
{
    Task<BannerModel> GetBannerInfoAsync();

    Task<CommandResult> UpdateBannerInfoAsync(BannerModel banner, int ActorId);
}