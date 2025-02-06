namespace SabaNews.Services;

using System.Threading.Tasks;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Banner;
using SabaNews.Models.Banner;
using SabaNews.Services.Interfaces;

public class BannerService(IBaseService baseService) : IBannerService
{
    public async Task<BannerModel> GetBannerInfoAsync()
    {
        var banner = await baseService.GetDataEntityAsync<BannerModel>(new GetBannerInfoCriteria());
        return banner;
    }


    public async Task<CommandResult> UpdateBannerInfoAsync(BannerModel banner, int ActorId)
    {
        var criteria = new UpdateBannerInfoCommand
        {
            DesktopTopNavigationUrl = banner.DesktopTopNavigationUrl,
            DesktopTopUrl = banner.DesktopTopUrl,
            MobileTopUrl = banner.MobileTopUrl,
            MobileTopNavigationUrl = banner.MobileTopNavigationUrl,
            DesktopCenterUrl = banner.DesktopCenterUrl,
            DesktopCenterNavigationUrl = banner.DesktopCenterNavigationUrl,
            DesktopLeftUrl = banner.DesktopLeftUrl,
            DesktopLeftNavigationUrl = banner.DesktopLeftNavigationUrl,
            DesktopRightUrl = banner.DesktopRightUrl,
            DesktopRightNavigationUrl = banner.DesktopRightNavigationUrl,
            MobileCenterNavigationUrl = banner.MobileCenterNavigationUrl,
            MobileCenterUrl = banner.MobileCenterUrl,
            MobileBottomUrl = banner.MobileBottomUrl,
            MobileBottomNavigationUrl = banner.MobileBottomNavigationUrl,
            ActorId = ActorId
        };
        return await baseService.ExecuteNonQueryAsync(criteria);
    }
}