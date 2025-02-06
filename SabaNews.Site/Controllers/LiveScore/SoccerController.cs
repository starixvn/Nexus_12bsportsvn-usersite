namespace SabaNews.Site.Controllers.LiveScore;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Caching;
using Livescore.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Models.ViewModel;
using Models.ViewModel.Posts;
using Newtonsoft.Json.Linq;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Livescore.Core.Enum;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models;
using Services.Interfaces;

public class SoccerController(
    IOptionsSnapshot<LivescoreMainPageCacheConfig> cacheConfigs,
    ICacheWrapperService cacheService,
    ILeagueService leagueService,
    IMatchService matchService,
    IConfiguration configuration,
    IDataControlService dataControlService)
    : Controller
{
    private readonly LivescoreMainPageCacheConfig cacheConfigs = cacheConfigs.Value;
    private readonly string domain = configuration.GetValue<string>("BaseUrl");

    [Route("lich-thi-dau/bong-da/{eventDate?}")]
    public IActionResult Index(DateTime? eventDate)
    {
        var route = Request.Path.Value;
        if(route.EndsWith('/'))
        {
            return RedirectPermanent(route[..^1]);
        }
        string title;
        string description;
        var today = DateTimeUtilize.UtcNow().ConvertToClient();
        var selectedDate = eventDate ?? today;
        var eventDateFormat = selectedDate.ToString("dd/MM");
        if(selectedDate.Date == today.Date)
        {
            var dateFormat = today.ToString("dd/MM");
            title = "Lịch thi đấu và kết quả bóng đá hôm nay " + dateFormat;
            description = $"Xem LTĐ và KQBĐ hôm nay ngày {dateFormat} nhanh và chính xác nhất. Cập nhật LTĐ và KQBĐ hôm nay trên SABA VN";
        }
        else if(eventDate > today)
        {
            title = "Lịch thi đấu bóng đá, trực tiếp bóng đá ngày " + eventDateFormat;
            description = $"Lịch thi đấu bóng đá ngày {eventDateFormat} mới nhất. Cập nhật lịch thi đấu và trực tiếp bóng đá ngày {eventDateFormat} liên tục trên SABA VN.";
        }
        else
        {
            title = "Kết quả bóng đá, tỷ số bóng đá ngày " + eventDateFormat;
            description = $"Xem kết quả bóng đá ngày {eventDateFormat} chính xác nhất. Cập nhật tỷ số trận đấu ngày {eventDateFormat} đầy đủ và trực quan nhất cho độc giả trên SABA VN.";
        }
        var url  = $"{domain}lich-thi-dau/bong-da/{eventDate?.ToString("yyyy-MM-dd")}";
        var pageDetail = new Category
        {
            Title = title,
            OgTitle = title,
            Description = description,
            OgDescription = description,
            Url = url.TrimEnd('/')
        };
        var model = new PageViewModel
        {
            Category = pageDetail,
            Header = new HeaderViewModel
            {
                CategorySlug = Constants.MatchScheduleSlug,
                CategoryId = pageDetail.CateId,
                Title = title,
                Description = description
            }
        };
        ViewBag.EventDate = eventDate;

        return View("~/Views/Livescore/Soccer/Index.cshtml", model);
    }

    [Route("lich-thi-dau/bong-da/truc-tiep")]
    public IActionResult Live()
    {
        var viewModel = new Category { Url = $"{domain}lich-thi-dau/bong-da/truc-tiep" };
        return View("~/Views/Livescore/Soccer/Live.cshtml", viewModel);
    }

    [Route("lich-thi-dau/bong-da/{league}/{match}/{matchId:long}")]
    public async Task<IActionResult> MatchDetail(string league, string match, long matchId)
    {
        var matchInfo = await matchService.GetSummaryMatchByIdAsync(new GetSummaryMatchByIdCriteria { MatchId = matchId });
        if(matchInfo == null)
        {
            return View(Constants.EmptyBlogView);
        }
        var viewModel = new MatchDetailModel
        {
            Match = matchInfo,
            Url = $"{domain}lich-thi-dau/bong-da/{league}/{match}/{matchId}"
        };
        return View("~/Views/Livescore/Soccer/Detail.cshtml", viewModel);
    }

    [Route("lich-thi-dau/bong-da/{league}/{seasonId:long}/{date:datetime}/{leagueId:long}/{selectedTab?}")]
    public async Task<IActionResult> LeagueDetail(string league, long seasonId, DateTime date, long leagueId, string selectedTab)
    {
        const string dateFormat = "yyyy-MM-dd";
        if(seasonId != 0)
        {
            return RedirectPermanent($"/lich-thi-dau/bong-da/{league}/{seasonId}/{leagueId}/{selectedTab}");
        }
        var (isRedirect, tab) = GetRedirectTab(selectedTab);
        if(isRedirect)
        {
            return RedirectPermanent($"/lich-thi-dau/bong-da/{league}/{seasonId}/{date.ToString(dateFormat)}/{leagueId}/{tab}");
        }
        var leagueDetail = await leagueService.GetLeagueByIdAsync(leagueId);
        if(leagueDetail == null)
        {
            return View(Constants.EmptyBlogView);
        }
        var model = new GetMatchBySeasonParams
        {
            LeagueId = leagueId,
            SeasonId = seasonId,
            Date = date,
            SelectedTab = selectedTab,
            LeagueName = league,
            League = leagueDetail,
            IsCurrentSeason = false
        };
        ViewBag.Link = $"{domain}lich-thi-dau/bong-da/{league}/{seasonId}/{date.ToString(dateFormat)}/{leagueId}/{selectedTab}";
        return View("~/Views/Livescore/Soccer/LeagueDetail.cshtml", model);
    }

    [Route("lich-thi-dau/bong-da/{league}/{leagueId:long}/{selectedTab?}")]
    public async Task<IActionResult> LeagueDetail(string league, long leagueId, string selectedTab)
    {
        if(selectedTab == null)
        {
            return RedirectPermanent($"/lich-thi-dau/bong-da/{league}/{leagueId}/tong-hop");
        }
        var leagueDetail = await leagueService.GetLeagueByIdAsync(leagueId);
        if(leagueDetail == null)
        {
            return View(Constants.EmptyBlogView);
        }
        var model = new GetMatchBySeasonParams
        {
            LeagueId = leagueId,
            SelectedTab = selectedTab,
            LeagueName = league,
            League = leagueDetail,
            SeasonId = leagueDetail.CurrentSeasonId ?? 0,
            IsCurrentSeason = true
        };
        ViewBag.Link = $"{domain}lich-thi-dau/bong-da/{league}/{leagueId}/{selectedTab}";
        return View("~/Views/Livescore/Soccer/LeagueDetail.cshtml", model);
    }

    [Route("lich-thi-dau/bong-da/{league}/{seasonId:long}/{leagueId:long}/{selectedTab?}")]
    public async Task<IActionResult> LeagueDetailForSeason(string league, long seasonId, long leagueId, string selectedTab)
    {
        if(seasonId == 0)
        {
            return RedirectPermanent($"/lich-thi-dau/bong-da/{league}/{seasonId}/{DateTimeUtilize.Now():yyyy-MM-dd}/{leagueId}/{selectedTab}");
        }
        var (isRedirect, tab) = GetRedirectTab(selectedTab);
        if(isRedirect)
        {
            return RedirectPermanent($"/lich-thi-dau/bong-da/{league}/{seasonId}/{leagueId}/{tab}");
        }
        var leagueDetail = await leagueService.GetLeagueByIdAsync(leagueId);
        if(leagueDetail == null)
        {
            return View(Constants.EmptyBlogView);
        }
        var model = new GetMatchBySeasonParams
        {
            LeagueId = leagueId,
            SeasonId = seasonId,
            SelectedTab = selectedTab,
            LeagueName = league,
            League = leagueDetail,
            IsCurrentSeason = false
        };
        ViewBag.Link = $"{domain}lich-thi-dau/bong-da/{league}/{seasonId}/{leagueId}/{selectedTab}";
        return View("~/Views/Livescore/Soccer/LeagueDetail.cshtml", model);
    }


    private static (bool, string) GetRedirectTab(string selectedTab)
    {
        string tab;
        var isRedirect = true;
        switch(selectedTab)
        {
            case null:
            case "general":
                tab = "tong-hop";
                break;
            case "fixtures":
                tab = "lich-thi-dau";
                break;
            case "results":
                tab = "ket-qua";
                break;
            case "standings":
                tab = "bang-xep-hang";
                break;
            default:
                tab = "tong-hop";
                isRedirect = false;
                break;
        }
        return (isRedirect, tab);
    }

    [Route("lich-thi-dau/bong-da/tran-dau-quan-tam")]
    public IActionResult FavouriteMatch()
    {
        ViewBag.Link = $"{domain}lich-thi-dau/bong-da/tran-dau-quan-tam";
        return View("~/Views/Livescore/Soccer/FavouriteMatch.cshtml");
    }

    [Route("lich-thi-dau/bong-da/giai-dau-quan-tam")]
    public IActionResult FavouriteLeague()
    {
        ViewBag.Link = $"{domain}lich-thi-dau/bong-da/giai-dau-quan-tam";
        return View("~/Views/Livescore/Soccer/FavouriteLeague.cshtml");
    }

    [HttpPost]
    public async Task<IActionResult> GetMatches([FromBody] GetMatchByDateCriteria criteria)
    {
        if(criteria == null)
        {
            return Json(null);
        }
        criteria.FromTime = criteria.EventDate.ToStartOfDay().ConvertToUTC(criteria.Timezone);
        criteria.ToTime = criteria.EventDate.ToEndOfDay().ConvertToUTC(criteria.Timezone);
        criteria.SportId = (short)SportType.Soccer;
        IList<SabaNews.Livescore.Models.Match.Match> matches;
        if (cacheConfigs.Enabled)
        {
            var cacheKey = $"{CacheKey.LivescoreMainPage}{criteria.EventDate:ddMMyyyy}";
            matches = await cacheService.GetAsync<IList<SabaNews.Livescore.Models.Match.Match>>(cacheKey);
            if (matches is null)
            {
                matches = await matchService.GetMatchByDateAsync(criteria);

                var today = DateTimeUtilize.UtcNow().Date;
                byte timeout = 1;
                if (criteria.EventDate.Date < today.AddDays(-cacheConfigs.DateRange)
                    || criteria.EventDate.Date > today.AddDays(cacheConfigs.DateRange))
                {
                    timeout = cacheConfigs.OutOfRangeTimeout;
                }

                await cacheService.SetAsync(cacheKey, matches,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(timeout)
                    });
            }
        }
        else
        {
            matches = await matchService.GetMatchByDateAsync(criteria);
        }

        return Json(matches);
    }

    [HttpPost]
    public async Task<IActionResult> GetLiveMatches()
    {
        IList<SabaNews.Livescore.Models.Match.Match> matches;
        if (cacheConfigs.Enabled)
        {
            matches = await cacheService.GetAsync<IList<SabaNews.Livescore.Models.Match.Match>>(CacheKey.LivescoreLiveMatch);
            if (matches is null)
            {
                matches = await matchService.GetLiveMatchAsync();
                await cacheService.SetAsync(CacheKey.LivescoreLiveMatch, matches,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(1)
                    });
            }
        }
        else
        {
            matches = await matchService.GetLiveMatchAsync();
        }

        return Json(matches);
    }

    [HttpPost]
    public async Task<IActionResult> GetMatchesBySeason([FromBody] GetMatchBySeasonParams model)
    {
        if (model == null)
        {
            return Json(null);
        }
        var criteria = new GetMatchBySeasonCriteria
        {
            LeagueId = model.LeagueId,
            SeasonId = model.SeasonId
        };
        if (criteria.SeasonId == 0)
        {
            if(model.Date == DateTimeOffset.MinValue.DateTime) {
                model.Date = DateTimeUtilize.UtcNow().DateTime;
            }
            const byte TotalMonths = 6;
            criteria.FromTime = model.Date.AddMonths(-TotalMonths).ToStartOfDay().ConvertToUTC(model.Timezone);
            criteria.ToTime = model.Date.AddMonths(TotalMonths).ToEndOfDay().ConvertToUTC(model.Timezone);
        }

        var (league, matches) = await matchService.GetMatchBySeasonAsync(criteria);
        return Json(new { league, matches });
    }


    [HttpPost]
    public async Task<IActionResult> GetSeasonStandings([FromBody] GetSeasonStandingsCriteria criteria)
    {
        var standings = await matchService.GetSeasonStandingsAsync(criteria);
        return Json(standings);
    }

    [HttpPost]
    public async Task<IActionResult> GetLeagueSeasonStanding([FromBody] GetLeagueAndSeasonStandingsCriteria criteria)
    {
        var (league, standing) = await leagueService.GetLeagueAndSeasonStandingAsync(criteria);
        return Json(new { league, standing });
    }

    [HttpPost]
    public async Task<IActionResult> GetMajorLeagues()
    {
        var leagues = await leagueService.GetMajorLeagueAsync();
        return Json(leagues);
    }


    [HttpPost]
    public async Task<IActionResult> GetMatchDetail([FromBody] GetMatchByIdCriteria criteria)
    {
        if (criteria == null)
        {
            return Json(null);
        }
        var matchId = criteria.MatchId;
        var result = new MatchDetail
        {
            GeneralInfo = await matchService.GetMatchByIdAsync(new GetMatchByIdCriteria { MatchId = matchId }),
            Statistic = await matchService.GetMatchStatisticAsync(new GetMatchStatisticCriteria { MatchId = matchId }),
            HeadToHead = await matchService.GetHeadToHeadAsync(new GetHeadToHeadCriteria { MatchId = matchId }),
            Lineup = await matchService.GetLineupAsync(new GetMatchLineupCriteria { MatchId = matchId }),
            Incidents = await matchService.GetMatchIncidentAsync(new GetMatchIncidentCriteria { MatchId = matchId })
        };
        return Json(result);
    }

    [HttpPost]
    public async Task<IActionResult> GetFavMatches([FromBody] GetMatchByIdsCriteria criteria)
    {
        if (!ValidateJson(criteria.MatchIds))
        {
            return Json(null);
        }
        var result = new MatchFavourite
        {
            Matches = await matchService.GetMatchByIdsAsync(criteria),
            LiveMatches = await matchService.GetLiveMatchAsync()
        };
        return Json(result);
    }

    [HttpPost]
    public async Task<IActionResult> GetMatchByIds(string matchIds)
    {
        var result = await matchService.GetMatchByIdsAsync(new GetMatchByIdsCriteria { MatchIds = matchIds });
        return Json(result);
    }

    [HttpPost]
    public async Task<IActionResult> GetFavLeagues([FromBody] FavLeagueModel model)
    {
        if(model == null || (model.LeagueIds != null && !ValidateJson(model.LeagueIds)))
        {
            return Json(null);
        }
        var leagues = model.LeagueIds == null
            ? await leagueService.GetMajorLeagueAsync()
            : await leagueService.GetLeagueByIdsAsync(new GetLeagueByIdsCriteria { LeagueIds = model.LeagueIds });
        return Json(leagues);
    }

    [HttpPost]
    public async Task<IActionResult> GetLeagues()
    {
        var leagues = await dataControlService.GetLeagues();
        return Json(leagues);
    }

    [HttpPost]
    public async Task<IActionResult> GetMatchGeneralInfo([FromBody] GetMatchByIdCriteria criteria)
    {
        if(criteria == null)
        {
            return Json(null);
        }
        var match = await matchService.GetMatchByIdAsync(criteria);
        var incidents = await matchService.GetMatchIncidentAsync(new GetMatchIncidentCriteria { MatchId = criteria.MatchId });
        return Json(new { match, incidents });
    }

    private static bool ValidateJson(string json)
    {
        try
        {
            JToken.Parse(json);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

}