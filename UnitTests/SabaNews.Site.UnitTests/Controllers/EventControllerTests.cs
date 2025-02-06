
namespace SabaNews.Site.UnitTests.Controllers;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.User;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Controllers.Event;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class EventControllerTests : Controller
{
    private ISessionService sessionService;
    private IUserService userService;
    private IConfiguration configuration;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task MembershipEvent_WhenIsNotAuthenticated_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = null;

        //Act
        var result = await controller.MembershipEvent();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<MembershipEventViewModel>(viewResult.Model);
        Assert.False(viewModel.IsLogin);
        Assert.False(viewModel.IsAdmin);
    }

    [Fact]
    public async Task MembershipEvent_WhenIsAuthenticated_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = new UserSession { Id = 1, Metadata = "roleadministrator" };
        var criteria = fixture.Create<GetDetailMembershipEventCriteria>();
        var expected = fixture.Create<MembershipEventModel>();
        userService.GetDetailMembershipEventDataAsync(Arg.Do<GetDetailMembershipEventCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var result = await controller.MembershipEvent();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<MembershipEventViewModel>(viewResult.Model);
        Assert.True(viewModel.IsLogin);
        Assert.True(viewModel.IsAdmin);
        Assert.Equal(expected, viewModel.MembershipEventDetail);
    }

    [Fact]
    public void  MembershipEventResult_WhenIsNotAuthenticated_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = null;

        //Act
        var result = controller.MembershipEventResult();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<MembershipEventViewModel>(viewResult.Model);
        Assert.False(viewModel.IsLogin);
        Assert.False(viewModel.IsAdmin);
    }

    [Fact]
    public void MembershipEventResult_WhenIsAuthenticated_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = new UserSession { Id = 1, Metadata = "roleadministrator" };

        //Act
        var result = controller.MembershipEventResult();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<MembershipEventViewModel>(viewResult.Model);
        Assert.True(viewModel.IsLogin);
        Assert.True(viewModel.IsAdmin);
    }


    [Fact]
    public async Task GetMembershipEventData_WhenIsNotAuthenticated_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<UserFilterMembershipEventModel>();
        var criteria = fixture.Create<GetMembershipEventDataCriteria>();
        var expected = fixture.Create<IEnumerable<MembershipEventModel>>();

        userService.GetUserMembershipEventDataAsync(Arg.Do<GetMembershipEventDataCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var result = await controller.GetMembershipEventData(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsType<MembershipEventGridViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Users);
    }

    [Fact]
    public async Task CreateMembershipEventData_WhenIsNotAuthenticated_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var luckynumber = fixture.Create<string>();
        //Act
        var result = await controller.CreateMembershipEventData(luckynumber);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var data = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.False(data.IsSuccessful);
    }

    [Fact]
    public async Task CreateMembershipEventData_WhenAuthenticated_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        sessionService.User = new UserSession { Id = 1, Metadata = "roleadministrator" };
        var luckynumber = fixture.Create<string>();
        var cmd = fixture.Create<CreateUserMembershipEventDataCommand>();
        var expectedResult = fixture.Create<CommandResult>();

        userService.CreateUserMembershipEventDataAsync(Arg.Do<CreateUserMembershipEventDataCommand>(x => cmd = x)).Returns(expectedResult);

        //Act
        var result = await controller.CreateMembershipEventData(luckynumber);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var data = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedResult, data);
    }


    #region Helpers
    private MemberEventController GetController()
    {
        sessionService = Substitute.For<ISessionService>();
        userService = Substitute.For<IUserService>();
        configuration = Substitute.For<IConfiguration>();
        var controller = new MemberEventController(sessionService, userService, configuration);

        return controller;
    }

    #endregion Helpers
}