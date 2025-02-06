namespace SabaNews.Site.Areas.Admin.Controllers.Livescore;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Livescore.Services.Criteria.Match;
using System.Collections.Generic;
using System.Threading.Tasks;
using SabaNews.Livescore.Models.Match;
using System.Linq;
using SabaNews.Site.Extensions;
using SabaNews.Core.Models;
using System;
using SabaNews.Services.Interfaces;
using SabaNews.Models.Livescore.MatchManagement;
using System.Globalization;
using SabaNews.Core.Helper;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Services.Interfaces;

public class MatchManagementController(
    ILeagueService leagueService,
    IMatchService matchService,
    IFileService fileService)
    : AdminController
{
    private const long DefaultLeagueId = Euro2024.LeagueId;
    private const long DefaultSeasonId = Euro2024.SeasonId;
    private const string SortDesc = "desc";
    private const string SortAsc = "asc";

    public async Task<IActionResult> Index()
    {
        var leagues = await leagueService.GetLeaguesAsync();
        var model = new MatchManageModel
        {
            Leagues = leagues,
            LeagueId = DefaultLeagueId,
            SeasonId = DefaultSeasonId
        };

        return View("~/Areas/Admin/Views/Livescore/MatchManagement/Index.cshtml", model);
    }

    public async Task<IActionResult> GetSeason(long leagueId, long season)
    {
        var seasons = await leagueService.GetSeasonByLeagueIdAsync(leagueId);
        var currentSeason = seasons.FirstOrDefault(item => item.SeasonId == season);
        if(season > 0 && currentSeason == null)
        {
            seasons.Insert(0, new Season { SeasonId = season, Year = season.ToString() });
        }
        return PartialView("~/Areas/Admin/Views/Livescore/MatchManagement/_SeasonFilter.cshtml", seasons);
    }

    [HttpPost]
    public async Task<IActionResult> GetMatchGrid(MatchFilterModel model)
    {
        var criteria = new GetMatchBySeasonFilterCriteria { LeagueId = model.LeagueId, SeasonId = model.SeasonId };
        var matches = await matchService.GetMatchBySeasonFilterAsync(criteria);
        matches = SearchMatch(matches, model.Search);
        matches = SortMatch(matches, model.DateSort);
        var totalItem = matches.Count;
        if (matches.Any())
        {
            matches = matches.Skip(model.PageSize * (model.Page - 1)).Take(model.PageSize).ToList();
        }
        var viewModel = new MatchManageGridVewModel
        {
            Matches = matches,
            DateSort = model.DateSort,
            Paging = new PagingModel
            {
                CurrentPage = model.Page,
                PageSize = model.PageSize,
                TotalPages = (int)Math.Ceiling(totalItem / (double)model.PageSize)
            }
        };
        return PartialView("~/Areas/Admin/Views/Livescore/MatchManagement/_MatchGrid.cshtml", viewModel);
    }


    [HttpGet]
    public async Task<ActionResult> EditMatch(long matchId)
    {
        var match = await matchService.GetMatchByIdAsync(new GetMatchByIdCriteria { MatchId = matchId });
        return PartialView("~/Areas/Admin/Views/Livescore/MatchManagement/_Edit.cshtml", match);
    }

    [HttpPost]
    public async Task<ActionResult> EditMatch(MatchUpdateModel model)
    {
        var match = await matchService.GetMatchByIdUpdateAsync(new GetMatchByIdUpdateCriteria { MatchId = model.MatchId });
        var homeIconVN = model.IsDeletedHomeIcon ? null : match.HomeTeam.IconVN;
        var awayIconVN = model.IsDeletedAwayIcon ? null : match.AwayTeam.IconVN;
        if (model.HomeIcon != null)
        {
            var uploadResult = await fileService.UploadFileAsync(model.HomeIcon, UploadDir.MatchTeamUploadFolder);
            homeIconVN = uploadResult.IsSuccessful ? uploadResult.AbsoluteUrl : homeIconVN;
        }
        if (model.AwayIcon != null)
        {
            var uploadResult = await fileService.UploadFileAsync(model.AwayIcon, UploadDir.MatchTeamUploadFolder);
            awayIconVN = uploadResult.IsSuccessful ? uploadResult.AbsoluteUrl : awayIconVN;
        }
        DateTime? startTime;
        if (model.StartTime == DateTimeOffset.MinValue.DateTime)
        {
            startTime = null;
        }
        else
        {
            startTime = model.StartTime.ConvertToGMT();
        }
        var cmd = new UpdateMatchCommand
        {
            MatchId = model.MatchId,
            StageId = match.Stage?.StageId ?? 0,
            HomeTeamId = model.HomeTeamId,
            HomeTeamNameVN = model.HomeTeamNameVN,
            HomeTeamIconVN = homeIconVN,
            AwayTeamId = model.AwayTeamId,
            AwayTeamNameVN = model.AwayTeamNameVN,
            AwayTeamIconVN = awayIconVN,
            StageNameVN = model.StageNameVN,
            Status = Helper.CheckOriginValue(match.Status, model.Status),
            StartTime = Helper.CheckOriginValue(match.StartTime, startTime),
            Round = Helper.CheckOriginValue(match.Round, model.Round),
            HomeTeamHalfScore = Helper.CheckOriginValue(match.HomeTeamHalfScore, model.HomeTeamHalfScore),
            AwayTeamHalfScore = Helper.CheckOriginValue(match.AwayTeamHalfScore, model.AwayTeamHalfScore),
            HomeTeamExtraScore = Helper.CheckOriginValue(match.HomeTeamExtraScore, model.HomeTeamExtraScore),
            AwayTeamExtraScore = Helper.CheckOriginValue(match.AwayTeamExtraScore, model.AwayTeamExtraScore),
            HomeTeamAggregateScore = Helper.CheckOriginValue(match.HomeTeamAggregateScore, model.HomeTeamAggregateScore),
            AwayTeamAggregateScore = Helper.CheckOriginValue(match.AwayTeamAggregateScore, model.AwayTeamAggregateScore),
            HomeTeamPenaltyScore = Helper.CheckOriginValue(match.HomeTeamPenaltyScore, model.HomeTeamPenaltyScore),
            AwayTeamPenaltyScore = Helper.CheckOriginValue(match.AwayTeamPenaltyScore, model.AwayTeamPenaltyScore)
        };
        var result = await matchService.UpdateMatchAsync(cmd);

        return Json(result);
    }

    private static IList<Match> SearchMatch(IList<Match> matches, string search)
    {
        search ??= "";
        search = search.ToLower(CultureInfo.InvariantCulture);
        matches = matches.Where(x => LivescoreHelper.GetTeamName(x.HomeTeam).ToLower(CultureInfo.InvariantCulture).Contains(search)
                                     || LivescoreHelper.GetTeamName(x.AwayTeam).ToLower(CultureInfo.InvariantCulture).Contains(search)).ToList();
        return matches;
    }

    public IList<Match> SortMatch(IList<Match> matches, string typeSort)
    {
        if (typeSort == SortDesc)
        {
            matches = matches.OrderByDescending(x => x.StartTime).ToList();
        }
        if (typeSort == SortAsc)
        {
            matches = matches.OrderBy(x => x.StartTime).ToList();
        }
        return matches;
    }

}