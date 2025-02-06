namespace SabaNews.Site.Controllers.SupportAPITW;

using Fanex.Caching;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Posts;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Services.Interfaces;

public class APIGetPostController : Controller
{
    private readonly LivescoreMainPageCacheConfig cacheConfigs;
    private readonly IPostService postService;
    private readonly ICacheWrapperService cacheService;

    public APIGetPostController(IPostService postService,
        IOptionsSnapshot<LivescoreMainPageCacheConfig> cacheConfigs,
        ICacheWrapperService cacheService)
    {
        this.cacheConfigs = cacheConfigs.Value;
        this.postService = postService;
        this.cacheConfigs.OutOfRangeTimeout = 1;
        this.cacheService = cacheService;
    }

    [HttpGet]
    [Route("api/post/getlist")]
    public async Task<IActionResult> GetPostList(GetDataViewModel getDataView)
    {
        var token = Request.Headers["Token"];
        IList<GetData> posts = new List<GetData>();
        var (isValid, errMess) = IsValid(token, getDataView.RowLimit);
        if(!isValid)
        {
            return Json(errMess);
        }
        if (cacheConfigs.Enabled)
        {
            var cacheKey =
                $"{CacheKey.GetPostList}{getDataView.LastTimestamp}{getDataView.Category}{getDataView.Subject}{getDataView.StartItem + " - " + getDataView.RowLimit}";
            posts = await cacheService.GetAsync<IList<GetData>>(cacheKey);
            if (posts is null)
            {
                posts = await postService.GetPostlist(getDataView);

                await cacheService.SetAsync(cacheKey, posts,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(1)
                    });
            }
        }
        else
        {
            posts = await postService.GetPostlist(getDataView);
        }
        return Json(posts);
    }

    [HttpGet]
    [Route("api/post/getdetail")]
    public async Task<IActionResult> GetDetailContent(GetDataViewModel getDataView)
    {
        var token = Request.Headers["Token"];
        var (isValid, errMess) = IsValid(token, 0);
        if(!isValid)
        {
            return Json(errMess);
        }
        var posts = await postService.GetPostDetailContent(getDataView);
        return Json(posts);
    }

    [HttpGet]
    [Route("api/post/GetDeletedPost")]
    public async Task<IActionResult> GetDeletedList(ApiDeleteListModel model)
    {
        var token = Request.Headers["Token"];
        var (isValid, errMess) = IsValid(token, 0);
        if(!isValid)
        {
            return Json(errMess);
        }
        var postIds = await postService.GetDeletedList(model);
        return Json(postIds);
    }

    private static (bool, string) IsValid(string token, int rowLimit)
    {
        var isValid = false;
        if(token == null || !token.Equals(Constants.TokenAPIGetData))
        {
            return (isValid, Constants.TokenIsValidMessage);
        }
        if(rowLimit > Constants.ApiRowLimit)
        {
            return (isValid, Constants.RowLimitMessage);
        }
        return (true, "");
    }
}