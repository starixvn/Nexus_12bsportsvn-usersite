namespace SabaNews.Site.Areas.Admin.Controllers;

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Statistic;
using SabaNews.Resources;
using SabaNews.Services.Interfaces;

public class StatisticController(IStatisticService statisticService) : AdminController
{
    public IActionResult Index()
    {
        var now = DateTimeUtilize.Now();
        StatisticFilterViewModel viewModel = new()
        {
            FromDate = DateTimeUtilize.DateTime(now.Year, now.Month, 1),
            ToDate = now
        };
        return View(viewModel);
    }

    [HttpPost]
    public async Task<IActionResult> PostViewStatistic(StatisticFilterViewModel viewModel)
    {
        var statistic = await statisticService.GetPostViewStatistic(viewModel.FromDate.DateTime, viewModel.ToDate.DateTime);
        var statisticViewModel = new PostViewStatisticModel
        {
            PostViewDetails = statistic
        };
        return PartialView("_PostViewStatistic", statisticViewModel);
    }

    public IActionResult ViewDetails(DateTime? createdDate, bool isVideoDetails)
    {
        if (!createdDate.HasValue)
        {
            return RedirectToAction("Index", "Statistic");
        }

        ViewBag.CreatedDate = createdDate;
        ViewBag.IsVideo = isVideoDetails;
        ViewBag.Title = isVideoDetails ? ViewResources.VideoDetails : ViewResources.ArticleDetails;

        return View();
    }

    [HttpPost]
    public async Task<IActionResult> GetViewDetails(ViewDetailsQueryViewModel query)
    {
        var (viewDetails, totalItems, totalViews) = await statisticService.GetPostViewDetails(
            query.CreatedDate.Value,
            query.IsVideo,
            query.PageIndex,
            query.PageSize,
            query.ViewSort,
            query.AuthorSort);

        var viewModel = new ViewDetailsViewModel
        {
            ViewDetails = viewDetails,
            CreatedDate = query.CreatedDate.Value,
            Type = query.IsVideo ? ViewResources.Videos : ViewResources.Articles,
            Quantity = totalItems,
            ViewSort = query.ViewSort,
            AuthorSort = query.AuthorSort,
            Tooltip = query.IsVideo ? ViewResources.VideoTooltipContent : ViewResources.ArticleTooltipContent,
            IsVideo = query.IsVideo,
            TotalView = totalViews,
            Paging = new PagingModel
            {
                CurrentPage = query.PageIndex,
                PageSize = query.PageSize,
                TotalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize)
            }
        };

        return PartialView("_ViewDetailsGrid", viewModel);
    }
}