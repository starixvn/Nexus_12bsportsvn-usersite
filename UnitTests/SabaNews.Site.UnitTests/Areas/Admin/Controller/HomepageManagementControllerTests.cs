namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using NSubstitute;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using SabaNews.Models.Options;
using AutoFixture;
using System.Collections.Generic;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Services.Criteria.League;
using SabaNews.Models.Home;
using SabaNews.Core.Helper;
using System.Threading.Tasks;
using SabaNews.Core.Models;
using SabaNews.Core.Constants;
using SabaNews.Models;
using System.Linq;
using SabaNews.Models.Categories;
using Newtonsoft.Json;
using SabaNews.Core.Services;
using SabaNews.Livescore.Services.Interfaces;
using SabaNews.Models.Poll;
using SabaNews.Models.ViewModel.Poll;

public class HomepageManagementControllerTests : AdminController
{
    private IOptionService optionService;
    private ILeagueService leagueService;
    private ISessionService sessionService;
    private readonly IFixture fixture = new Fixture();
    private IPostService postService;
    private IDataControlService dataControlService;
    private IPollService pollService;
    private readonly Option option = new()
    {
        OptionId = 0,
        OptionName = "football_news_categories",
        OptionValue = "[{\"Category\":\"World Cup\",\"Id\":1,\"Slug\":\"world-cup\",\"Url\":\"/tin-the-thao/bong-da/quoc-te/world-cup\",\"CreatedDate\":\"2023-01-31T07:16:31.8439748Z\"},{\"Category\":\"La Liga\",\"Id\":2,\"Slug\":\"la-liga\",\"Url\":\"/tin-the-thao/bong-da/tay-ban-nha/la-liga\",\"CreatedDate\":\"2023-01-31T06:45:02.7067665Z\"},{\"Category\":\"T�y Ban Nha\",\"Id\":3,\"Slug\":\"tay-ban-nha\",\"Url\":\"/tin-the-thao/bong-da/tay-ban-nha\",\"CreatedDate\":\"2023-01-31T07:32:57.3471868Z\"}]"
    };

    [Fact]
    public void Fixture_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.Fixture();

        // Assert
        Assert.IsType<ViewResult>(result);
    }

    [Fact]
    public void Standing_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.Standing();

        // Assert
        Assert.IsType<ViewResult>(result);
    }

    [Fact]
    public async Task  Poll_WhenOptionValueIsNull_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        Option option = null;
        var expectedPolls = fixture.Create<IList<QuestionModel>>();
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        pollService.GetAllPollAsync().Returns(expectedPolls);

        //Act
        var result = await controller.Poll();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<PollAdminViewModel>(viewResult.Model);
        Assert.Equal(0, viewModel.SelectedQuestId);
        Assert.Equal("-------", viewModel.SelectedQuest);
    }

    [Fact]
    public async Task  Poll_WhenHaveOptionValue_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        var option = new Option{
            OptionId = 1,
            OptionValue = "1"
        };
        var expectedPolls = fixture.Create<IList<QuestionModel>>();
        expectedPolls.Add(new QuestionModel {Id = 1, Question = "Who is win?"});
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        pollService.GetAllPollAsync().Returns(expectedPolls);

        //Act
        var result = await controller.Poll();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<PollAdminViewModel>(viewResult.Model);
        Assert.Equal(1, viewModel.SelectedQuestId);
        Assert.Equal("Who is win?", viewModel.SelectedQuest);
    }

    [Fact]
    public async Task  GetLeagueGrid_WhenHaveOption_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var option = new Option
        {
            OptionId = 1,
            OptionValue = "[{\"Id\":3,\"LeagueId\":12002,\"Order\":1}]"
        };
        var expectedLeagues = fixture.Create<IList<League>>();
        Helper.ParseJsonToList<FixtureHomepage>(option.OptionValue);
        var criteria = fixture.Create<GetLeagueByIdsCriteria>();
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        leagueService.GetLeagueByIdsAsync(Arg.Do<GetLeagueByIdsCriteria>(x => x = criteria)).Returns(expectedLeagues);

        //Act
        var result = await controller.GetLeagueGrid(true);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<FixtureGridViewModel>(viewResult.Model);
        Assert.Equal(expectedLeagues, viewModel.Leagues);
    }

    [Fact]
    public async Task  GetLeagueGrid_WhenOptionIsEmpty_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        Option option = null;
        var expectedLeagues = fixture.Create<IList<League>>();
        Helper.ParseJsonToList<FixtureHomepage>(null);
        var criteria = fixture.Create<GetLeagueByIdsCriteria>();
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        leagueService.GetLeagueByIdsAsync(Arg.Do<GetLeagueByIdsCriteria>(x => x = criteria)).Returns(expectedLeagues);

        //Act
        var result = await controller.GetLeagueGrid(true);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<FixtureGridViewModel>(viewResult.Model);
        Assert.Null(viewModel.Leagues);
    }

    [Fact]
    public async Task  GetLeagueToAdd_WhenListLeagueHaveData_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var option = new Option
        {
            OptionId = 1,
            OptionValue = "[{\"Id\":3,\"LeagueId\":12002,\"Order\":1,\"CreatedDate\":\"2023-01-13T02:53:27.3769721Z\"}]"
        };
        var expectedLeagues = fixture.Create<IList<League>>();
        Helper.ParseJsonToList<FixtureHomepage>(option.OptionValue);
        fixture.Create<GetLeagueByIdsCriteria>();
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        leagueService.GetLeaguesAsync().Returns(expectedLeagues);

        //Act
        var result = await controller.GetLeagueToAdd(false);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IList<League>>(viewResult.Model);
        Assert.Equal(expectedLeagues, viewModel);
    }

    [Fact]
    public async Task  GetLeagueToAdd_WhenListLeagueIsEmpty_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var option = new Option();
        var expectedLeagues = fixture.Create<IList<League>>();
        Helper.ParseJsonToList<FixtureHomepage>(option.OptionValue);
        fixture.Create<GetLeagueByIdsCriteria>();
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        leagueService.GetLeaguesAsync().Returns(expectedLeagues);

        //Act
        var result = await controller.GetLeagueToAdd(false);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IList<League>>(viewResult.Model);
        Assert.Equal(expectedLeagues, viewModel);
    }

    [Fact]
    public async Task  AddLeague_WhenListLeagueIsEmpty_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<UpdateFixtureModel>();
        var expectedLeagues = fixture.Create<IList<League>>();
        Option expectedOption = null;
        var expectedResult = fixture.Create<CommandResult>();
        fixture.Create<GetLeagueByIdsCriteria>();
        sessionService.User.Returns(new UserSession{ Id = 1 });
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(expectedOption);
        leagueService.GetLeaguesAsync().Returns(expectedLeagues);
        optionService.UpdateOptionAsync(Arg.Do<string>(x => x = "key"), Arg.Do<string>(x => x = "value"), Arg.Do<long>(x => x = 1)).Returns(expectedResult);

        //Act
        var result = await controller.AddLeague(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedResult, jsonResult.Value);
    }

    [Fact]
    public async Task  AddLeague_WhenLeagueExisted_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<UpdateFixtureModel>();
        model.LeagueId = 12002;
        var option = new Option
        {
            OptionId = 1,
            OptionValue = "[{\"Id\":3,\"LeagueId\":12002,\"Order\":1,\"CreatedDate\":\"2023-01-13T02:53:27.3769721Z\"}]"
        };
        Helper.ParseJsonToList<FixtureHomepage>(option.OptionValue);
        var expectedLeagues = fixture.Create<IList<League>>();
        fixture.Create<GetLeagueByIdsCriteria>();
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        leagueService.GetLeaguesAsync().Returns(expectedLeagues);

        //Act
        var result = await controller.AddLeague(model);

        // Assert
        Assert.IsType<JsonResult>(result);
    }

    [Fact]
    public async Task  AddLeague_WhenLeagueNotExisted_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<UpdateFixtureModel>();
        var option = new Option
        {
            OptionId = 1,
            OptionValue = "[{\"Id\":3,\"LeagueId\":12002,\"Order\":1,\"CreatedDate\":\"2023-01-13T02:53:27.3769721Z\"}]"
        };
        Helper.ParseJsonToList<FixtureHomepage>(option.OptionValue);
        var expectedLeagues = fixture.Create<IList<League>>();
        var expectedResult = fixture.Create<CommandResult>();
        fixture.Create<GetLeagueByIdsCriteria>();
        sessionService.User.Returns(new UserSession{ Id = 1 });
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        leagueService.GetLeaguesAsync().Returns(expectedLeagues);
        optionService.UpdateOptionAsync(Arg.Do<string>(x => x = "key"), Arg.Do<string>(x => x = "value"), Arg.Do<long>(x => x = 1)).Returns(expectedResult);
        //Act
        var result = await controller.AddLeague(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedResult, jsonResult.Value);
    }


    [Fact]
    public async Task  EditLeague_WhenLeagueHaveData_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var option = new Option
        {
            OptionId = 1,
            OptionValue = "[{\"Id\":1,\"LeagueId\":12002,\"Order\":1}, {\"Id\":2,\"LeagueId\":12003,\"Order\":2}]"
        };
        Helper.ParseJsonToList<FixtureHomepage>(option.OptionValue);
        fixture.Create<IList<League>>();
        var expectedResult = fixture.Create<CommandResult>();
        fixture.Create<GetLeagueByIdsCriteria>();
        sessionService.User.Returns(new UserSession{ Id = 1 });
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        optionService.UpdateOptionAsync(Arg.Do<string>(x => x = "key"), Arg.Do<string>(x => x = "value"), Arg.Do<long>(x => x = 1)).Returns(expectedResult);
        //Act
        var result = await controller.DeleteLeague(1, true);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedResult, jsonResult.Value);
    }

    [Fact]
    public async Task  EditLeague_WhenLeagueIsEmpty_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        Option option = null;
        Helper.ParseJsonToList<FixtureHomepage>(null);
        fixture.Create<IList<League>>();
        var expectedResult = fixture.Create<CommandResult>();
        fixture.Create<GetLeagueByIdsCriteria>();
        sessionService.User.Returns(new UserSession{ Id = 1 });
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        optionService.UpdateOptionAsync(Arg.Do<string>(x => x = "key"), Arg.Do<string>(x => x = "value"), Arg.Do<long>(x => x = 1)).Returns(expectedResult);
        //Act
        var result = await controller.DeleteLeague(1, true);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedResult, jsonResult.Value);
    }


    [Fact]
    public async Task  DeleteLeague_WhenLeagueNotExisted_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var model = new UpdateFixtureModel{Id = 1, Order = 1, SeasonId = 1};
        var option = new Option
        {
            OptionId = 1,
            OptionValue = "[{\"Id\":1,\"LeagueId\":12002,\"Order\":1}, {\"Id\":2,\"LeagueId\":12003,\"Order\":2}]"
        };
        Helper.ParseJsonToList<FixtureHomepage>(option.OptionValue);
        fixture.Create<IList<League>>();
        var expectedResult = fixture.Create<CommandResult>();
        fixture.Create<GetLeagueByIdsCriteria>();
        sessionService.User.Returns(new UserSession{ Id = 1 });
        optionService.GetOptionAsync(Arg.Do<string>(x => x = "key")).Returns(option);
        optionService.UpdateOptionAsync(Arg.Do<string>(x => x = "key"), Arg.Do<string>(x => x = "value"), Arg.Do<long>(x => x = 1)).Returns(expectedResult);
        //Act
        var result = await controller.EditLeague(model);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expectedResult, jsonResult.Value);
    }

       

    [Fact]
    public void FootballNews_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.FootBall();

        // Assert
        Assert.IsType<ViewResult>(result);
    }

    [Fact]
    public async Task GetDataFootBallGrid_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();

        optionService.GetOptionAsync(OptionKey.FootballNewsCategories).Returns(option);

        //Act
        var result = await controller.GetDataFootBallGrid();

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Areas/Admin/Views/HomepageManagement/FootballNews/_FootballNewsDataGrid.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task EditCategory_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();
        var menuName = "menu";
        var menus = new Fixture().Create<IEnumerable<Menu>>();
        optionService.GetOptionAsync(OptionKey.FootballNewsCategories).Returns(option);

        dataControlService.GetMenuData(Arg.Do<string>(x => x = menuName)).Returns(menus);
        //Act
        var result = await controller.EditCategory(1);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        Assert.Equal("~/Areas/Admin/Views/HomepageManagement/FootballNews/_EditFootBall.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetSlugs_WhenCalled_ReturnExpectedJson()
    {
        // Arrange
        var controller = GetController();
        var menuName = "Menu name";
        var menus = new Fixture().Create<IEnumerable<Menu>>();
        dataControlService.GetMenuData(Arg.Do<string>(x => x = menuName)).Returns(menus);
        //Act
        var result = await controller.GetSlugs(menus.First().Slug);

        // Assert
        var viewResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(menus.First(), viewResult.Value);
    }

    [Fact]
    public async Task EditCategory_WhenCalled_ReturnExpectedJson()
    {
        // Arrange
        var controller = GetController();
        var menuName = "MenuName";
        var menus = new Fixture().Create<IEnumerable<Menu>>();
        var cateParents = new Fixture().Create<IList<CategoryGeneral>>();
        var cmd = new Fixture().Create<CommandResult>();
        var categoryUpdate = new Fixture().Create<FootballNewsHomePage>();

        var footballNewsCategories = Helper.ParseJsonToList<FootballNewsHomePage>(option?.OptionValue);

        footballNewsCategories[0] = categoryUpdate;
        sessionService.User.Returns(new UserSession{ Id = 1 });
        optionService.GetOptionAsync(OptionKey.FootballNewsCategories).Returns(option);
        dataControlService.GetMenuData(Arg.Do<string>(x => x = menuName)).Returns(menus);
        postService.GetCateParentsAsync(menus.First().Slug).Returns(cateParents);
        optionService.UpdateOptionAsync(OptionKey.FootballNewsCategories, JsonConvert.SerializeObject(footballNewsCategories)).Returns(cmd);

        //Act
        var result = await controller.EditCategory(menus.First().Slug, 1, "name");

        // Assert
        Assert.IsType<JsonResult>(result);
    }

    #region Helpers
    private HomepageManagementController GetController()
    {
        leagueService = Substitute.For<ILeagueService>();
        optionService = Substitute.For<IOptionService>();
        postService = Substitute.For<IPostService>();
        dataControlService = Substitute.For<IDataControlService>();
        sessionService = Substitute.For<ISessionService>();
        pollService = Substitute.For<IPollService>();
        var controller = new HomepageManagementController(optionService, leagueService, postService, dataControlService, sessionService, pollService);

        return controller;
    }

    #endregion Helpers
}