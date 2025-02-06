namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Livescore.Models.Match;
using SabaNews.Livescore.Services.Criteria.Team;
using SabaNews.Models.ViewModel.Event.Euro2024;
using SabaNews.Models.ViewModel.Poll;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Criteria.Minigame;
using Models.Minigame;
using Models.ViewModel.Euro2020;

public class Euro2024ManagementController(
    IOptionService optionService,
    IPollService pollService,
    IEuro2024Service euro2024Service,
    IFileService fileService,
    IDataControlService dataControlService)
    : AdminController
{
    private const string SortDesc = "desc";
    private const string SortAsc = "asc";


    public async Task<ActionResult> Poll()
    {
        var polls = await pollService.GetAllPollAsync();
        var currentQuestion = await optionService.GetOptionAsync(Euro2024.PollKey);
        var currentQuestionName = "-------";
        var questId = 0;
        if(currentQuestion != null)
        {
            questId = int.Parse(currentQuestion.OptionValue);
            currentQuestionName = polls.First(item => item.Id == questId).Question;
        }
        var viewModel = new PollAdminViewModel
        {
            Polls = polls,
            SelectedQuestId = questId,
            SelectedQuest = currentQuestionName
        };
        return View(viewModel);
    }

    public async Task<ActionResult> Team()
    {
        var teams = await euro2024Service.GetTeamByStage(Euro2024.SeasonId, Euro2024.GroupStageId);
        return View(teams);
    }
        

    public IActionResult TeamPlayer(long teamId)
    {
        return View(teamId);
    }

    public IActionResult Minigame()
    {
        return View("~/Areas/Admin/Views/Euro2024Management/AdminMinigame.cshtml");
    }

    [HttpPost]
    public async Task<ActionResult> GetPlayerGrid(long teamId)
    {
        var teams = await euro2024Service.GetTeamPlayerById(teamId);
        return PartialView("_TeamPlayerGrid", teams);
    }
    [HttpPost]
    public async Task<ActionResult> CreatePlayer(CreatTeamModel param)
    {
        var icon = "";
        if (param.Icon != null)
        {
            var uploadResult = await fileService.UploadFileAsync(param.Icon, UploadDir.PlayerUploadFolder);
            icon = uploadResult.IsSuccessful ? uploadResult.AbsoluteUrl : icon;
        }
        var cmd = new CreateTeamPlayerCommand
        {
            TeamId = param.TeamId,
            PlayerName = param.PlayerName,
            PlayerFullName = param.PlayerFullName,
            Birthday = param.Birthday,
            ShirtNumber = param.ShirtNumber,
            Club = param.Club,
            Position = param.Position,
            Icon = icon
        };
        var result = await euro2024Service.CreatePlayerAsync(cmd);
        return Json(result);
    }

    [HttpGet]
    public async Task<ActionResult> EditPlayer(long playerId)
    {
        var player = await euro2024Service.GetPlayerById(playerId);
        if(player == null)
        {
            return Json(null);
        }
        return PartialView("_EditTeamPlayerGrid", player);
    }

    [HttpPost]
    public async Task<ActionResult> EditPlayer(UpdateTeamModel param)
    {
        var player = await euro2024Service.GetPlayerById(param.PlayerId);
        var icon = param.IsDeletedIcon ? null : player.Icon;
        if (param.Icon != null)
        {
            var uploadResult = await fileService.UploadFileAsync(param.Icon, UploadDir.PlayerUploadFolder);
            fileService.DeleteFile(player.Icon, UploadDir.PlayerUploadFolder);
            icon = uploadResult.IsSuccessful ? uploadResult.AbsoluteUrl : icon;
        }
        var cmd = new UpdateTeamPlayerCommand
        {
            PlayerId = param.PlayerId,
            PlayerName = param.PlayerName,
            PlayerFullName = param.PlayerFullName,
            Birthday = param.Birthday,
            ShirtNumber = param.ShirtNumber,
            Club = param.Club,
            Position = param.Position,
            Icon = icon
        };
        var result = await euro2024Service.UpdatePlayerAsync(cmd);
        return Json(result);
    }

    [HttpPost]
    public async Task<ActionResult> DeletePlayer(long playerId)
    {
        var player = await euro2024Service.GetPlayerById(playerId);
        if(!string.IsNullOrEmpty(player.Icon))
        {
            fileService.DeleteFile(player.Icon, UploadDir.PlayerUploadFolder);
        }
        var result = await euro2024Service.DeletePlayerAsync(playerId);
        return Json(result);
    }


    public async Task<ActionResult> UpdatePoll(long pollId)
    {
        var result = await optionService.UpdateOptionAsync(Euro2024.PollKey, pollId.ToString());
        return Json(result);
    }

    public async Task<ActionResult> GetDataMinigame(UserFilterMembershipEventModel model)
    {
        var criteria = new GetLeagueMinigameByStageCriteria
        {
            Stage = model.Stage,
            LeagueId = Euro2024.LeagueId,
            SeasonId = Euro2024.SeasonId
        };
        var miniGames = await dataControlService.GetMinigameWithEmailByStage(criteria);
        var data = await dataControlService.GetMatchBySeasonAsync(Euro2024.LeagueId, Euro2024.SeasonId);
        var matches =  new List<Match>();
        matches = model.Stage == Euro2024.MinigameStage1 
            ? data.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId).ToList() 
            : data.Matches.Where(m => m.Stage.StageId >= Euro2024.EightTeamStage).ToList();
        miniGames = EuroHelper.CalculatorPointer(matches, miniGames);
        var minigameStanding = new List<MinigameModel>();
        minigameStanding = !string.IsNullOrEmpty(model.DateSort) 
            ? SortMinigameStanding(miniGames.ToList(), model) 
            : miniGames.Skip(model.PageSize * (model.Page - 1)).Take(model.PageSize).ToList();
        var viewModel = new AdminMinigameGridViewModel
        {
            MiniGames = minigameStanding,
            DateSort = model.DateSort,
            Paging = new PagingModel
            {
                CurrentPage = model.Page,
                PageSize = model.PageSize,
                TotalPages = (int)Math.Ceiling(miniGames.Count / (double)model.PageSize)
            }
        };
        return PartialView("_MinigameDataGrid", viewModel);
    }

    public async Task<ActionResult> GetDetailUser(ManagementDetailMinigameViewModel param)
    {
        var criteriaVotesUser = new GetLeagueMinigameByUserStageCriteria
        {
            Stage = param.StageDetail,
            UserId = param.UserId,
            LeagueId = Euro2024.LeagueId,
            SeasonId = Euro2024.SeasonId
        };
        var data = await dataControlService.GetMatchBySeasonAsync(Euro2024.LeagueId, Euro2024.SeasonId);
        var matches = data.Matches.Where(m => m.Stage.StageId == Euro2024.GroupStageId || m.Stage.StageId >= Euro2024.EightTeamStage).ToList();
        var votes = await euro2024Service.GetLeagueMinigameByUserStageAsync(criteriaVotesUser);
        foreach (var vote in votes)
        {
            var matchVote = matches.Find(m => m.MatchId == vote.MatchId);
            var (_, score) = EuroHelper.GetVoteResult(matchVote, vote);
            vote.Point = score;
        }
        var viewModel = new AdminDetailMinigameViewModel
        {
            Rank = param.Rank,
            Totalpoint = param.Totalpoint,
            Votes = votes,
            StageDetail = param.StageDetail,
            Matches = matches,
            Email = param.Email,
            Username = param.Username
        };
        return PartialView("_DetailPlayerVotes", viewModel);
    }

    public List<MinigameModel> SortMinigameStanding(List<MinigameModel> minigameData, UserFilterMembershipEventModel model)
    {
        var result = new List<MinigameModel>();
        if (model.DateSort == SortDesc)
        {
            result = minigameData.OrderByDescending(x => x.CreatedDate).Skip(model.PageSize * (model.Page - 1)).Take(model.PageSize).ToList();
        }
        if (model.DateSort == SortAsc)
        {
            result = minigameData.OrderBy(x => x.CreatedDate).Skip(model.PageSize * (model.Page - 1)).Take(model.PageSize).ToList();
        }
        return result;
    }
}