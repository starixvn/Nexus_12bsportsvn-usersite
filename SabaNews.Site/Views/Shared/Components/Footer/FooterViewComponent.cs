namespace SabaNews.Site.Views.Shared.Components.Footer;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

public class FooterViewComponent(IDataControlService dataControlService) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var menus = await dataControlService.GetMenuData();
        return View(menus);
    }
}