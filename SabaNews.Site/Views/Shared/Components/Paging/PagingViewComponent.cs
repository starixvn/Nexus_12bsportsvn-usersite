namespace SabaNews.Site.Views.Shared.Components.Paging;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Models;

public class PagingViewComponent : ViewComponent
{
    public IViewComponentResult Invoke(PagingModel model)
    {
        return View(model);
    }
}