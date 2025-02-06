namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Criteria.Event.WorldCup;
using SabaNews.Livescore.Services.Criteria.Match;
using SabaNews.Models.Event.WorldCup;
using SabaNews.Models.ViewModel.Event.WorldCup;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Extensions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

public class MinigameWorldCup2022Controller(
    IExportExcelService excelService,
    IWorldCupService worldcupService)
    : AdminController
{
    public IActionResult MinigameWorldCup2022()
    {
        return View();
    }

    public IActionResult CountUser()
    {
        return View();
    }

    public async Task<ActionResult> GetDataMinigameWorldCup2022(UserFilterMembershipEventModel model)
    {
        var criteria = new GetMinigameUsersByStageCriteria
        {
            stage = model.Stage
        };
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var miniGames = await worldcupService.GetMinigameUsersAsync(criteria);
        var matches = await worldcupService.GetMatchWCBySeasonAsync(criteriaMatch);
        miniGames = WorldCupHelper.CalculatorPointer(matches, miniGames);
        var miniGamesPaging = miniGames.Skip(model.PageSize * (model.Page - 1)).Take(model.PageSize).ToList();
        var viewModel = new MinigameGridViewModel
        {
            MiniGames = miniGamesPaging,
            Paging = new PagingModel
            {
                CurrentPage = model.Page,
                PageSize = model.PageSize,
                TotalPages = (int)Math.Ceiling(miniGames.Count / (double)model.PageSize)
            }
        };
        return PartialView("_MinigameWorldCup2022DataGrid", viewModel);
    }

    public async Task<ActionResult> GetCountUserGrid(string dateSearch)
    {
        var search = DateTime.Parse(dateSearch, CultureInfo.InvariantCulture);
        var miniGames = await worldcupService.GetMinigameAllUsersAsync();
        var users = miniGames.Where(item => item.CreatedDate.AddHours(7).Date == search.Date
                                            || item.UpdatedDate.AddHours(7).Date == search.Date).ToList();
            
        var tmpUsers = new List<UserMinigameModel>();
        foreach (var user in users)
        {
            var isExists = tmpUsers.Find(value => value.UserId == user.UserId);
            if (isExists == null)
            {
                tmpUsers.Add(user);
            }
        }

        return PartialView("_CountUserGrid", tmpUsers);
    }

    public async Task<ActionResult> GetDetailUser(ManagementDetailMinigameViewModel param)
    {
        var criteriaVotesUser = new GetMinigameByUserStageCriteria
        {
            Stage = param.StageDetail,
            UserId = param.UserId
        };
        var criteriaVoteMinigame = new GetMinigameUsersByStageCriteria
        {
            stage = param.StageDetail
        };
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var matches = await worldcupService.GetMatchWCBySeasonAsync(criteriaMatch);
        var votes = await worldcupService.GetMinigameByUserStageAsync(criteriaVotesUser);
        foreach (var vote in votes)
        {
            var matchVote = WorldCupHelper.GetMatch(matches, vote);
            var (_, score) = WorldCupHelper.GetVoteResult(matchVote, vote);
            vote.Point = score;
        }
        var miniGames = await worldcupService.GetMinigameUsersAsync(criteriaVoteMinigame);
        miniGames = miniGames.Where(x => x.UserId == param.UserId).ToList();
        var viewModel = new ManagementDetailMinigameViewModel
        {
            Rank = param.Rank,
            Totalpoint = param.Totalpoint,
            Votes = votes,
            StageDetail = param.StageDetail,
            Matches = matches,
            MatchesRoundEightTeam = matches.Where(x => x.Stage.StageId == 30538).ToList(),
            MatchesRoundQuarterfinals = matches.Where(x => x.Stage.StageId == 30539).ToList(),
            MatchesRoundSemifinal = matches.Where(x => x.Stage.StageId == 30540).ToList(),
            MatchesRoundThirdPlace = matches.Where(x => x.Stage.StageId == 30541).ToList(),
            MatchesRoundFinal = matches.Where(x => x.Stage.StageId == 30542).ToList()
        };
        if(miniGames.Count != 0) {
            viewModel.Email = miniGames[0].Email;
            viewModel.Username = miniGames[0].UserName;
        }
        return PartialView("_DetailPlayerVotes", viewModel);
    }

    public async Task<ActionResult> ExportExcel(byte stage)
    {
        var criteria = new GetMinigameUsersByStageCriteria
        {
            stage = stage
        };
        var criteriaMatch = new GetMatchBySeasonCriteria
        {
            LeagueId = WorldCup2022.LeagueIdWorldCup2022,
            SeasonId = WorldCup2022.SeasonIdWorldCup2022
        };
        var miniGames = await worldcupService.GetMinigameUsersAsync(criteria);
        var matches = await worldcupService.GetMatchWCBySeasonAsync(criteriaMatch);
        miniGames = WorldCupHelper.CalculatorPointer(matches, miniGames);
        var bytes = excelService.ExportMinigameWorldCup2022(miniGames);
        return File(bytes, "application/xlsx", "MiniGameWorldCup2022.xlsx");
    }
}