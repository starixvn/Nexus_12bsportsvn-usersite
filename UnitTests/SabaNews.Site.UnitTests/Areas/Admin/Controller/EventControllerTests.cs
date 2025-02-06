namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Criteria.User;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class EventControllerTests : AdminController
{
    private IUserService userSerive;
    private IExportExcelService excelService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void  MembershipEvent_WhenCalled_ReturnExpectedView()
    {
        // Arrange
        var controller = GetController();

        //Act
        var result = controller.MembershipEvent();

        // Assert
        Assert.IsType<ViewResult>(result);
    }

    [Fact]
    public async Task GetMembershipEventData_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<UserFilterMembershipEventModel>();
        var criteria = fixture.Create<GetMembershipEventDataCriteria>();
        var expected = fixture.Create<IEnumerable<MembershipEventModel>>();
        userSerive.GetUserMembershipEventDataAsync(Arg.Do<GetMembershipEventDataCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var result = await controller.GetMembershipEventData(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsType<MembershipEventGridViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Users);
    }


    [Fact]
    public async Task MembershipEventResult_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var resultNumber = fixture.Create<int>();
        var criteria = fixture.Create<GetMembershipEventResultCriteria>();
        var expected = fixture.Create<IEnumerable<MembershipEventModel>>();
        userSerive.GetMembershipEventResultAsync(Arg.Do<GetMembershipEventResultCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var result = await controller.MembershipEventResult(resultNumber);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<MembershipEventModel>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
    }


    [Fact]
    public async Task ExportExcel_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        fixture.Create<int>();
        var criteria = fixture.Create<GetMembershipEventDataCriteria>();
        var excelModel = fixture.Create<IEnumerable<MembershipEventModel>>();

        var expected = fixture.Create<IEnumerable<MembershipEventModel>>();
        var expectedExcelResult = fixture.Create<byte[]>();
        userSerive.GetUserMembershipEventDataAsync(Arg.Do<GetMembershipEventDataCriteria>(x => criteria = x)).Returns(expected);
        excelService.ExportMembershipEvent(Arg.Do<IEnumerable<MembershipEventModel>>(x => excelModel = x)).Returns(expectedExcelResult);
        //Act
        var result = await controller.ExportExcel() as FileContentResult;

        // Assert
        Assert.Equal(expectedExcelResult, result.FileContents);
        Assert.Equal("application/xlsx", result.ContentType);
        Assert.Equal("event.xlsx", result.FileDownloadName);
    }


    #region Helpers
    private EventController GetController()
    {
        userSerive = Substitute.For<IUserService>();
        excelService = Substitute.For<IExportExcelService>();
        var controller = new EventController(userSerive, excelService);

        return controller;
    }

    #endregion Helpers
}