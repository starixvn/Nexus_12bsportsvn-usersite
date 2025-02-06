
namespace SabaNews.Site.Views.Shared.Components.Header;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Services;
using SabaNews.Models;
using System.Threading.Tasks;

public class HeaderViewComponent(ISessionService sessionService) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var isAuthenticated = sessionService.User != null;
        var model = new TopHeaderViewModel
        {
            IsAuthenticated = isAuthenticated,
            IsAdmin = isAuthenticated && sessionService.User.Metadata.Contains(Role.Administrator)
        };
        if (isAuthenticated)
        {
            model.User = sessionService.User;
        }
        return View(model);
    }
}