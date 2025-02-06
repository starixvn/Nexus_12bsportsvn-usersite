namespace SabaNews.Site.Controllers.Event;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Event.WorldCup;
using SabaNews.Criteria.Posts;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel;
using SabaNews.Models.ViewModel.Event.WorldCup;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Livescore.Services.Interfaces;

public class WorldCup2022Controller(
    IPostService postService,
    IDataControlService dataControlService,
    ILeagueService leagueService,
    IConfiguration configuration,
    ISessionService sessionService,
    IUserService userService,
    IWorldCupService worldcupService)
    : Controller
{
    private const long LeagueIdWC = WorldCup2022.LeagueIdWorldCup2022;
    private const long SeasonIdWC = WorldCup2022.SeasonIdWorldCup2022;
    private const string CategorySlugWC = WorldCup2022.HomepageSlug;
    private const string WorldCupController = "WorldCup2022";

    [Route("world-cup-2022")]
    public async Task<IActionResult> Index()
    {
        var model = await dataControlService.GetWorldCupPageViewModel();

        var header = new HeaderViewModel
        {
            HeadTitle = model.Category.Title,
            Title = WorldCup2022.TitleHomepage,
            Description = model.Category.Description,
            Slug = WorldCup2022.HomepageSlug
        };
        model.Header = header;
        model.OverviewPageUrl = $"/{WorldCup2022.HomepageSlug}/{WorldCup2022.OverviewRoute}";
        return View("~/Views/Event/WorldCup2022/Index.cshtml", model);
    }

    [Route("world-cup-2022/{slug}")]
    public async Task<IActionResult> PostDetailWC(string slug)
    {
        var postWC = await postService.GetPostDetailBySlugAsync(slug, Constants.postType);
        if (postWC == null)
        {
            return View(Constants.EmptyBlogView);
        }
        var cateInfoWC = GetCateInfoWC(postWC.CatesName, postWC.CategoriesSlug);
        if (cateInfoWC.Slug == WorldCup2022.CommentarySlug)
        {
            Response.Redirect("nhan-dinh/" + slug);
        }

        var viewModel = await GetViewModelPostDetail(postWC, cateInfoWC, slug);

        return View("~/Views/Event/WorldCup2022/PostDetail.cshtml", viewModel);
    }

    [Route("world-cup-2022/nhan-dinh/{slug}")]
    public async Task<IActionResult> CommentaryDetail(string slug)
    {
        var postCommentary = await postService.GetPostDetailBySlugAsync(slug, Constants.postType);
        if (postCommentary == null)
        {
            return View(Constants.EmptyBlogView);
        }
        var cateInfoCommentary = GetCateInfoWC(postCommentary.CatesName, postCommentary.CategoriesSlug);

        var viewModel = await GetViewModelPostDetail(postCommentary, cateInfoCommentary, slug);

        return View("~/Views/Event/WorldCup2022/PostDetail.cshtml", viewModel);
    }

    [HttpPost]
    [Route("world-cup-2022/related-posts")]
    public IActionResult GetRelatedPostsWC(string cateSlug, int postID)
    {
        return ViewComponent("RelatedPostsWC", new { cateSlug, postID });
    }

    [HttpPost]
    [Route("world-cup-2022/sidebar-posts")]
    public IActionResult GetSidebarPostsWC(string cateSlug, int postID)
    {
        return ViewComponent("SidebarWC", new { cateSlug, postID });
    }

    [Route("world-cup-2022/tin-moi-nhat")]
    public async Task<IActionResult> LastestNews()
    {
        var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = CategorySlugWC, _Start = 0, _End = Constants.GetTenItems };
        var news = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);

        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleLastestNews,
            Description = WorldCup2022.TitleLastestNews,
            Slug = WorldCup2022.UrlLastestNewsSlug
        };

        var viewModel = new LastestNewsViewModel
        {
            Header = header,
            Posts = news,
            CategorySlug = CategorySlugWC,
            Paging = new PagingModel
            {
                PageSize = Constants.GetTenItems,
                CurrentPage = Constants.FirstPage,
                TotalPages = (int)Math.Ceiling(cateSlugCriteria.TotalItems / (double)Constants.GetTenItems)
            }
        };
        return View("~/Views/Event/WorldCup2022/LastestNewsWC.cshtml", viewModel);
    }

    [Route("world-cup-2022/nhan-dinh")]
    public async Task<IActionResult> CommentaryNews()
    {
        var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = WorldCup2022.CommentarySlug, _Start = 0, _End = Constants.GetTenItems };
        var news = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);

        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleCommentary,
            Description = WorldCup2022.TitleCommentary,
            Slug = WorldCup2022.UrlCommentarySlug
        };

        var viewModel = new LastestNewsViewModel
        {
            Header = header,
            Posts = news,
            CategorySlug = WorldCup2022.CommentarySlug,
            Paging = new PagingModel
            {
                PageSize = Constants.GetTenItems,
                CurrentPage = Constants.FirstPage,
                TotalPages = (int)Math.Ceiling(cateSlugCriteria.TotalItems / (double)Constants.GetTenItems)
            }
        };
        return View("~/Views/Event/WorldCup2022/LastestNewsWC.cshtml", viewModel);
    }

    [Route("world-cup-2022/lich-thi-dau")]
    public IActionResult Fixture()
    {
        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleFixture,
            Description = WorldCup2022.TitleFixture,
            Slug = WorldCup2022.UrlFixtureSlug
        };
        return View("~/Views/Event/WorldCup2022/Fixture.cshtml", header);
    }

    [Route("world-cup-2022/bang-xep-hang")]
    public async Task<IActionResult> Standing()
    {
        var standingsCriteria = new GetLeagueSeasonStandingCriteria { LeagueId = LeagueIdWC, SeasonId = SeasonIdWC };
        var standings = await leagueService.GetLeagueSeasonStanding(standingsCriteria);
        var league = await leagueService.GetLeagueByIdAsync(WorldCup2022.LeagueIdWorldCup2022);
        var isKnockout = league.CurrentStageId > WorldCup2022.GroupStageId;
        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleStanding,
            Description = WorldCup2022.TitleStanding,
            Slug = WorldCup2022.UrlStandingSlug
        };
        var viewModel = new StandingDetailViewModel
        {
            Header = header,
            StandingsViewModel = GroupStandingsByGroupName(standings),
            IsKnockoutStage = isKnockout
        };
        return View("~/Views/Event/WorldCup2022/DetailStanding.cshtml", viewModel);
    }

    [Route("world-cup-2022/video")]
    public async Task<IActionResult> Video()
    {
        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleVideo,
            Description = WorldCup2022.TitleVideo,
            Slug = WorldCup2022.UrlVideoSlug
        };
        var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = WorldCup2022.VideoSlug, _Start = 0, _End = Constants.GetTwelveItems + 1 };
        var videos = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);
        var viewModel = new VideoViewModel
        {
            Header = header,
            Videos = videos,
            Paging = new PagingModel
            {
                PageSize = Constants.GetTwelveItems,
                CurrentPage = Constants.FirstPage,
                TotalPages = (int)Math.Ceiling((cateSlugCriteria.TotalItems - 1) / (double)Constants.GetTwelveItems)
            }
        };
        return View("~/Views/Event/WorldCup2022/Video.cshtml", viewModel);
    }

    [Route("lich-thi-dau/world-cup-2022/{match}/{matchId:long}")]
    public IActionResult MatchDetail(long matchId)
    {
        var model = new MatchDetailViewModel
        {
            Header = new HeaderViewModel
            {
                Title = WorldCup2022.TitleFixture,
                Description = WorldCup2022.TitleFixture,
                Slug = WorldCup2022.FixtureSlug
            },
            MatchId = matchId
        };
        return View("~/Views/Event/WorldCup2022/MatchDetail.cshtml", model);
    }

    [Route("world-cup-2022/khoanh-khac")]
    public async Task<IActionResult> StoryPost()
    {
        const int pageSize = Constants.GetTwelveItems;
        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleStoryPost,
            Description = WorldCup2022.TitleStoryPost,
            Slug = WorldCup2022.StoryPostSlug
        };
        var cateSlugCriteria = new GetPostsByCateSlugCriteria
        {
            _CategorySlug = WorldCup2022.StoryPostSlug,
            _Start = 0,
            _End = pageSize,
            PostType = Constants.storyPostType
        };
        var stories = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);
        var model = new LastestNewsViewModel
        {
            Header = header,
            Posts = stories,
            Paging = new PagingModel
            {
                PageSize = pageSize,
                CurrentPage = Constants.FirstPage,
                TotalPages = (int)Math.Ceiling(cateSlugCriteria.TotalItems / (double)pageSize)
            }
        };

        return View("~/Views/Event/WorldCup2022/StoryPost.cshtml", model);
    }

    [Route("world-cup-2022/khoanh-khac/{slug}")]
    public async Task<IActionResult> StoryPostDetail(string slug)
    {
        var post = await postService.GetPostDetailBySlugAsync(slug, Constants.storyPostType);
        if (post == null)
        {
            return View(Constants.EmptyBlogView);
        }
        var stories = PostHelper.GetListImageFromPostContent(post.PostContent);
        var baseUrl = configuration.GetValue<string>(Constants.BaseUrl);
        var model = new StoryPostDetailViewModel
        {
            Post = post,
            Stories = stories,
            Slug = slug,
            BaseUrl = baseUrl,
            BackUrl = Url.Action("StoryPost", WorldCupController, null, Request.Scheme)
        };
        return PartialView("~/Views/Event/WorldCup2022/StoryPostDetail.cshtml", model);
    }

    [Route("world-cup-2022/tong-quan")]
    public async Task<IActionResult> Overview()
    {
        var post = await postService.GetPostDetailBySlugAsync(WorldCup2022.OverviewPageSlug, Constants.postType);
        if (post == null)
        {
            return View(Constants.EmptyBlogView);
        }
        SavePost savePostWC = null;
        var isUserLogin = sessionService.User != null;
        if (isUserLogin)
        {
            var user = await userService.GetUserByIdAsync(sessionService.User.Id);
            savePostWC = user.HandleSavePosts.Find(val => val.PostID == post.ID);
        }
        var domain = configuration.GetValue<string>(Constants.BaseUrl);
        var viewModel = new SingleViewModel
        {
            SinglePost = post,
            IsLogin = isUserLogin,
            SavePost = savePostWC,
            AbsoluteUrl = $"{domain}{WorldCup2022.OverviewRoute}",
            IsVideo = false,
            CateInfo = new CateInfo
            {
                Name = WorldCup2022.Homepage,
                Url = $"/{WorldCup2022.HomepageSlug}",
                Slug = WorldCup2022.HomepageSlug
            }
        };
        return View("~/Views/Event/WorldCup2022/PostDetail.cshtml", viewModel);
    }

    [Route("world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung")]
    public async Task<ActionResult> Minigame()
    {
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var matches = await worldcupService.GetMatchWCBySeasonAsync(criteriaMatch);
        var statusStageOne = WorldCupHelper.GetStatusStage(matches, 1);
        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleMinigame,
            Description = WorldCup2022.TitleMinigame,
            Slug = WorldCup2022.UrlMinigameSlug
        };

        var isLogin = sessionService.User != null;
        var model = new MinigameViewModel
        {
            Header = header,
            Matches = matches,
            UserId = string.Empty,
            IsLogin = isLogin,
            IsAdmin = isLogin && sessionService.User.Metadata.Contains(Role.Administrator),
            BaseUrl = configuration.GetValue<string>(Constants.BaseUrl)
        };

        if (sessionService.User != null)
        {
            model.User = sessionService.User;
            model.UserId = sessionService.User.Id.ToString();
            model.Votes = await worldcupService.GetMinigameByUserAsync(sessionService.User.Id);
        }
        if (statusStageOne == WorldCup2022.BeforeStartedStage || statusStageOne == WorldCup2022.LockStage)
        {
            return View("~/Views/Event/WorldCup2022/Minigame/Minigame.cshtml", model);
        }
        return View("~/Views/Event/WorldCup2022/Minigame/MinigameTmp.cshtml", model);
    }

    [Route("world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung/giai-doan/{stage}")]
    public async Task<IActionResult> MinigameStage(byte stage)
    {
        if (sessionService.User == null 
            || stage < WorldCup2022.MinigameStage1 
            || stage > WorldCup2022.MinigameStage4 
            || !WorldCupHelper.CheckStartStage(stage)
           )
        {
            return Redirect(Url.Action("Minigame", WorldCupController));
        }
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var matches = await worldcupService.GetMatchWCBySeasonAsync(criteriaMatch);
        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleMinigame,
            Description = WorldCup2022.TitleMinigame,
            Slug = WorldCup2022.UrlMinigameSlug
        };
        var model = new MinigameStageViewModel
        {
            Header = header,
            Matches = matches,
            Stage = stage,
            IsLogin = sessionService.User != null
        };
        return View("~/Views/Event/WorldCup2022/Minigame/Stage.cshtml", model);
    }

    [Route("world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung/chi-tiet")]
    public async Task<IActionResult> MinigameProfile()
    {
        if (sessionService.User == null)
        {
            return Redirect(Url.Action("Minigame", WorldCupController));
        }
        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleMinigame,
            Description = WorldCup2022.TitleMinigame,
            Slug = WorldCup2022.UrlMinigameSlug
        };
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var matches = await worldcupService.GetMatchWCBySeasonAsync(criteriaMatch);
        var model = new MinigameStageViewModel
        {
            Header = header,
            Matches = matches,
            User = sessionService.User,
            IsLogin = sessionService.User != null
        };
        return View("~/Views/Event/WorldCup2022/Minigame/Profile.cshtml", model);
    }

    [Route("world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung/chi-tiet/giai-doan/{stage}")]
    public async Task<IActionResult> MinigameProfileStage(byte stage)
    {
        if (sessionService.User == null)
        {
            return Redirect(Url.Action("Minigame", WorldCupController));
        }
        if (stage < WorldCup2022.MinigameStage1 
            || stage > WorldCup2022.MinigameStage4 
            || !WorldCupHelper.CheckStartStage(stage)
           )
        {
            return Redirect(Url.Action("MinigameProfile", WorldCupController));
        }
        var header = new HeaderViewModel
        {
            Title = WorldCup2022.TitleMinigame,
            Description = WorldCup2022.TitleMinigame,
            Slug = WorldCup2022.UrlMinigameSlug
        };
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var matches = await worldcupService.GetMatchWCBySeasonAsync(criteriaMatch);
        var model = new MinigameStageViewModel
        {
            Header = header,
            Stage = stage,
            Matches = matches,
            User = sessionService.User,
            IsLogin = sessionService.User != null
        };
        return View("~/Views/Event/WorldCup2022/Minigame/ProfileStage.cshtml", model);
    }
    [HttpPost]
    public async Task<ActionResult> GetMinigameByUserStage([FromBody] GetMinigameByUserStageCriteria criteria)
    {
        if (sessionService.User == null)
        {
            return Json(null);
        }
        criteria.UserId = sessionService.User.Id;
        var votes = await worldcupService.GetMinigameByUserStageAsync(criteria);
        return Json(votes);
    }

    [HttpPost]
    public async Task<ActionResult> GetMinigameByUser()
    {
        if (sessionService.User == null)
        {
            return Json(null);
        }
        var votes = await worldcupService.GetMinigameByUserAsync(sessionService.User.Id);
        return Json(votes);
    }

    [HttpPost]
    public async Task<ActionResult> UpdateMinigameVote([FromBody] UpdateMinigameVoteCommand cmd)
    {

        if (sessionService.User == null)
        {
            return Json(null);
        }
        cmd.UserId = sessionService.User.Id;
        var result = await worldcupService.UpdateMinigameVoteAsync(cmd);
        return Json(result);
    }

    [HttpPost]
    public async Task<ActionResult> GetMinigameVoteMatch([FromBody] GetMinigameVoteMatchCriteria criteria)
    {
        var match = await worldcupService.GetMinigameVoteMatchAsync(criteria);
        return Json(match);
    }

    [HttpPost]
    public async Task<ActionResult> GetMinigameData([FromBody] GetMinigameUsersByStageCriteria criteria)
    {
        var miniGames = await worldcupService.GetMinigameUsersAsync(criteria);
        return Json(miniGames);
    }

    [HttpPost]
    public async Task<IActionResult> GetStoryPostGrid(CategoryPostParams param)
    {
        var start = (param.Page - 1) * param.PageSize;
        var cateSlugCriteria = new GetPostsByCateSlugCriteria
        {
            _CategorySlug = param.Slug,
            _Start = start,
            _End = param.PageSize,
            PostType = Constants.storyPostType
        };
        var posts = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);
        if (!posts.Any())
        {
            return Ok(false);
        }
        return PartialView("~/Views/Event/WorldCup2022/_StoryPost.cshtml", posts);
    }

    public async Task<IActionResult> GetNewsGrid(CategoryPostParams param)
    {
        var pageSize = param.PageSize;
        if (!param.IsVideo)
        {
            var start = (param.Page - 1) * pageSize;
            var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = param.Slug, _Start = start, _End = pageSize };
            var posts = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);
            return PartialView("~/Views/Event/WorldCup2022/_NewsGridView.cshtml", posts);
        }
        else
        {
            var outstandingCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = WorldCup2022.VideoSlug, _Start = (param.Page - 1) * pageSize, _End = 1 };
            var videosOutstanding = await postService.GetPostsByCateSlugAsync(outstandingCriteria);
            var start = (param.Page - 1) * pageSize;
            var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = param.Slug, _Start = start, _End = pageSize + 1 };
            var videos = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);
            videos = videos.Where(x => x.ID != videosOutstanding.First().ID).ToList();
            if (videos.Count() > pageSize)
            {
                var idlast = videos.Last().ID;
                videos = videos.Where(x => x.ID != idlast).ToList();
            }
            return PartialView("~/Views/Event/WorldCup2022/_VideoGridView.cshtml", videos);
        }
    }

    public async Task<IActionResult> GetStandings()
    {
        var standingsCriteria = new GetLeagueSeasonStandingCriteria { LeagueId = LeagueIdWC, SeasonId = SeasonIdWC };
        var standings = await leagueService.GetLeagueSeasonStanding(standingsCriteria);
        ViewBag.Total = GroupStandingsByGroupName(standings).Count;
        return PartialView("~/Views/Event/WorldCup2022/_Standing.cshtml", GroupStandingsByGroupName(standings));
    }

    [HttpPost]
    public async Task<IActionResult> GetTopScorers(bool more)
    {
        var topScorersCriteria = new GetTop10ScorersCriteria { LeagueId = LeagueIdWC, SeasonId = SeasonIdWC };
        var topScorers = await leagueService.GetTop10ScorersAsync(topScorersCriteria);
        ViewBag.More = more;
        return PartialView("~/Views/Event/WorldCup2022/_TopScorers.cshtml", topScorers);
    }

    [HttpPost]
    public async Task<IActionResult> GetHomepageStandings([FromBody] GetLeagueSeasonStandingCriteria criteria)
    {
        var standings = await leagueService.GetLeagueSeasonStanding(criteria);

        var groups = GroupStandingsByGroupName(standings);
        return PartialView("~/Views/Event/WorldCup2022/_HomepageStanding.cshtml", groups);
    }

    [HttpPost]
    public async Task<IActionResult> GetWorldCupMatch()
    {
        var (league, matches) = await dataControlService.GetHomepageWCFixtureData();
        return Json(new { league, matches });
    }


    public List<StandingViewModel> GroupStandingsByGroupName(IList<SeasonStandings> seasonStandings)
    {
        var groupNames = GetGroupNames(seasonStandings);
        var standingsViewModels = new List<StandingViewModel>();

        for (var i = 0; i < groupNames.Count; i++)
        {
            standingsViewModels.Add(new StandingViewModel
            {
                GroupName = groupNames[i],
                Standings = seasonStandings.Where(x => x.GroupName == groupNames[i]).ToList()
            });
        }
        return standingsViewModels;
    }

    public List<string> GetGroupNames(IList<SeasonStandings> seasonStandings)
    {
        var groupNames = new List<string>();
        foreach (var item in seasonStandings.Where(standing => !groupNames.Exists(x => x == standing.GroupName)))
        {
            groupNames.Add(item.GroupName);
        }
        return groupNames;
    }

    private static CateInfo GetCateInfoWC(string cateName, string cateSlugWC)
    {
        var slugWC = cateSlugWC;
        var cateNameWC = cateName;
        var cateEventWC = GetEventWCInfo(cateSlugWC);
        if (cateEventWC != null)
        {
            return cateEventWC;
        }
        if (cateSlugWC.Contains(Constants.CollectionSlug) || (cateSlugWC.Contains(Constants.BasketballSlug)
                                                              && !cateSlugWC.Contains(Constants.BasketballVideoSlug)) || cateSlugWC.Contains(Constants.TennisSlug))
        {
            return new CateInfo { Slug = Constants.OtherPostSlug, Name = Constants.OtherPosts };
        }

        var listCateSlugWC = cateSlugWC.Split(',');
        var listCateNameWC = cateName.Split(',');
        var subCateSlugWC = listCateSlugWC.Where(item => item.Trim() != Constants.FootballSlug && item.Trim() != Constants.VideoSlug).ToList();
        var subCateNameWC = listCateNameWC.Where(item => item.Trim() != Constants.Football && item.Trim() != Constants.Video).ToList();
        slugWC = subCateSlugWC.Count > 0 ? subCateSlugWC[0] : listCateSlugWC[0];
        cateNameWC = subCateNameWC.Count > 0 ? subCateNameWC[0] : listCateNameWC[0];
        return new CateInfo { Slug = slugWC.Trim(), Name = cateNameWC.Trim() };
    }

    private async Task<SingleViewModel> GetViewModelPostDetail(Post postWC, CateInfo cateInfoWC, string slug)
    {
        SavePost savePostWC = null;
        var isUserLogin = sessionService.User != null;
        if (isUserLogin)
        {
            var user = await userService.GetUserByIdAsync(sessionService.User.Id);
            savePostWC = user.HandleSavePosts.Find(val => val.PostID == postWC.ID);
        }
        var cateParentsWC = await postService.GetCateParentsAsync(cateInfoWC.Slug);
        cateInfoWC.Url ??= PostHelper.GetCategoryLink(cateParentsWC);
        var domain = configuration.GetValue<string>(Constants.BaseUrl);
        var viewModel = new SingleViewModel
        {
            SinglePost = postWC,
            IsLogin = isUserLogin,
            SavePost = savePostWC,
            AbsoluteUrl = $"{domain}world-cup-2022/{slug}",
            IsVideo = PostHelper.IsVideo(cateParentsWC),
            CateInfo = cateInfoWC
        };
        return viewModel;
    }

    private static CateInfo GetEventWCInfo(string cateSlugWC)
    {
        var cateEventWC = PostHelper.GetEventCates();
        var listCateSlugWC = cateSlugWC.Split(',');
        foreach (var slug in listCateSlugWC)
        {
            var cate = cateEventWC.Find(item => item.Slug == slug.Trim());
            if (cate != null)
            {
                return cate;
            }
        }
        return null;
    }
}