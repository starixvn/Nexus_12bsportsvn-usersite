namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Models.Home;
using SabaNews.Models.ViewModel.Poll;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SabaNews.Livescore.Services.Interfaces;

public class HomepageManagementController(
    IOptionService optionService,
    ILeagueService leagueService,
    IPostService postService,
    IDataControlService dataControlService,
    ISessionService sessionService,
    IPollService pollService)
    : AdminController
{
    public ActionResult Fixture()
    {
        return View();
    }

    public ActionResult Standing()
    {
        return View();
    }

    public async Task<ActionResult> Poll()
    {
        var polls = await pollService.GetAllPollAsync();
        var currentQuestion = await optionService.GetOptionAsync(OptionKey.PollHomepage);
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
    [HttpPost]
    public async Task<ActionResult> GetLeagueGrid(bool isFixtureOption)
    {
        var optionKey = GetKeyOption(isFixtureOption);
        var option = await optionService.GetOptionAsync(optionKey);
        var listFixture = Helper.ParseJsonToList<FixtureHomepage>(option?.OptionValue);
        var model = new FixtureGridViewModel { ListFixture = listFixture };
        if (listFixture.Any())
        {
            var leagueIds = listFixture.Select(item => item.LeagueId).ToArray();
            var leagueIdsJson = JsonConvert.SerializeObject(leagueIds);
            var leagues = await leagueService.GetLeagueByIdsAsync(new GetLeagueByIdsCriteria { LeagueIds = leagueIdsJson });
            model.Leagues = leagues;
        }
        return PartialView("_LeagueGrid", model);

    }

    [HttpPost]
    public async Task<ActionResult> GetLeagueToAdd(bool isFixtureOption)
    {
        var optionKey = GetKeyOption(isFixtureOption);
        var leagues = await leagueService.GetLeaguesAsync();
        var option = await optionService.GetOptionAsync(optionKey);
        var listFixture = Helper.ParseJsonToList<FixtureHomepage>(option?.OptionValue);
        var maxOrder = listFixture.Any() ? listFixture.Max(item => item.Order) : 1;
        ViewBag.Order = maxOrder + 1;
        return PartialView("_AddLeague", leagues);
    }

    [HttpPost]
    public async Task<ActionResult> AddLeague(UpdateFixtureModel model)
    {
        var optionKey = GetKeyOption(model.IsFixtureOption);
        var result = await optionService.GetOptionAsync(optionKey);
        var listFixture = Helper.ParseJsonToList<FixtureHomepage>(result?.OptionValue);
        if (listFixture.Any())
        {
            var index = listFixture.FindIndex(item => item.LeagueId == model.LeagueId);
            if (index >= 0)
            {
                return Json(new CommandResult { Message = Message.DuplicateHomepageFixture });
            }
            var listDataAdd = HandleOrder(listFixture, model.Order);
            var maxId = listFixture.Max(item => item.Id);
            listDataAdd.Add(new FixtureHomepage
            {
                Id = maxId + 1,
                LeagueId = model.LeagueId,
                SeasonId = model.SeasonId,
                Order = model.Order,
                CreatedDate = DateTimeUtilize.UtcNow()

            });
            listFixture = listDataAdd;
        }
        else
        {
            listFixture.Add(new FixtureHomepage
            {
                Id = 1,
                LeagueId = model.LeagueId,
                SeasonId = model.SeasonId,
                Order = model.Order,
                CreatedDate = DateTimeUtilize.UtcNow()
            });
        }
        listFixture = listFixture.OrderBy(item => item.Order).ToList();
        var listFixtureJson = JsonConvert.SerializeObject(listFixture);
        var cmdResult = await optionService.UpdateOptionAsync(optionKey, listFixtureJson, sessionService.User.Id);
        return Json(cmdResult);
    }

    [HttpPost]
    public async Task<ActionResult> GetLeagueToEdit(int id, bool isFixtureOption)
    {
        var optionKey = GetKeyOption(isFixtureOption);
        var option = await optionService.GetOptionAsync(optionKey);
        var listFixture = Helper.ParseJsonToList<FixtureHomepage>(option?.OptionValue);
        var lastFixture = listFixture.LastOrDefault();
        var maxPriority = lastFixture?.Order ?? 1;
        var fixture = listFixture.Find(item => item.Id == id);
        var seasons = await leagueService.GetSeasonByLeagueIdAsync(fixture.LeagueId);
        var league = await leagueService.GetLeagueByIdAsync(fixture.LeagueId);
        var model = new FixtureEditViewModel { League = league, Seasons = seasons, Fixture = fixture, MaxPriority = maxPriority };
        return PartialView("_EditLeague", model);
    }

    [HttpPost]
    public async Task<ActionResult> EditLeague(UpdateFixtureModel model)
    {
        var optionKey = GetKeyOption(model.IsFixtureOption);
        var option = await optionService.GetOptionAsync(optionKey);
        var listFixture = Helper.ParseJsonToList<FixtureHomepage>(option?.OptionValue);
        var fixture = listFixture.Find(item => item.Id == model.Id);
        var newListFixture = listFixture.Where(item => item.Id != model.Id).ToList();
        var listDataEdit = HandleOrder(newListFixture, model.Order);
        listDataEdit.Add(new FixtureHomepage
        {
            Id = fixture.Id,
            LeagueId = fixture.LeagueId,
            SeasonId = fixture.SeasonId,
            Order = model.Order,
            CreatedDate = fixture.CreatedDate
        });
        listDataEdit = listDataEdit.OrderBy(item => item.Order).ToList();
        var listFixtureJson = JsonConvert.SerializeObject(listDataEdit);
        var cmdResult = await optionService.UpdateOptionAsync(optionKey, listFixtureJson, sessionService.User.Id);
        return Json(cmdResult);
    }

    [HttpPost]
    public async Task<ActionResult> DeleteLeague(int id, bool isFixtureOption)
    {
        var optionKey = GetKeyOption(isFixtureOption);
        var option = await optionService.GetOptionAsync(optionKey);
        var listFixture = Helper.ParseJsonToList<FixtureHomepage>(option?.OptionValue);
        var newListFixture = listFixture.Where(item => item.Id != id).ToList();
        var listDataRemove = HandleOrder(newListFixture, 0);
        var listFixtureJson = JsonConvert.SerializeObject(listDataRemove);
        var cmdResult = await optionService.UpdateOptionAsync(optionKey, listFixtureJson, sessionService.User.Id);
        return Json(cmdResult);
    }

    public IActionResult FootBall()
    {
        return View("~/Areas/Admin/Views/HomepageManagement/FootballNews/Index.cshtml");
    }

    public async Task<ActionResult> GetDataFootBallGrid()
    {
        var option = await optionService.GetOptionAsync(OptionKey.FootballNewsCategories);
        var footballNewsCategories = Helper.ParseJsonToList<FootballNewsHomePage>(option?.OptionValue);
        return PartialView("~/Areas/Admin/Views/HomepageManagement/FootballNews/_FootballNewsDataGrid.cshtml", footballNewsCategories);
    }

    [HttpGet]
    public async Task<ActionResult> EditCategory(int count)
    {
        var menus = await dataControlService.GetMenuData(MenuType.DetailMenu);

        var option = await optionService.GetOptionAsync(OptionKey.FootballNewsCategories);
        var footballNewsCategories = Helper.ParseJsonToList<FootballNewsHomePage>(option?.OptionValue);
        ViewBag.SlugSelected = footballNewsCategories[count - 1].Slug;
        ViewBag.Count = count;
        ViewBag.CategoryName = footballNewsCategories[count - 1].Category;
        return PartialView("~/Areas/Admin/Views/HomepageManagement/FootballNews/_EditFootBall.cshtml", menus);
    }

    [HttpPost]
    public async Task<ActionResult> EditCategory(string category, int count, string categoryName)
    {
        var menus = await dataControlService.GetMenuData(MenuType.DetailMenu);
        var slug = menus.FirstOrDefault(x => x.Slug == category);
        var cateParents = await postService.GetCateParentsAsync(slug.Slug);

        var option = await optionService.GetOptionAsync(OptionKey.FootballNewsCategories);
        var footballNewsCategories = Helper.ParseJsonToList<FootballNewsHomePage>(option?.OptionValue);

        var categoryUpdate = new FootballNewsHomePage
        {
            Category = categoryName ?? slug.MenuTitle,
            Slug = slug.Slug,
            CreatedDate = DateTimeUtilize.UtcNow(),
            Url = PostHelper.GetCategoryLink(cateParents)

        };
        categoryUpdate.Url = categoryUpdate.Url[1..];

        footballNewsCategories[count - 1] = categoryUpdate;

        var cmdResult = await optionService.UpdateOptionAsync(OptionKey.FootballNewsCategories, JsonConvert.SerializeObject(footballNewsCategories), sessionService.User.Id);
        return Json(cmdResult);
    }

    public async Task<ActionResult> UpdatePoll(long pollId)
    {
        var result = await optionService.UpdateOptionAsync(OptionKey.PollHomepage, pollId.ToString());
        return Json(result);
    }

    public async Task<ActionResult> GetSlugs(string category)
    {
        var menus = await dataControlService.GetMenuData(MenuType.DetailMenu);
        var slug = menus.Where(x => x.Slug == category).ToList();
        return Json(slug[0]);
    }
        

    private static string GetKeyOption(bool isFixtureOption)
    {
        return isFixtureOption ? OptionKey.HompageFixture : OptionKey.HompageStanding;
    }

    public static List<FixtureHomepage> HandleOrder(List<FixtureHomepage> fixtures, int order)
    {
        var listResult = new List<FixtureHomepage>();
        var currentOrder = 1;
        foreach (var item in fixtures)
        {
            if (currentOrder == order)
            {
                ++currentOrder;
            }
            item.Order = currentOrder;
            listResult.Add(item);
            currentOrder++;
        }
        return listResult;
    }
}