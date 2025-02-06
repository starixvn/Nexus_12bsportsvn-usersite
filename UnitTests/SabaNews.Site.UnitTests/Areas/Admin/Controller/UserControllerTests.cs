namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Criteria.User;
using SabaNews.Models.User;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class UserControllerTests : AdminController
{
    private IUserService userSerive;
    private IExportExcelService excelService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void Index_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();

        //Act
        var actual = controller.Index();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<UserFilterViewModel>(viewResult.Model);
        Assert.Equal(DateTime.Now.Date, viewModel.ToDate.Date);
    }

    [Fact]
    public async Task GetDataUser_SearchIsNotNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<UserFilterViewModel>();
        var criteria = fixture.Create<GetUserReportCriteria>();
        var expected = fixture.Create<IEnumerable<UserReportModel>>();

        userSerive.GetUserReportAsync(Arg.Do<GetUserReportCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await controller.GetDataUser(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<UserGridViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Users);
        Assert.Equal("_UserDataGrid", viewResult.ViewName);
        Assert.Equal(param.Search, criteria.Search);
    }

    [Fact]
    public async Task GetDataUser_SearchIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<UserFilterViewModel>();
        var criteria = fixture.Create<GetUserReportCriteria>();
        var expected = fixture.Create<IEnumerable<UserReportModel>>();
        param.Search = null;

        userSerive.GetUserReportAsync(Arg.Do<GetUserReportCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await controller.GetDataUser(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<UserGridViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Users);
        Assert.Equal("_UserDataGrid", viewResult.ViewName);
        Assert.Equal(string.Empty, criteria.Search);
    }

    [Fact]
    public async Task GetDataUser_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<UserFilterViewModel>();
        var criteria = fixture.Create<GetUserReportCriteria>();
        var expected = fixture.Create<IEnumerable<UserReportModel>>();
        param.Search = null;

        userSerive.GetUserReportAsync(Arg.Do<GetUserReportCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await controller.GetDataUser(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<UserGridViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Users);
        Assert.Equal("_UserDataGrid", viewResult.ViewName);
        Assert.Equal(string.Empty, criteria.Search);
    }

    [Fact]
    public async Task ExportExcel_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<UserFilterViewModel>();
        var criteria = fixture.Create<GetUserReportCriteria>();
        var expected = fixture.Create<IEnumerable<UserReportModel>>();
        var excelModel = fixture.Create<IEnumerable<UserReportModel>>();
        param.Search = null;

        userSerive.GetUserReportAsync(Arg.Do<GetUserReportCriteria>(x => criteria = x)).Returns(expected);

        var expectedExcelResult = fixture.Create<byte[]>();
        excelService.ExportUser(Arg.Do<IEnumerable<UserReportModel>>(x => excelModel = x)).Returns(expectedExcelResult);
        //Act
        var result = await controller.ExportExcel(param) as FileContentResult;

        // Assert
        Assert.Equal(expectedExcelResult, result.FileContents);
        Assert.Equal("application/xlsx", result.ContentType);
        Assert.Equal("UserReport.xlsx", result.FileDownloadName);
    }



    #region Helpers
    private UserController GetController()
    {
        userSerive = Substitute.For<IUserService>();
        excelService = Substitute.For<IExportExcelService>();
        var controller = new UserController(userSerive, excelService);

        return controller;
    }
    #endregion Helpers
}