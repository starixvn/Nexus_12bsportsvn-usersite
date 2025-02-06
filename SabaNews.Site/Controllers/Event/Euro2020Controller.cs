namespace SabaNews.Site.Controllers.Event;

using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Models.ViewModel.Euro2020;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Criteria.Posts;
using SabaNews.Models;
using SabaNews.Models.ViewModel;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Services.Interfaces;

public class Euro2020Controller(
    IPostService postService,
    IDataControlService dataControlService)
    : Controller
{
    [Route("/euro-2020")]
    public async Task<IActionResult> Index()
    {
        var Model = await dataControlService.GetEuro2020PageViewModel();
        return View("~/Views/Event/Euro2020/Index.cshtml", Model);
    }

    [Route("/euro-2020/doi-tuyen-euro-2020")]
    public async Task<IActionResult> Team()
    {
        var criteria = new GetPostsByCateSlugCriteria
        {
            _Start = Constants.FromFirstItem,
            _End = Constants.Total,
            _CategorySlug = Constants.Euro2020TeamSlug
        };
        var posts = await postService.GetPostsByCateSlugAsync(criteria);
        posts = posts.OrderBy(item => item.PostExcerpt);
        var cate = await postService.GetCateDetailAsync(Constants.Euro2020TeamSlug);
        var title = cate.SEOTitle ??= cate.Title;
        var header = new HeaderViewModel
        {
            HeadTitle = cate.Title,
            Title = title,
            Description = cate.Description
        };
        var Model = new CategoryViewModel
        {
            Posts = posts,
            Category = cate,
            Header = header
        };
        return View("~/Views/Event/Euro2020/Team.cshtml", Model);
    }

    [Route("/euro-2020/{slug}/page/{page}")]
    [Route("/euro-2020/{slug}")]
    public async Task<IActionResult> Category(string slug, int page = 1)
    {
        var start = (page - 1) * Constants.Perpage;
        var criteria = new GetPostsByCateSlugCriteria
        {
            _Start = start,
            _End = Constants.Perpage,
            _CategorySlug = slug
        };
        var posts = await postService.GetPostsByCateSlugAsync(criteria);
        if (!posts.Any())
        {
            return View(Constants.EmptyBlogView);
        }
        var cate = await postService.GetCateDetailAsync(slug);
        var title = cate.SEOTitle ??= cate.Title;
        var header = new HeaderViewModel
        {
            HeadTitle = cate.Title,
            Title = title,
            Description = cate.Description,
            Controller = Constants.Euro2020Video,
            Slug = slug
        };
        var paging = new PagingModel
        {
            CurrentPage = page,
            PageSize = Constants.Perpage,
            TotalPages = (int)Math.Ceiling(criteria.TotalItems / (double)Constants.Perpage)
        };
        var Model = new CategoryViewModel
        {
            Posts = posts.ToArray(),
            Category = cate,
            Header = header,
            Paging = paging

        };
        return View("~/Views/Event/Euro2020/Category.cshtml", Model);
    }

    [Route("/euro-2020/video-euro-2020/page/{page}")]
    [Route("/euro-2020/video-euro-2020")]
    public async Task<IActionResult> Video(int page = 1)
    {

        var start = (page - 1) * Constants.Perpage;
        var criteria = new GetPostsByCateSlugCriteria
        {
            _Start = start,
            _End = Constants.Perpage,
            _CategorySlug = Constants.Euro2020VideoSlug
        };
        var posts = await postService.GetPostsByCateSlugAsync(criteria);
        if (!posts.Any())
        {
            return View(Constants.EmptyBlogView);
        }
        var cate = await postService.GetCateDetailAsync(Constants.Euro2020VideoSlug);
        var title = cate.SEOTitle ??= cate.Title;
        var header = new HeaderViewModel
        {
            HeadTitle = cate.Title,
            Title = title,
            Description = cate.Description,
            Controller = Constants.Euro2020Video
        };
        var paging = new PagingModel
        {
            CurrentPage = page,
            PageSize = Constants.Perpage,
            TotalPages = (int)Math.Ceiling(criteria.TotalItems / (double)Constants.Perpage)
        };

        var Model = new CategoryViewModel
        {
            Posts = posts.ToArray(),
            Category = cate,
            Header = header,
            Paging = paging

        };
        return View("~/Views/Event/Euro2020/Video.cshtml", Model);
    }

    [Route("/euro-2020/lich-thi-dau-euro-2020")]
    public async Task<IActionResult> Schedule()
    {
        var criteria = new GetPostsByCateSlugCriteria
        {
            _Start = 0,
            _End = Constants.Total,
            _CategorySlug = Constants.Euro2020ScheduleSlug
        };
        var posts = await postService.GetPostsByCateSlugAsync(criteria);
        if (!posts.Any())
        {
            return View(Constants.EmptyBlogView);
        }
        posts = posts.Where(item => item.PostExcerpt.Trim().ToLower(CultureInfo.InvariantCulture) != Constants.TemplatePost).OrderBy(item => item.PostDate).ToList();
        var cate = await postService.GetCateDetailAsync(Constants.Euro2020ScheduleSlug);
        var title = cate.SEOTitle ??= cate.Title;
        var header = new HeaderViewModel
        {
            HeadTitle = cate.Title,
            Title = title,
            Description = cate.Description
        };
        var Model = new CategoryViewModel
        {
            Posts = posts,
            Category = cate,
            Header = header

        };
        return View("~/Views/Event/Euro2020/Schedule.cshtml", Model);
    }

    [Route("/euro-2020/bang-xep-hang-euro-2020")]
    public async Task<IActionResult> Ranking()
    {
        var criteria = new GetPostsByCateSlugCriteria
        {
            _Start = 0,
            _End = Constants.Total,
            _CategorySlug = Constants.Euro2020RankingSlug
        };
        var posts = await postService.GetPostsByCateSlugAsync(criteria);
        posts = posts.Where(item => item.PostExcerpt.Trim().ToLower(CultureInfo.InvariantCulture) != Constants.TemplatePost).OrderBy(item => item.PostDate).ToList();
        var thirdPlaceTable = await postService.GetPostDetailBySlugAsync(Constants.Euro2020FirstThirdPlaceTeamSlug, Constants.postType);
        var cate = await postService.GetCateDetailAsync(Constants.Euro2020RankingSlug);
        var title = cate.SEOTitle ??= cate.Title;
        var viewData = new ViewData
        {
            HeadTitle = cate.Title,
            Title = title,
            Description = cate.Description
        };
        var Model = new Euro2020RankingViewModel
        {
            Posts = posts,
            ThirdPlaceTable = thirdPlaceTable,
            Category = cate,
            ViewData = viewData

        };
        return View("~/Views/Event/Euro2020/Ranking.cshtml", Model);
    }

    [Route("/euro-2020/getTabData")]
    public async Task<IActionResult> GetTabData(string slug)
    {
        var post = await postService.GetPostDetailBySlugAsync(slug, Constants.postType);
        var isSuccessful = post != null;
        return Json(new { isSuccessful, data = post });
    }
}