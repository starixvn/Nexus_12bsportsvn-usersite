namespace SabaNews.Site.Views.Event.WorldCup2022.Sidebar;

using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Posts;
using Services.Interfaces;

public class SidebarWCViewComponent(IPostService postService) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync(string cateSlug = "", int postID = 0)
    {
           
        const int endItemsWC = Constants.GetFourItems;
        var postWCParam = new PostParam
        {
            Slug = cateSlug,
            Start = Constants.FromFirstItem,
            End = endItemsWC,
            PostID = postID
        };
        var postsWC = await postService.GetTopPostsByCateSlugAsync(postWCParam);
                
        ViewData[Constants.ViewDataHeadTitle] = Constants.MostViewPostTitle;
            
           
        var viewModel = new SideBarViewModel
        {
            Posts = postsWC
        };

        return View("~/Views/Event/WorldCup2022/Sidebar/Default.cshtml", viewModel);
    }
}