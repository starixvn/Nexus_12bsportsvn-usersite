namespace SabaNews.Site.Areas.Admin.Controllers.Livescore;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Services;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Models.ManagementLeague;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using SabaNews.Livescore.Services.Interfaces;

public class ManagementLeagueController(ILeagueService leagueService, IFileService fileService) : AdminController
{
    private const int priorityAscending = 1;
    private const int priorityDescending = 2;
    private const int createdDateDescending = 3;
    private const int createdDateAscending = 4;

    public async Task<ActionResult> Index()
    {
        var leagues = await leagueService.GetLeaguesAsync();
        leagues = SearchLeague(leagues, null, 1);
        return View("~/Areas/Admin/Views/Livescore/ManagementLeague/Index.cshtml", leagues);
    }

    public async Task<ActionResult> GetManagementLeagueData(ManagementLeagueFilterModel model)
    {
        var leagues = await leagueService.GetLeaguesAsync();
        leagues = SearchLeague(leagues, model.Search, model.IsMajor);
        leagues = SortLeague(leagues, model.TypeSort);
        var totalLeague = leagues.Count;
        if (leagues.Count > 0)
        {
            leagues = leagues.Skip(model.PageSize * (model.Page - 1)).Take(model.PageSize).ToList();
        }
        var viewModel = new ManagementLeagueGridViewModel
        {
            Leagues = leagues,
            Paging = new PagingModel
            {
                CurrentPage = model.Page,
                PageSize = model.PageSize,
                TotalPages = (int)Math.Ceiling(totalLeague / (double)model.PageSize)
            }
        };
        return PartialView("~/Areas/Admin/Views/Livescore/ManagementLeague/_ManagementLeagueDataGrid.cshtml", viewModel);
    }

    public async Task<ActionResult> GetManagementLeagueHotData()
    {
        var leagues = await leagueService.GetLeaguesAsync();
        leagues = SearchLeague(leagues, null, 1);
        return View("~/Areas/Admin/Views/Livescore/ManagementLeague/ManagementHotLeagueDataGrid.cshtml", leagues);
    }

    public async Task<ActionResult> UpdatePriority(string originIndex, string nextIndex)
    {
        var leagues = await leagueService.GetLeaguesAsync();
        leagues = SearchLeague(leagues, null, 1);
        var resultUpdateLeague = await leagueService.UpdateLeaguesExtraAsync(new League
        {
            LeagueId = leagues[int.Parse(originIndex) - 1].LeagueId,
            IsMajor = leagues[int.Parse(originIndex) - 1].IsMajor,
            Priority = leagues[int.Parse(nextIndex) - 1].Priority
        });
        return Json(resultUpdateLeague);
    }

    [HttpGet]
    public async Task<ActionResult> EditLeague(long leagueId)
    {
        var league = await leagueService.GetLeagueByIdsAsync(new GetLeagueByIdsCriteria { LeagueIds = "["+leagueId+"]"});
        var leaguesExtra = await leagueService.GetLeaguesAsync();
        ViewBag.priority = LeagueService.GetLeaguePriority(leaguesExtra);
        return PartialView("~/Areas/Admin/Views/Livescore/ManagementLeague/_Edit.cshtml", league);
    }

    [HttpPost]
    public async Task<ActionResult> EditLeague(LeagueUpdateViewModel leagueUpdate)
    {
        var league = await leagueService.GetLeagueByIdsAsync(new GetLeagueByIdsCriteria { LeagueIds = "[" + leagueUpdate.LeagueId + "]" });
        var iconCountry = leagueUpdate.IsDeletedIconCountry ? null : league[0].CountryIconVN;
        if (leagueUpdate.IconCountry != null)
        {
            var uploadResult = await fileService.UploadFileAsync(leagueUpdate.IconCountry, UploadDir.LeagueUploadFolder);
            iconCountry = uploadResult.IsSuccessful ? uploadResult.AbsoluteUrl : iconCountry;
        }

        var iconLeague = leagueUpdate.IsDeletedIconLeague ? null : league[0].IconVN;
        if (leagueUpdate.IconLeague != null)
        {
            var uploadResult = await fileService.UploadFileAsync(leagueUpdate.IconLeague, UploadDir.LeagueUploadFolder);
            iconLeague = uploadResult.IsSuccessful ? uploadResult.AbsoluteUrl : iconLeague;
        }
        var resultUpdateLeague = await leagueService.UpdateLeaguesAsync(new UpdateLeagueCriteria
        {
            LeagueId = leagueUpdate.LeagueId,
            LeagueNameVN = leagueUpdate.LeagueNameVN,
            CountryVN = leagueUpdate.CountryVN?.ToUpper(CultureInfo.InvariantCulture),
            CountryIconVN = iconCountry,
            IconVN = iconLeague
        });
        _ = await leagueService.UpdateLeaguesExtraAsync(new League
        {
            LeagueId = leagueUpdate.LeagueId,
            IsMajor = leagueUpdate.IsMajor,
            Priority = leagueUpdate.Priority
        });
        return Json(resultUpdateLeague);
    }

    public async Task<ActionResult> GetAllLeagues()
    {
        var leagues = await leagueService.GetAllLeaguesAsync();
        var leaguesExtra = await leagueService.GetLeaguesAsync();
        ViewBag.priority = LeagueService.GetLeaguePriority(leaguesExtra);
        return PartialView("~/Areas/Admin/Views/Livescore/ManagementLeague/_AddLeagueDataGrid.cshtml", leagues);
    }

    public async Task<ActionResult> GetLeagueById(long leagueId)
    {
        var league = await leagueService.GetLeagueByIdAsync(leagueId);
        return Json(league);
    }

    public async Task<ActionResult> UpdateLeagueExtra(League league)
    {         
        var result = await leagueService.UpdateLeaguesExtraAsync(league);
        return Json(result);
    }

    public async Task<ActionResult> RemoveLeagueExtra(long leagueId)
    {
        var result = await leagueService.DeleteLeaguesExtraAsync(leagueId);
        return Json(result);
    }

    [HttpPost]
    public async Task<ActionResult> AddLeagueExtra(LeagueUpdateViewModel leagueUpdate)
    {
        var league = await leagueService.GetLeagueByIdAsync(leagueUpdate.LeagueId);

        var iconCountry = leagueUpdate.IsDeletedIconCountry ? null : league.CountryIconVN;
        if (leagueUpdate.IconCountry != null)
        {
            var uploadResult = await fileService.UploadFileAsync(leagueUpdate.IconCountry, UploadDir.LeagueUploadFolder);
            iconCountry = uploadResult.IsSuccessful ? uploadResult.AbsoluteUrl : iconCountry;
        }

        var iconLeague = leagueUpdate.IsDeletedIconLeague ? null : league.IconVN;
        if (leagueUpdate.IconLeague != null)
        {
            var uploadResult = await fileService.UploadFileAsync(leagueUpdate.IconLeague, UploadDir.LeagueUploadFolder);
            iconLeague = uploadResult.IsSuccessful ? uploadResult.AbsoluteUrl : iconLeague;
        }

        var result = await leagueService.InsertLeaguesExtraAsync(leagueUpdate.LeagueId);
        _ = await leagueService.UpdateLeaguesAsync(new UpdateLeagueCriteria
        {
            LeagueId = leagueUpdate.LeagueId,
            LeagueNameVN = leagueUpdate.LeagueNameVN,
            CountryVN = leagueUpdate.CountryVN?.ToUpper(CultureInfo.InvariantCulture),
            CountryIconVN = iconCountry,
            IconVN = iconLeague
        });
        _ = await leagueService.UpdateLeaguesExtraAsync(new League
        {
            LeagueId = leagueUpdate.LeagueId,
            IsMajor = leagueUpdate.IsMajor,
            Priority = leagueUpdate.Priority
        });
        return Json(result);
    }

    public IList<League> SearchLeague(IList<League> leagues, string search, int isMajor)
    {
        if (search != null)
        {
            leagues = leagues.Where(x => (x.LeagueFullNameEN != null && x.LeagueFullNameEN.ToLower(CultureInfo.InvariantCulture).Contains(search.ToLower(CultureInfo.InvariantCulture)))
                                         || (x.LeagueNameVN != null && x.LeagueNameVN.ToLower(CultureInfo.InvariantCulture).Contains(search.ToLower(CultureInfo.InvariantCulture)))).ToList();
        }
        if (isMajor == 1)
        {
            leagues = leagues.Where(x => x.IsMajor).ToList();
        }
        if (isMajor == 0)
        {
            leagues = leagues.Where(x => !x.IsMajor).ToList();
        }
        return leagues;
    }

    public IList<League> SortLeague(IList<League> leagues, int typeSort)
    {
        if (typeSort == priorityAscending)
        {
            leagues = leagues.OrderBy(x => x.Priority).ToList();
        }
        if (typeSort == priorityDescending)
        {
            leagues = leagues.OrderByDescending(x => x.Priority).ToList();
        }
        if (typeSort == createdDateDescending)
        {
            leagues = leagues.OrderByDescending(x => x.CreatedDate).ToList();
        }
        if (typeSort == createdDateAscending)
        {
            leagues = leagues.OrderBy(x => x.CreatedDate).ToList();
        }
        return leagues;
    }
}