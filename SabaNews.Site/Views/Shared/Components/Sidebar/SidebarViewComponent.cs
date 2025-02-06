namespace SabaNews.Site.Views.Shared.Components.Sidebar;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Models.ViewModel.Posts;
using SabaNews.Core.Constants;
using SabaNews.Models.Posts;
using Services.Interfaces;

public class SidebarViewComponent(IPostService postService, IDataControlService dataControlService)
    : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync(string cateSlug = "", int postID = 0, int limitItem = 0)
    {
        IEnumerable<Post> posts;
        bool isMostViewPosts;
        if (string.IsNullOrWhiteSpace(cateSlug))
        {
            isMostViewPosts = false;
            var end = limitItem == 0 ? Constants.GetFourItems : limitItem;
            posts = await dataControlService.GetRecentPostsAsync();
            posts = posts.Take(end).ToList();
            ViewData[Constants.ViewDataHeadTitle] = Constants.RecentPostsTitle;
        }
        else
        {
            isMostViewPosts = true;
            var postParam = new PostParam
            {
                Slug = cateSlug,
                Start = Constants.FromFirstItem,
                End =  Constants.GetFourItems,
                PostID = postID
            };
            posts = await postService.GetTopPostsByCateSlugAsync(postParam);
            ViewData[Constants.ViewDataHeadTitle] = Constants.MostViewPostTitle;
        }
        var Model = new SideBarViewModel
        {
            Posts = posts,
            IsMostViewPosts = isMostViewPosts
        };

        return View(Model);
    }
}