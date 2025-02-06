namespace SabaNews.Site.Views.Shared.Components.Menu;

using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Services;
using SabaNews.Models;
using SabaNews.Models.Categories;
using Services.Interfaces;

public class MenuViewComponent(IDataControlService dataControlService, ISessionService sessionService)
    : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync(string categorySlug = "", string page = "", MenuItems menuItems = null)
    {
        var menus = await dataControlService.GetMenuData();
        var detailMenu = await dataControlService.GetMenuData(MenuType.DetailMenu);
        var popularKeyword = detailMenu.LastOrDefault(item => item.ParentId == 0);
        var isAuthenticated = sessionService.User != null;
        var model = new MenuViewModel
        {
            Menus = menus,
            DetailMenu = detailMenu,
            PopularKeyword = popularKeyword,
            Page = page,
            IsAuthenticated = isAuthenticated,
            CategorySlug = categorySlug,
            MenuItems = menuItems,
            IsAdmin = isAuthenticated && !string.IsNullOrWhiteSpace(sessionService.User.Metadata)
                                      && sessionService.User.Metadata.Contains(Role.Administrator)
        };
        if (isAuthenticated)
        {
            model.User = sessionService.User;
        }
        return View(model);
    }
}