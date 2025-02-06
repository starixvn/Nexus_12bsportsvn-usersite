namespace SabaNews.Site.Controllers;

using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Poll;
using SabaNews.Criteria.Posts;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Poll;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Extensions;

public class PostController(IPostService postService,
    IConfiguration configuration,
    ISessionService sessionService,
    IPollService pollService,
    IDataControlService dataControlService) : Controller
{

    [Route("{slug}")]
    public async Task<IActionResult> Single(string slug)
    {
        if(string.IsNullOrEmpty(slug))
        {
            return View(Constants.EmptyBlogView);
        }
        if (!slug.Contains(".html"))
        {
            return await HandleSlugWithoutHtmlAsync(slug);
        }
        var (cleanSlug, postId) = GetPostInfoFromSlug(slug);
        var post = await postService.GetPostDetailAsync(postId);
        if (post == null)
        {
            return View(Constants.EmptyBlogView);
        }

        if(post.Slug != cleanSlug)
        {
            return RedirectToActionPermanent("Single", "Post", new { slug = post.Uri });
        }

        var viewModel = await CreateSingleViewModelAsync(post, cleanSlug);

        return View(viewModel);
    }

    private async Task<SingleViewModel> CreateSingleViewModelAsync(Post post, string cleanSlug)
    {
        var savePost = GetLoginSavedPost(sessionService.User, post.ID);
        var (matchId, customContent) = PostHelper.GetInfoFromContent(post.PostContent);

        var cateInfo = GetCateInfo(post);
        var cateParents = await postService.GetCateParentsAsync(cateInfo.Slug);
        cateInfo.Parent = PostHelper.GetTopCateParent(cateParents);
        cateInfo.Url = Url.Action("Category", "Home", new { slug = cateInfo.Slug + CategoryKey.Suffix});

        post.SeoTitle = string.IsNullOrEmpty(post.SeoTitle) ? post.PostTitle : Helper.ReplaceStringFromVarSeo(post.SeoTitle, post.PostTitle);
        post.SeoDescription = string.IsNullOrEmpty(post.SeoDescription) ? post.PostExcerpt : Helper.ReplaceStringFromVarSeo(post.SeoDescription, post.PostTitle);
        post.PostContent = customContent;
        post.ListCategories = post.CategoriesSlug.Split(',').Select(item => item.Trim()).ToList();
        var domainUrl = configuration.GetValue<string>("BaseUrl");
        return new SingleViewModel
        {
            SinglePost = post,
            IsLogin = sessionService.User != null,
            SavePost = savePost,
            AbsoluteUrl = $"{domainUrl}{cleanSlug}-{post.ID}.html",
            IsVideo = PostHelper.IsVideo(cateParents),
            CateInfo = cateInfo,
            MatchId = matchId,
            CateParents = cateParents,
            DomainUrl = domainUrl,
            IsIndex = post.ListCategories.Exists(s => Constants.ExcludedCategories.Contains(s, System.StringComparer.OrdinalIgnoreCase))
        };
    }

    private async Task<IActionResult> HandleSlugWithoutHtmlAsync(string slug)
    {
        var summary = await postService.GetPostDetailSummaryAsync(slug);
        if (summary == null)
        {
            return View(Constants.EmptyBlogView);
        }
        return RedirectToActionPermanent("Single", "Post", new { slug = summary.Uri });
    }

    private static SavePost GetLoginSavedPost(UserSession user, long postId)
    {
        return user?.HandleSavePosts.Find(val => val.PostID == postId);
    }

    private static (string, int) GetPostInfoFromSlug(string slug)
    {
        slug = slug.Replace(".html","");
        var arrSlug = slug.Split("-");
        if (!int.TryParse(arrSlug[^1], out var postId))
        {
            return (slug, 0);
        }
        slug = slug.Replace("-" + postId, "");
        return (slug, postId);
    }

    private static CateInfo GetCateInfo(Post post)
    {
        var listCateSlug = post.CategoriesSlug.Split(',').Select(item => item.Trim()).ToList();
        var listCateName = post.CatesName.Split(',').Select(item => item.Trim()).ToList();

        if(!string.IsNullOrEmpty(post.PrimaryCategory))
        {
            var categories = post.Categories.Split(',').Select(item => item.Trim()).ToList();
            var cateIndex = categories.FindIndex(c => c == post.PrimaryCategory);
            if(cateIndex >= 0)
            {
                return new CateInfo { Slug = listCateSlug[cateIndex], Name =  listCateName[cateIndex]};
            }
        }

        var subCateSlug = listCateSlug.Where(item => item != Constants.VideoSlug).ToList();
        var subCateName = listCateName.Where(item => item != Constants.Video).ToList();

        var slug = subCateSlug.Any() ? subCateSlug[0] : listCateSlug[0];
        var name = subCateName.Any() ? subCateName[0] : listCateName[0];

        return new CateInfo { Slug = slug, Name = name };
    }


    [Route("kich-hoat-tai-khoan-saba-sports")]
    public IActionResult ActiveAccount()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> GetPollData(int questId, int themeId)
    {
        PollViewModel result;
        var clientIP = GetClientIP();
        var criteria = new GetPollDetailCriteria
        {
            QuestId = questId,
            ThemeId = themeId,
            UserIp = clientIP
        };
        result = await pollService.GetPollDetailAsync(criteria);
        if(result.Question == null)
        {
            return Json(null);
        }
        return PartialView("_Poll", result);
    }

    [HttpPost]
    public async Task<IActionResult> VotePoll(int questId, int answerId, int themeId)
    {
        var clientIP = GetClientIP();
        var result = await pollService.VotePollAsync(questId, answerId, clientIP);
        if (result.IsSuccessful)
        {
            return await GetPollData(questId, themeId);
        }
        return Json(result);
    }


    [HttpPost]
    public async Task<IActionResult> GetPostsSameCategory(string slug, long postId)
    {
        var criteria =  new GetPostsByCateSlugPagingCriteria
        {
            _Start = Constants.FromFirstItem,
            _End = Constants.GetElevenItems,
            _CategorySlug = slug
        };
        var posts = await postService.GetPostsByCateSlugPagingAsync(criteria);
        posts = posts.Where(item => item.ID != postId).Take(Constants.GetTenItems).ToList();
        return PartialView("_SameCategory", posts);
    }


    [HttpPost]
    [Route("api/post/update-post-view")]
    public async Task<IActionResult> UpdatePostView(int postId, bool isVideo)
    {
        var result = await postService.UpdateViewAsync(postId, isVideo);
        return Ok(result);
    }

    [HttpPost]
    [Route("api/post/view-video")]
    public async Task<IActionResult> ViewVideo(int postId)
    {
        var viewVideoResult = await postService.UpdateVideoView(postId);
        return Ok(viewVideoResult);
    }


    [HttpPost]
    [Route("api/post/related-posts")]
    public IActionResult GetRelatedPosts(string cateSlug, int postID, string title)
    {
        return ViewComponent("RelatedPosts", new { cateSlug, postID, title });
    }

    [HttpPost]
    [Route("api/post/sidebar-posts")]
    public IActionResult GetSidebarPosts(string cateSlug, int postID, int limitItem)
    {
        return ViewComponent("Sidebar", new { cateSlug, postID, limitItem });
    }

    [HttpPost]
    [Route("api/banner")]
    public async Task<IActionResult> GetBanner()
    {
        var banner = await dataControlService.GetBannerData();
        return Ok(banner);
    }

    [HttpPost]
    [Route("api/post/lastestNews")]
    public async Task<IActionResult> GetLastestNews()
    {
        var posts = await dataControlService.GetRecentPostsAsync();
        posts = posts.Take(Constants.GetFiveItems);
        return Ok(posts);
    }

    [HttpPost]
    [Route("api/post/today-fixture")]
    public async Task<IActionResult> GetTodayFixturePost()
    {
        var criteria = new GetPostsByTagCriteria
        {
            _Tag = Constants.TodayLiveFixtureTag,
            _Start = Constants.FromFirstItem,
            _End = Constants.GetFiveItems
        };
        var posts = await postService.GetPostByTagAsync(criteria);
        return Ok(posts);
    }

    [HttpPost]
    [Route("api/GetGuessSidebar")]
    public async Task<IActionResult> GetGuessSidebar(string slug, int limitItem)
    {

        var posts = await dataControlService.GetCategoryPostsAsync(slug);
        posts = posts.Take(limitItem);
        ViewBag.Slug = slug;
        return PartialView("_GuessSidebar", posts);
    }

    [HttpPost]
    [Route("api/GetTodayMatches")]
    public async Task<IActionResult> GetTodayMatches()
    {
        var matches = await dataControlService.GetTodayMatches();
        return Json(matches);
    }

    public string GetClientIP()
    {
        var clientIP = HttpContext.Request.Headers["x-forwarded-for"].ToString();
        clientIP = !string.IsNullOrWhiteSpace(clientIP) ? clientIP.Split(',')[0] : HttpContext.Connection.RemoteIpAddress.ToString();
        return clientIP;
    }
}