namespace SabaNews.Site.Controllers.Event;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Criteria.Minigame;
using Livescore.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SabaNews.Core.Constants;
using SabaNews.Core.Constants.Livescore;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Poll;
using SabaNews.Criteria.Posts;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel;
using SabaNews.Models.ViewModel.Event.Euro2024;
using SabaNews.Models.ViewModel.Event.WorldCup;
using SabaNews.Models.ViewModel.Poll;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Extensions;

public class Euro2024Controller(
    IDataControlService dataControlService,
    IPostService postService,
    ISessionService sessionService,
    IConfiguration configuration,
    IPollService pollService,
    ILeagueService leagueService,
    IOptionService optionService,
    IEuro2024Service euro2024Service)
    : Controller
{
    private const string EuroController = "Euro2024";
    private const string CategorySlugEuro = Euro2024.HomepageSlug;

    [Route("/euro-2024")]
    public async Task<IActionResult> Index()
    {
        var model = await dataControlService.GetEuro2024PageViewModel();
        var header = new HeaderViewModel
        {
            HeadTitle = Euro2024.HomepageTitle,
            Title = Euro2024.HomepageTitle,
            Description = Euro2024.HomepageDescription,
            Slug = Euro2024.HomepageSlug
        };
        model.Header = header;
        model.Domain = configuration.GetValue<string>(Constants.BaseUrl) + Euro2024.HomepageSlug + "/";
        return View("~/Views/Event/Euro2024/Index.cshtml", model);
    }

    [Route("euro-2024/tin-moi-nhat")]
    public async Task<IActionResult> LastestNews()
    {
        var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = Euro2024.HomepageSlug, _Start = Constants.FromFirstItem, _End = Constants.GetTenItems };
        var news = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);

        var header = new HeaderViewModel
        {
            HeadTitle = Euro2024.LastestNews,
            Title = Euro2024.LastestNewsTitle,
            Description = Euro2024.LastestNewsDescription,
            Slug = Euro2024.UrlLastestNewsSlug
        };

        var viewModel = new LastestNewsViewModel
        {
            Header = header,
            Posts = news,
            CategorySlug = CategorySlugEuro,
            Paging = new PagingModel
            {
                PageSize = Constants.GetTenItems,
                CurrentPage = Constants.FirstPage,
                TotalPages = (int)Math.Ceiling(cateSlugCriteria.TotalItems / (double)Constants.GetTenItems)
            }
        };
        return View("~/Views/Event/Euro2024/LastestNews.cshtml", viewModel);
    }

    [Route("euro-2024/nhan-dinh")]
    public async Task<IActionResult> CommentaryNews()
    {
        var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = Euro2024.CommentarySlug, _Start = 0, _End = Constants.GetTenItems };
        var news = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);

        var header = new HeaderViewModel
        {
            HeadTitle = Euro2024.Commentary,
            Title = Euro2024.CommentaryTitle,
            Description = Euro2024.CommentaryDescription,
            Slug = Euro2024.UrlCommentarySlug
        };

        var viewModel = new LastestNewsViewModel
        {
            Header = header,
            Posts = news,
            CategorySlug = Euro2024.CommentarySlug,
            Paging = new PagingModel
            {
                PageSize = Constants.GetTenItems,
                CurrentPage = Constants.FirstPage,
                TotalPages = (int)Math.Ceiling(cateSlugCriteria.TotalItems / (double)Constants.GetTenItems)
            }
        };
        return View("~/Views/Event/Euro2024/LastestNews.cshtml", viewModel);
    }

    [Route("euro-2024/video")]
    public async Task<IActionResult> Video()
    {
        var pageSize = Constants.GetTwelveItems;
        var header = new HeaderViewModel
        {
            Title = Euro2024.VideoTitle,
            Description = Euro2024.VideoDescription,
            Slug = Euro2024.UrlVideoSlug
        };
        var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = Euro2024.VideoSlug, _Start = 0, _End = pageSize + 1 };
        var videos = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);
        var viewModel = new VideoViewModel
        {
            Header = header,
            Videos = videos,
            Paging = new PagingModel
            {
                PageSize = pageSize,
                CurrentPage = Constants.FirstPage,
                TotalPages = (int)Math.Ceiling((cateSlugCriteria.TotalItems - 1) / (double)Constants.GetTwelveItems)
            }
        };
        return View("~/Views/Event/Euro2024/Video.cshtml", viewModel);
    }


    [Route("euro-2024/bang-xep-hang")]
    public async Task<IActionResult> Standing()
    {
        var standingsCriteria = new GetLeagueSeasonStandingCriteria { LeagueId = Euro2024.LeagueId, SeasonId = Euro2024.SeasonId };
        var standings = await leagueService.GetLeagueSeasonStanding(standingsCriteria);
        var league = await leagueService.GetLeagueByIdAsync(Euro2024.LeagueId);
        var isKnockout = league.CurrentStageId > Euro2024.GroupStageId;
        var header = new HeaderViewModel
        {
            Title = Euro2024.StandingTitle,
            Description = Euro2024.StandingDescription,
            Slug = Euro2024.UrlStandingSlug
        };
        var viewModel = new StandingDetailViewModel
        {
            Header = header,
            StandingsViewModel = GroupStandingsByGroup(standings.Where(standing => standing.StageId == Euro2024.GroupStageId).ToList()),
            IsKnockoutStage = isKnockout
        };
        return View("~/Views/Event/Euro2024/DetailStanding.cshtml", viewModel);
    }

    [Route("euro-2024/lich-thi-dau")]
    public IActionResult Fixture()
    {
        var header = new HeaderViewModel
        {
            Title = Euro2024.FixtureTitle,
            Description = Euro2024.FixtureDescription,
            Slug = Euro2024.UrlFixtureSlug
        };
        return View("~/Views/Event/Euro2024/Fixture.cshtml", header);
    }


    [Route("/euro-2024/{slug}")]
    public async Task<IActionResult> Article(string slug)
    {
        if (!slug.Contains(".html"))
        {
            return View(Constants.EmptyBlogView);
        }

        (slug, var postId) = GetPostInfoFromSlug(slug);

        var post = await postService.GetPostDetailAsync(postId);
        if (post == null)
        {
            return View(Constants.EmptyBlogView);
        }
        if (post.Slug != slug)
        {
            return RedirectToActionPermanent("Article", "Euro2024", new { slug = post.Uri });
        }

        var cateInfo = GetEventCateInfo(post.CategoriesSlug);

        var viewModel = await GetViewModelPostDetail(post, cateInfo);

        return View("~/Views/Event/Euro2024/Article.cshtml", viewModel);
    }

    private static (string, int) GetPostInfoFromSlug(string slug)
    {
        slug = slug.Replace(".html", "");
        var arrSlug = slug.Split("-");
        if (!int.TryParse(arrSlug[^1], out var postId))
        {
            return (slug, postId);
        }
        slug = slug.Replace("-" + postId, "");
        return (slug, postId);
    }

    [Route("euro-2024/{match}/{matchId:long}")]
    public ActionResult MatchDetail(long matchId)
    {
        var model = new MatchDetailViewModel
        {
            Header = new HeaderViewModel
            {
                Title = Euro2024.TeamTitle,
                Description = Euro2024.TeamDescription,
                Slug = Euro2024.FixtureSlug
            },
            MatchId = matchId
        };
        return View("~/Views/Event/Euro2024/MatchDetail.cshtml", model);
    }

    [Route("euro-2024/doi-tuyen")]
    public async Task<IActionResult> Team()
    {
        var teams = await euro2024Service.GetTeamByStage(Euro2024.SeasonId, Euro2024.GroupStageId);
        var model = new TeamViewModel
        {
            Header = new HeaderViewModel
            {
                Title = Euro2024.TeamTitle,
                Description = Euro2024.TeamDescription,
                Slug = Euro2024.TeamSlug
            },
            Teams = teams
        };
        return View("~/Views/Event/Euro2024/Team.cshtml", model);
    }

    [Route("euro-2024/doi-tuyen/{teamName}/{teamId}")]
    public ActionResult TeamDetail(long teamId)
    {
        var model = new TeamDetailViewModel
        {
            TeamId = teamId,
            Header = new HeaderViewModel
            {
                Title = Euro2024.TeamTitle,
                Description = Euro2024.TeamDescription,
                Slug = Euro2024.TeamSlug
            }
        };
        return View("~/Views/Event/Euro2024/TeamDetail.cshtml", model);
    }

    [HttpPost]
    public async Task<IActionResult> GetTeamDetailData([FromBody] GetTeamDataModel model)
    {
        if (model == null)
        {
            return Json(null);
        }
        var teamProfile = Euro2024.TeamProfiles.FirstOrDefault(t => t.Id == model.TeamId);
        if (teamProfile == null)
        {
            return Json(null);
        }
        var profile = await postService.GetPostDetailBySlugAsync(teamProfile.Name, Constants.postType);
        var players = await euro2024Service.GetTeamPlayerById(model.TeamId);
        var matches = await euro2024Service.GetMatchByTeamSeasonAsync(new GetMatchByTeamSeasonCriteria { TeamId = model.TeamId, LeagueId = Euro2024.LeagueId, SeasonId = Euro2024.SeasonId });
        matches = matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();
        return Json(new { matches, players, profile });
    }

    [HttpPost]
    [Route("euro2024/related-posts")]
    public async Task<IActionResult> GetRelatedPosts(string cateSlug, int postID)
    {
        var criteria = new GetPostsByCateSlugCriteria
        {
            _CategorySlug = cateSlug,
            _Start = Constants.FromFirstItem,
            _End = Constants.GetElevenItems
        };
        var posts = await postService.GetPostsByCateSlugAsync(criteria);
        return PartialView("~/Views/Event/Euro2024/_RelatedPosts.cshtml", posts);
    }

    [HttpPost]
    [Route("euro2024/most-view-posts")]
    public async Task<IActionResult> GetMostViewPost(string cateSlug, int postID)
    {
        var postParam = new PostParam
        {
            Slug = cateSlug,
            Start = Constants.FromFirstItem,
            End = Constants.GetFourItems,
            PostID = postID
        };
        var posts = await postService.GetTopPostsByCateSlugAsync(postParam);
        return PartialView("~/Views/Event/Euro2024/_MostViewPosts.cshtml", posts);
    }


    [HttpPost]
    public async Task<IActionResult> GetHomepageStandings()
    {
        var standings = await dataControlService.GetLeagueSeasonStandingAsync(Euro2024.LeagueId, Euro2024.SeasonId);
        var groupsStageStanding = standings.Where(standing => standing.StageId == Euro2024.GroupStageId).ToList();
        var groups = GroupStandingsByGroup(groupsStageStanding);
        return PartialView("~/Views/Event/Euro2024/_HomepageStanding.cshtml", groups);
    }


    public List<StandingViewModel> GroupStandingsByGroup(IList<SeasonStandings> seasonStandings)
    {
        var groupNames = GetGroups(seasonStandings);
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

    public List<string> GetGroups(IList<SeasonStandings> seasonStandings)
    {
        var groupNames = new List<string>();
        foreach (var item in seasonStandings.Where(standing => !groupNames.Exists(x => x == standing.GroupName)))
        {
            groupNames.Add(item.GroupName);
        }
        return groupNames;
    }

    private async Task<SingleViewModel> GetViewModelPostDetail(Post post, CateInfo cateInfo)
    {
        SavePost savePost = null;
        var isUserLogin = sessionService.User != null;
        if (isUserLogin)
        {
            savePost = sessionService.User.HandleSavePosts?.Find(val => val.PostID == post.ID);
        }
        var cateParents = await postService.GetCateParentsAsync(cateInfo.Slug);
        var domain = configuration.GetValue<string>(Constants.BaseUrl);
        var (matchId, customContent) = PostHelper.GetInfoFromContent(post.PostContent);
        post.PostContent = customContent;
        var viewModel = new SingleViewModel
        {
            SinglePost = post,
            IsLogin = isUserLogin,
            SavePost = savePost,
            AbsoluteUrl = $"{domain}euro-2024/{post.Uri}",
            IsVideo = PostHelper.IsVideo(cateParents),
            CateInfo = cateInfo,
            MatchId = matchId
        };
        return viewModel;
    }

    private static CateInfo GetEventCateInfo(string cateSlugs)
    {
        var cateEvent = Euro2024.CateSlugs;
        var foundCate = cateEvent.FirstOrDefault(cate => cateSlugs.Split(", ").Contains(cate.Slug));
        return foundCate ?? Euro2024.CateSlugs.ElementAtOrDefault(1);
    }

    public async Task<IActionResult> GetNewsGrid(CategoryPostParams param)
    {
        var pageSize = param.PageSize;
        ViewBag.CurrentPage = param.Page;
        if (!param.IsVideo)
        {
            var start = (param.Page - 1) * pageSize;
            var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = param.Slug, _Start = start, _End = pageSize };
            var posts = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);

            return PartialView("~/Views/Event/Euro2024/_NewsGridView.cshtml", posts);
        }
        else
        {
            var start = (param.Page - 1) * pageSize + (param.Page == 2 ? Constants.GetFirstItem : 0);
            var cateSlugCriteria = new GetPostsByCateSlugCriteria { _CategorySlug = param.Slug, _Start = start, _End = pageSize };
            var videos = await postService.GetPostsByCateSlugAsync(cateSlugCriteria);
            return PartialView("~/Views/Event/Euro2024/_VideoGridView.cshtml", videos);
        }
    }

    [HttpPost]
    public async Task<IActionResult> GetFixture()
    {
        var data = await dataControlService.GetMatchBySeasonAsync(Euro2024.LeagueId, Euro2024.SeasonId);
        var matches = data.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();
        return Json(new { league = data.League, matches });
    }

    [HttpPost]
    public async Task<IActionResult> GetTopScorers()
    {
        var topScorersCriteria = new GetTop10ScorersCriteria { LeagueId = Euro2024.LeagueId, SeasonId = Euro2024.SeasonId };
        var topScorers = await leagueService.GetTop10ScorersAsync(topScorersCriteria);
        return PartialView("~/Views/Event/Euro2024/_TopScorers.cshtml", topScorers);
    }


    [HttpPost]
    public async Task<IActionResult> GetPollData()
    {
        var pollOption = await optionService.GetOptionAsync(Euro2024.PollKey);
        if (pollOption == null)
        {
            return Json(null);
        }
        PollViewModel result;
        var clientIP = Helper.GetClientIP(HttpContext);
        var criteria = new GetPollDetailCriteria
        {
            QuestId = int.Parse(pollOption.OptionValue),
            ThemeId = Euro2024.PollTheme,
            UserIp = clientIP
        };
        result = await pollService.GetPollDetailAsync(criteria);
        if (result.Question == null)
        {
            return Json(null);
        }
        return PartialView("~/Views/Event/Euro2024/_PollEuro2024.cshtml", result);
    }

    [HttpPost]
    public async Task<IActionResult> GetArticlePollData(int questId, int themeId)
    {
        PollViewModel result;
        var clientIP = Helper.GetClientIP(HttpContext);
        var criteria = new GetPollDetailCriteria
        {
            QuestId = questId,
            ThemeId = themeId,
            UserIp = clientIP
        };
        result = await pollService.GetPollDetailAsync(criteria);
        if (result.Question == null)
        {
            return Json(null);
        }
        return PartialView("~/Views/Event/Euro2024/_PollEuro2024.cshtml", result);
    }

    [HttpPost]
    public async Task<IActionResult> VotePoll(int questId, int answerId, int themeId, bool isHome)
    {
        var clientIP = Helper.GetClientIP(HttpContext);
        var result = await pollService.VotePollAsync(questId, answerId, clientIP);
        if (result.IsSuccessful)
        {
            return isHome ? await GetPollData() : await GetArticlePollData(questId, themeId);
        }
        return Json(result);
    }

    public async Task<IActionResult> GetStandings()
    {
        var standings = await dataControlService.GetLeagueSeasonStandingAsync(Euro2024.LeagueId, Euro2024.SeasonId);
        var groupsStageStanding = standings.Where(standing => standing.StageId == Euro2024.GroupStageId).ToList();
        ViewBag.Total = GroupStandingsByGroup(standings).Count;
        return PartialView("~/Views/Event/Euro2024/_Standing.cshtml", GroupStandingsByGroup(groupsStageStanding));
    }

    private async Task<IList<Match>> GetEuroMatch()
    {
        var data = await dataControlService.GetMatchBySeasonAsync(Euro2024.LeagueId, Euro2024.SeasonId);
        return data.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();
    }


    [Route("euro-2024/minigame")]
    public async Task<IActionResult> Minigame()
    {
        var header = new HeaderViewModel
        {
            Title = Euro2024.TitleMinigame,
            Description = Euro2024.DescriptionMinigame,
            Slug = Euro2024.MinigameSlug
        };
        var isStageOneStarted = EuroHelper.CheckStartStage(1);
        if (!isStageOneStarted)
        {
            var viewModel = new EuroMinigameViewModel { Header = header };
            return View("~/Views/Event/Euro2024/Minigame/MinigameCountDown.cshtml", viewModel);
        }
        var matches = await GetEuroMatch();
        var isLogin = sessionService.User != null;
        var model = new EuroMinigameViewModel
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
            model.Votes = await euro2024Service.GetMinigameByUserAsync(sessionService.User.Id, Euro2024.LeagueId, Euro2024.SeasonId);
        }
        return View("~/Views/Event/Euro2024/Minigame/Minigame.cshtml", model);
    }

    [Route("euro-2024/minigame/giai-doan/{stage}")]
    public async Task<IActionResult> MinigameStage(byte stage)
    {
        if (sessionService.User == null
            || stage < Euro2024.MinigameStage1
            || stage > Euro2024.MinigameStage2
            || !EuroHelper.CheckStartStage(stage)
           )
        {
            return Redirect(Url.Action("Minigame", EuroController));
        }
        var matches = await GetEuroMatch();
        var header = new HeaderViewModel
        {
            Title = Euro2024.TitleMinigame,
            Description = Euro2024.DescriptionMinigame,
            Slug = Euro2024.MinigameSlug
        };
        var model = new EuroMinigameStageViewModel
        {
            Header = header,
            Matches = matches,
            Stage = stage,
            IsLogin = sessionService.User != null
        };
        return View("~/Views/Event/Euro2024/Minigame/Stage.cshtml", model);
    }

    [Route("euro-2024/minigame/du-doan-cua-toi")]
    public async Task<IActionResult> MinigameProfile()
    {
        if (sessionService.User == null)
        {
            return Redirect(Url.Action("Minigame", EuroController));
        }
        var header = new HeaderViewModel
        {
            Title = Euro2024.TitleMinigame,
            Description = Euro2024.DescriptionMinigame,
            Slug = Euro2024.MinigameSlug
        };
        var matches = await GetEuroMatch();
        var model = new EuroMinigameStageViewModel
        {
            Header = header,
            Matches = matches,
            User = sessionService.User,
            IsLogin = sessionService.User != null
        };
        return View("~/Views/Event/Euro2024/Minigame/Profile.cshtml", model);
    }

    [Route("euro-2024/minigame/du-doan-cua-toi/giai-doan/{stage}")]
    public async Task<IActionResult> MinigameProfileStage(byte stage)
    {
        if (sessionService.User == null)
        {
            return Redirect(Url.Action("Minigame", EuroController));
        }
        if (stage < Euro2024.MinigameStage1 || stage > Euro2024.MinigameStage2 || !EuroHelper.CheckStartStage(stage)
           )
        {
            return Redirect(Url.Action("MinigameProfile", EuroController));
        }
        var header = new HeaderViewModel
        {
            Title = Euro2024.TitleMinigame,
            Description = Euro2024.DescriptionMinigame,
            Slug = Euro2024.MinigameSlug
        };
        var matches = await GetEuroMatch();
        var model = new EuroMinigameStageViewModel
        {
            Header = header,
            Matches = matches,
            User = sessionService.User,
            IsLogin = sessionService.User != null,
            Stage = stage
        };
        return View("~/Views/Event/Euro2024/Minigame/ProfileStage.cshtml", model);
    }

    [HttpPost]
    public async Task<ActionResult> GetMinigameByStage([FromBody] GetLeagueMinigameByStageCriteria criteria)
    {
        if (criteria.Stage > Euro2024.MinigameStage2)
        {
            return Json(null);
        }
        var miniGames = await dataControlService.GetMinigameByStage(criteria);
        return Json(miniGames);
    }

    [HttpPost]
    public async Task<ActionResult> GetLegueMinigameByUserStage([FromBody] GetLeagueMinigameByUserStageCriteria criteria)
    {
        if (sessionService.User == null)
        {
            return Json(null);
        }
        criteria.UserId = sessionService.User.Id;
        var result = await euro2024Service.GetLeagueMinigameByUserStageAsync(criteria);
        return Json(result);
    }

    [HttpPost]
    public async Task<ActionResult> UpdateVoteMinigame([FromBody] UpdateMinigameVoteCommand criteria)
    {
        if (sessionService.User == null || criteria == null)
        {
            return Json(null);
        }
        var match = await euro2024Service.GetMinigameVoteMatchAsync(new GetMinigameVotedMatchCriteria { MatchId = criteria.MatchId });
        if (LivescoreHelper.IsLiveMatch(match.Status)
            || match.Status == MatchConstants.Finished
            || !(match.LeagueId == Euro2024.LeagueId && match.SeasonId == Euro2024.SeasonId)
            || !EuroHelper.IsVoted(match.StartTime))
        {
            return Json(new CommandResult());
        }
        criteria.UserId = sessionService.User.Id;
        var result = await euro2024Service.UpdateMinigameVoteAsync(criteria);
        return Json(result);
    }


    [HttpPost]
    public async Task<ActionResult> GetMinigameByUser([FromBody] GetMinigameUserVoteModel model)
    {
        if (sessionService.User == null)
        {
            return Json(null);
        }
        var data = await dataControlService.GetMatchBySeasonAsync(model.LeagueId, model.SeasonId);
        var matches = data.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();
        var votes = await euro2024Service.GetMinigameByUserAsync(sessionService.User.Id, model.LeagueId, model.SeasonId);
        var statusStages = EuroHelper.GetMinigameStageStatus(matches);
        return Json(new { league = data.League, matches, votes, statusStages });
    }

}