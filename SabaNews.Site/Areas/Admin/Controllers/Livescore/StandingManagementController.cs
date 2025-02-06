namespace SabaNews.Site.Areas.Admin.Controllers.Livescore;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Models.Livescore.MatchManagement;
using SabaNews.Models.Livescore.StandingManagement;
using SabaNews.Site.Extensions;
using System.Threading.Tasks;
using SabaNews.Livescore.Services.Interfaces;

public class StandingManagementController(ILeagueService leagueService) : AdminController
{
    private const long DefaultLeagueId = WorldCup2022.LeagueIdWorldCup2022;
    private const long DefaultSeasonId = WorldCup2022.SeasonIdWorldCup2022;

    public async Task<IActionResult> Index()
    {
        var leagues = await leagueService.GetLeaguesAsync();
        var model = new MatchManageModel
        {
            Leagues = leagues,
            LeagueId = DefaultLeagueId,
            SeasonId = DefaultSeasonId
        };

        return View("~/Areas/Admin/Views/Livescore/StandingManagement/Index.cshtml", model);
    }

    [HttpPost]
    public async Task<IActionResult> GetDataGrid(StandingFilterModel model)
    {
        var criteria = new GetLeagueSeasonStandingCriteria { SeasonId = model.SeasonId, LeagueId = model.LeagueId };
        var standings = await leagueService.GetLeagueSeasonStanding(criteria);
        var groupStanding = LivescoreHelper.GroupStandingsByGroupName(standings);
        var viewModel = new StandingManageGridViewModel
        {
            Groups = groupStanding,
            SeasonId = model.SeasonId,
            LeagueId = model.LeagueId
        };
        return PartialView("~/Areas/Admin/Views/Livescore/StandingManagement/_DataGrid.cshtml", viewModel);
    }

    [HttpGet]
    public async Task<ActionResult> EditStanding(long seasonId, long stageId, long teamId, long leagueId)
    {
        var criteria = new GetLeagueSeasonStandingDetailCriteria { SeasonId = seasonId, StageId = stageId, TeamId = teamId };
        var standing = await leagueService.GetLeagueSeasonStandingDetailAsync(criteria);
        var criteriaGroup = new GetLeagueSeasonStandingCriteria { SeasonId = seasonId, LeagueId = leagueId };
        var standings = await leagueService.GetLeagueSeasonStanding(criteriaGroup);
        var groupStanding = LivescoreHelper.GroupStandingsByGroupName(standings);
        var group = groupStanding.Find(item => item.GroupName == (standing.GroupNameCustom ?? standing.GroupName));
        var model = new StandingUpdateViewModel
        {
            Standing = standing,
            Groups = groupStanding,
            Group = group
        };
            

        return PartialView("~/Areas/Admin/Views/Livescore/StandingManagement/_Edit.cshtml", model);
    }

    [HttpPost]
    public async Task<ActionResult> EditStanding(StandingUpdateModel model)
    {
        var criteria = new GetLeagueSeasonStandingDetailCriteria { SeasonId = model.SeasonId, StageId = model.StageId, TeamId = model.TeamId };
        var standings = await leagueService.GetLeagueSeasonStandingDetailAsync(criteria);

        model.IsUpdateGroupName = standings.GroupName != model.GroupName || (standings.GroupNameCustom != null && standings.GroupNameCustom != model.GroupName);
        model.IsUpdatePosition = standings.Position != model.Position;
        model.GroupName = Helper.CheckOriginValue(standings.GroupName, model.GroupName);
        model.Total = Helper.CheckOriginValue(standings.Total, model.Total);
        model.Won = Helper.CheckOriginValue(standings.Won, model.Won);
        model.Draw = Helper.CheckOriginValue(standings.Draw, model.Draw);
        model.Loss = Helper.CheckOriginValue(standings.Loss, model.Loss);
        model.Goals = Helper.CheckOriginValue(standings.Goals, model.Goals);
        model.GoalsAgainst = Helper.CheckOriginValue(standings.GoalsAgainst, model.GoalsAgainst);
        model.GoalDiff = Helper.CheckOriginValue(standings.GoalDiff, model.GoalDiff);
        model.Points = Helper.CheckOriginValue(standings.Points, model.Points);
        model.OldGroupName = !string.IsNullOrEmpty(standings.GroupNameCustom) ? standings.GroupNameCustom : standings.GroupName;

        var result = await leagueService.UpdateStandingAsync(model);

        return Json(result);
    }

    [HttpPost]
    public async Task<IActionResult> ResetData(long seasonId)
    {
        var result = await leagueService.RemoveStandingCustomAsync(seasonId);
        return Json(result);
    }

}