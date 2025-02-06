namespace SabaNews.Site.Views.Shared.Components.LeftMenuProfile;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Services;
using SabaNews.Services.Interfaces;
using System.Threading.Tasks;

public class LeftMenuProfileViewComponent(
    ISessionService sessionService,
    IUserService userService)
    : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync(string page = "")
    {
        var user = await userService.GetUserByIdAsync(sessionService.User.Id);
        ViewBag.Page = page;
        return View(user);
    }
}