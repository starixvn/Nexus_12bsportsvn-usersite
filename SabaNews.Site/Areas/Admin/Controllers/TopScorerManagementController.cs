namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Models.Livescore.MatchManagement;
using SabaNews.Models.ViewModel.Event.WorldCup;
using System.Linq;
using System.Threading.Tasks;
using SabaNews.Livescore.Services.Interfaces;

public class TopScorerManagementController(ILeagueService leagueService) : AdminController
{
    public async Task<IActionResult> Index()
    {
        var leagues = await leagueService.GetLeaguesAsync();
        var model = new MatchManageModel
        {
            Leagues = leagues,
            LeagueId = Euro2024.LeagueId,
            SeasonId = Euro2024.SeasonId
        };
        return View(model);
    }

    public async Task<ActionResult> GetTopScorersData(string search, long leagueId, long seasonId)
    {
        var topScorers = await leagueService.GetAllTopScorersAsync(leagueId, seasonId);

        if(search != null) { 
            topScorers = topScorers.Where(x => (x.PlayerNameEN != null && x.PlayerNameEN.Contains(search))
                                               || (x.PlayerFullNameEN != null && x.PlayerFullNameEN.Contains(search))).ToList();
        }

        return PartialView("_TopScorersManagementDataGrid", topScorers);
    }

    [HttpGet]
    public async Task<ActionResult> AddPlayer(long leagueId, long seasonId)
    {
        var topScorers = await leagueService.GetAllTopScorersAsync(leagueId, seasonId);
        var standingsCriteria = new GetLeagueSeasonStandingCriteria { LeagueId = leagueId, SeasonId = seasonId };
        var standings = await leagueService.GetLeagueSeasonStanding(standingsCriteria);
        var stage = standings.Max(x => x.StageId);
        var teams = standings.Where(val => val.StageId == stage).ToList();
        var player = await leagueService.GetPlayerByIdTeamAsync(teams[0].TeamId);
        if (topScorers.Any()) {
            ViewBag.TopTotal = topScorers[^1].Top + 1;
        }
        else {
            ViewBag.TopTotal = 1;
        }
        player = player.Where(x => !topScorers.Any(y => y.PlayerId == x.PlayerId)).ToList();
        var model = new PlayerViewModel {
            Teams = teams,
            Players = player
        };
        return PartialView("_AddPlayerDataGrid", model);
    }

    [HttpPost]
    public async Task<ActionResult> AddPlayer(TopScorers topScorers)
    {
        var result = await leagueService.InsertTopScorerAsync(topScorers);
        return Json(result);
    }

    [HttpGet]
    public async Task<ActionResult> GetPlayerByTeamId(long teamId, long leagueId, long seasonId)
    {
        var player = await leagueService.GetPlayerByIdTeamAsync(teamId);
        var topScorers = await leagueService.GetAllTopScorersAsync(leagueId, seasonId);
        player = player.Where(x => !topScorers.Any(y => y.PlayerId == x.PlayerId)).ToList();
        return Json(player);
    }

    [HttpGet]
    public async Task<ActionResult> UpdateTopScorers(TopScorerUpdateModel param)
    {
        var standingsCriteria = new GetLeagueSeasonStandingCriteria { LeagueId = param.LeagueId, SeasonId = param.SeasonId };
        var teams = await leagueService.GetLeagueSeasonStanding(standingsCriteria);
        var players = await leagueService.GetPlayerByIdTeamAsync(param.TeamId);
        var playUpdate = await leagueService.GetTopScorersByRowNumAsync(param.RowNum, param.LeagueId, param.SeasonId);
        var model = new PlayerViewModel
        {
            TopScorers = playUpdate[0],
            Teams = teams,
            Players = players
        };
        return PartialView("_EditPlayer", model);
    }

    [HttpPost]
    public async Task<ActionResult> UpdateTopScorers(TopScorers topScorers)
    {
        var result = await leagueService.UpdateTopScorerAsync(topScorers);
        return Json(result);
    }

    [HttpPost]
    public async Task<ActionResult> Delete(int rowNum, long leagueId, long seasonId)
    {
        var result = await leagueService.DeleteTopScorerAsync(rowNum, leagueId, seasonId);
        return Json(result);
    }
}