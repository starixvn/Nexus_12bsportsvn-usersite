namespace SabaNews.Site.Views.Shared.Components.BannerSidebar;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

public class BannerSidebarViewComponent(IDataControlService dataControlService) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var banner = await dataControlService.GetBannerData();
        return View(banner);
    }
}