namespace SabaNews.Site.Controllers;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Models.ViewModel;
using Models.ViewModel.Posts;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Criteria.Posts;
using SabaNews.Models;
using SabaNews.Models.Posts;
using SabaNews.Site.Extensions;
using Services.Interfaces;

public class HomeController(IPostService postService,
    IDataControlService dataControlService,
    IConfiguration configuration,
    IUserService userService,
    IOptionService optionService) : Controller
{
    private readonly string domain = configuration.GetValue<string>("BaseUrl");

    public async Task<IActionResult> Index()
    {
        var viewModel = await dataControlService.GetHomePageViewModel();
        var title = viewModel.Category.SEOTitle ??= viewModel.Category.Title;
        var header = new HeaderViewModel
        {
            CategoryId = Constants.Home,
            CategorySlug = Constants.Empty,
            Title = title,
            Description = viewModel.Category.Description
        };
        viewModel.Header = header;
        viewModel.Url = domain;
        viewModel.RSSUrl = $"{domain}tin-moi-nhat.rss";
        return View(viewModel);
    }

    [Route("/{slug:categoryslug}")]
    public async Task<IActionResult> Category(string slug)
    {
        var redirectLink = RedirectCategorySlug(slug);
        if (!string.IsNullOrEmpty(redirectLink))
        {
            return RedirectPermanent(redirectLink);
        }
        slug = slug.Replace(CategoryKey.Suffix, "");
        var viewModel = await dataControlService.GetCategoryViewModel(slug);
        if (viewModel == null)
        {
            return View(Constants.EmptyBlogView);
        }
        var menus = await dataControlService.GetMenuData(MenuType.DetailMenu);
        var menuCategory = PostHelper.GetMenuActive(menus.ToList(), viewModel.CateParents, slug);
        viewModel.Header.ActiveCategory = menuCategory.ActiveMenu ?? slug;
        viewModel.Menus = menus;
        viewModel.MenuItems = menuCategory.MenuItems;
        viewModel.Category.Url = $"{domain}{slug}{CategoryKey.Suffix}";
        viewModel.HeadTitle = string.IsNullOrEmpty(menuCategory.CurrentName) ? viewModel.Category.Title : menuCategory.CurrentName;
        var view = viewModel.IsVideo ? Constants.VideoView : Constants.CategoryView;
        return View(view, viewModel);
    }

    private static string RedirectCategorySlug(string slug)
    {
        var redirectLink = "";
        var cateRedirect = CategoryKey.CateRedirectList.FirstOrDefault(item => item.OldSlug == slug);
        if (cateRedirect != null)
        {
            redirectLink = cateRedirect.NewSlug;
        }
        return redirectLink;
    }

    [Route("Search/{keyword}")]
    public async Task<IActionResult> Search(string keyword, int page = 1)
    {
        keyword ??= string.Empty;
        var start = (page - 1) * Constants.Perpage;
        var criteria = new SearchPostsCriteria { _Keyword = keyword, _Start = start, _End = Constants.Perpage };
        var posts = await postService.SearchPostAsync(criteria);
        var totalItems = criteria.TotalItems;
        var model = new BlogViewModel
        {
            Posts = posts.ToList(),
            Header = new HeaderViewModel
            {
                Title = $"{Constants.SearchTitle} '{keyword}'",
                HeadTitle = $"{Constants.SearchTitle} '{keyword}'",
                Description = $"{Constants.SearchTitle} '{keyword}'",
                Keyword = keyword,
                Controller = Constants.Search
            },
            Paging = new PagingModel
            {
                CurrentPage = page,
                PageSize = Constants.Perpage,
                TotalPages = (int)Math.Ceiling(totalItems / (double)Constants.Perpage),
                Href = Url.Action("Search", "Home", new { keyword, page = (int?)null })
            }
        };

        var view = posts != null && posts.Any() ? "Search" : "SearchNotFound";
        return View(view, model);
    }

    [Route("/tin-the-thao/{slug1?}/{slug2?}/{slug3?}")]
    public ActionResult OldCategories(string slug1 = null, string slug2 = null, string slug3 = null)
    {
        string slug;
        if (slug3 != null)
        {
            slug = slug3;
        }
        else if (slug2 != null)
        {
            slug = slug2;
        }
        else if (slug1 != null)
        {
            slug = slug1;
        }
        else
        {
            slug = Constants.NewPostSlug;
        }
        return RedirectToActionPermanent("Category", "Home", new { slug = slug + CategoryKey.Suffix });
    }

    [Route("/tin-the-thao/{slug?}/page/{page}")]
    [Route("/tin-the-thao/page/{page}")]
    public IActionResult OldCategory(string slug = null, int page = 1)
    {
        slug ??= Constants.NewPostSlug;
        return RedirectToActionPermanent("Category", "Home", new { slug = slug + CategoryKey.Suffix });
    }

    [Route("/video/{slug?}")]
    [Route("/video/page/{page}")]
    public IActionResult OldVideo(int page = 1)
    {
        return RedirectToActionPermanent("Category", "Home", new { slug = Constants.VideoSlug + CategoryKey.Suffix });
    }

    [Route("/Search/page/{page}")]
    [Route("/Search/")]
    [Route("Search/{keyword}/page/{page}")]
    public IActionResult OldSearch(string keyword = "")
    {
        keyword = WebUtility.UrlEncode(keyword);
        return RedirectToActionPermanent("Search", "Home", new { keyword });

    }

    [Route("tag/{tagname}")]
    public async Task<IActionResult> Tag(string tagname, int page = 1)
    {
        var start = (page - 1) * Constants.Perpage;
        var criteria = new GetPostsByTagCriteria { _Tag = tagname.Trim(), _Start = start, _End = Constants.Perpage };
        var posts = await postService.GetPostByTagAsync(criteria);
        if (!posts.Any())
        {
            return View(Constants.EmptyBlogView);
        }
        var seoInfo = await postService.GetSeoSettingAsync();
        var totalItems = criteria.TotalItems;
        var tag = posts.Any() ? posts.First().Tags : tagname;
        var title = string.IsNullOrEmpty(seoInfo.TagTitle)
            ? string.Concat(tag, " | ", Constants.SiteName)
            : Regex.Replace(seoInfo.TagTitle, WordpressVariable.TermTitle, tag, RegexOptions.IgnoreCase);
        var model = new BlogViewModel
        {
            Posts = posts.ToList(),
            Category = new Category
            {
                OgTitle = title,
                OgImage = string.Concat(domain, "images/sabasports.svg"),
                Url = $"{domain}tag/{tagname}"
            },
            Header = new HeaderViewModel
            {
                Title = title,
                HeadTitle = tag,
                Keyword = tagname,
                Controller = Constants.Tag,
                Description = string.IsNullOrEmpty(seoInfo.TagDescription) ? "" : Regex.Replace(seoInfo.TagDescription, WordpressVariable.TermTitle, tag, RegexOptions.IgnoreCase)
            },
            Paging = new PagingModel
            {
                CurrentPage = page,
                PageSize = Constants.Perpage,
                TotalPages = (int)Math.Ceiling(totalItems / (double)Constants.Perpage),
                Href = Url.Action("Tag", "Home", new { tagname, page = (int?)null })
            }
        };

        return View(Constants.BlogView, model);
    }

    [Route("tag/{tagname}/page/{page}")]
    public IActionResult OldTag(string tagname, int page = 1)
    {
        return RedirectToActionPermanent("Tag", "Home", new { tagname });
    }

    [Route("author/{authorId}")]
    public async Task<IActionResult> Author(int authorId, int page = 1)
    {
        var start = (page - 1) * Constants.Perpage;
        var criteria = new GetPostsByAuthorCriteria { AuthorId = authorId, Start = start, End = Constants.Perpage };
        var user = await userService.GetUserByIdAsync(authorId);
        var posts = await postService.GetPostsByAuthor(criteria);
        var totalItems = criteria.TotalItems;
        var authorName = user != null ? user.Name : "";
        var model = new BlogViewModel
        {
            Posts = posts.ToList(),
            Category = new Category
            {
                OgTitle = string.Concat(authorName, " | ", Constants.SiteName),
                OgImage = string.Concat(domain, "images/sabasports.svg"),
                Url = Url.Action("Author", "Home", new { authorId }, Request.Scheme)
            },
            Header = new HeaderViewModel
            {
                Title = string.Concat(authorName, " | ", Constants.SiteName),
                HeadTitle = "Tác giả: '" + authorName + "'",
                Controller = Constants.Author,
                Keyword = authorId.ToString()
            },
            Paging = new PagingModel
            {
                CurrentPage = page,
                PageSize = Constants.Perpage,
                TotalPages = (int)Math.Ceiling(totalItems / (double)Constants.Perpage),
                Href = Url.Action("Author", "Home", new { authorId, page = (int?)null }, Request.Scheme)
            }
        };

        var view = posts.Any() ? Constants.BlogView : Constants.EmptyBlogView;
        return View(view, model);
    }

    [Route("warning")]
    public async Task<IActionResult> Warning()
    {
        var pageDetail = await postService.GetPageDetailBySlugAsync(Constants.WarningSlug);
        var title = pageDetail.SEOTitle ?? pageDetail.Title;
        var description = pageDetail.Description ??= title;
        var model = new PageViewModel
        {
            Category = pageDetail,
            Header = new HeaderViewModel
            {
                CategorySlug = Constants.WarningSlug,
                CategoryId = pageDetail.CateId,
                Title = title,
                Description = description
            }
        };

        return View(model);
    }

    [Route("thong-bao-thay-doi-ten-mien")]
    public ActionResult ChangeDomain()
    {
        return View();
    }

    [Route("lich-thi-dau")]
    public ActionResult RedirectLivescorePage()
    {
        return RedirectPermanent("/lich-thi-dau/bong-da");
    }



    [Route("policy")]
    public ActionResult Policy()
    {

        return View();
    }


    [HttpPost]
    [Route("api/post/category-posts")]
    public async Task<IActionResult> GetCategoryGrid(CategoryPostParams param)
    {
        var slug = param.Slug ??= Constants.NewPostSlug;
        var pageSize = param.PageSize;
        var start = (param.Page - 1) * pageSize;
        if (param.IsVideo)
        {
            start = param.Page > Constants.SecondPage ? (param.Page - 1) * pageSize + 1 : Constants.GetTenItems;
        }
        IEnumerable<Post> posts;
        if (slug == Constants.NewPostSlug)
        {
            var paramGetRecent = new GetRecentPostsParam
            {
                Start = start,
                End = pageSize
            };
            posts = await postService.GetRecentPostsAsync(paramGetRecent);
        }
        else
        {
            var criteria = new GetPostsByCateSlugPagingCriteria
            {
                _CategorySlug = slug,
                _Start = start,
                _End = pageSize
            };
            posts = await postService.GetPostsByCateSlugPagingAsync(criteria);
        }
        if (!posts.Any())
        {
            return Ok(false);
        }
        if (param.Page == Constants.SecondPage && param.FirstPagePosts != null)
        {
            posts = posts.Where(item => param.FirstPagePosts.TrueForAll(id => id != item.ID));
        }
        var view = param.IsVideo ? "~/Views/Home/_VideoGridView.cshtml" : "~/Views/Home/_CategoryGridView.cshtml";
        ViewBag.CurrentPage = param.Page;
        return PartialView(view, posts);
    }

    [HttpPost]
    [Route("api/post/type-posts")]
    public async Task<IActionResult> GetTypePostsGrid(TypePostParam param)
    {
        var start = (param.Page - 1) * param.PageSize;
        IEnumerable<Post> posts;
        if (param.Type == Constants.Search)
        {
            posts = await postService.SearchPostAsync(new SearchPostsCriteria { _Keyword = param.Keyword, _Start = start, _End = param.PageSize });
        }
        else if (param.Type == Constants.Tag)
        {
            posts = await postService.GetPostByTagAsync(new GetPostsByTagCriteria { _Tag = param.Keyword, _Start = start, _End = param.PageSize });
        }
        else if (param.Type == Constants.Author)
        {
            posts = await postService.GetPostsByAuthor(new GetPostsByAuthorCriteria { AuthorId = long.Parse(param.Keyword), Start = start, End = param.PageSize });
        }
        else
        {
            return Ok(false);
        }
        if (!posts.Any())
        {
            return Ok(false);
        }
        ViewBag.CurrentPage = param.Page;
        return PartialView("~/Views/Home/_CategoryGridView.cshtml", posts);
    }

    [HttpPost]
    [Route("api/GetHomeFixture")]
    public async Task<IActionResult> GetHomeFixture()
    {
        var fixture = await dataControlService.GetHomepageFixtureData();
        return Json(fixture);
    }

    [HttpPost]
    [Route("api/GetHomeStanding")]
    public async Task<IActionResult> GetHomeStanding()
    {
        var fixture = await dataControlService.GetHomepageStandingData();
        return Json(fixture);
    }

    [HttpPost]
    [Route("api/GetVideo")]
    public async Task<IActionResult> GetVideo()
    {
        var video = await dataControlService.GetCategoryPostsAsync(CategoryKey.VideoSlug);
        video = video.Skip(Constants.FromFirstItem).Take(Constants.GetSixItems).ToList();
        return PartialView("_VideoSidebar", video);
    }

    [HttpPost]
    [Route("api/GetCategorySidebar")]
    public async Task<IActionResult> GetCategorySidebar(string slug, int limitItem)
    {
        var posts = await dataControlService.GetCategoryPostsAsync(slug);
        posts = posts.Take(limitItem);
        ViewBag.Slug = slug;
        return PartialView("_CategorySidebar", posts);
    }
    [HttpPost]
    [Route("api/CountBanner")]
    public async Task<IActionResult> UpdateBannerCount()
    {
        var now = DateTimeUtilize.UtcNow();
        var deadLine = DateTimeUtilize.DateTime(2024, 02, 04, 17);
        if (now.DateTime > deadLine.DateTime)
        {
            return Json(null);
        }
        var cmd = await optionService.CountOptionValueAsync(OptionKey.BannerClickCount);
        return Json(cmd);
    }
}