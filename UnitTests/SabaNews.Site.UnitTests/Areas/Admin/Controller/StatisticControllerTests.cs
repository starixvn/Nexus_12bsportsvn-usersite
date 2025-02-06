namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Statistic;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class StatisticControllerTests : AdminController
{
    private IStatisticService statisticService;
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
        var viewModel = Assert.IsType<StatisticFilterViewModel>(viewResult.Model);
        Assert.Equal(DateTime.Now.Date, viewModel.ToDate.Date);
    }

    [Fact]
    public async Task PostViewStatistic_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var param = new StatisticFilterViewModel { FromDate = DateTime.Now, ToDate = DateTime.Now };
        var expected = fixture.Create<IEnumerable<PostStatisticInfo>>();

        statisticService.GetPostViewStatistic(Arg.Do<DateTime>(x => param.FromDate = x), Arg.Do<DateTime>(x => param.ToDate = x)).Returns(expected);
        //Act
        var actual = await controller.PostViewStatistic(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<PostViewStatisticModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.PostViewDetails);
    }

    [Fact]
    public void GetViewDetails_WhenParamIsNull_RedirectExpectedUrl()
    {
        // Arrange
        var controller = GetController();
        var isVideoDetails = fixture.Create<bool>();

        //Act
        var actual = controller.ViewDetails(null, isVideoDetails);

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(actual);
        Assert.Equal("Statistic", redirectResult.ControllerName);
        Assert.Equal("Index", redirectResult.ActionName);
    }

    [Fact]
    public void GetViewDetails_WhenIsVideoDetail_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var isVideoDetails = true;
        var createdDate = fixture.Create<DateTime>();

        //Act
        var actual = controller.ViewDetails(createdDate, isVideoDetails);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var title = Assert.IsAssignableFrom<string>(viewResult.ViewData["Title"]);
        Assert.Equal("Video Details", title);
    }

    [Fact]
    public void GetViewDetails_WhenIsArticleDetail_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var isVideoDetails = false;
        var createdDate = fixture.Create<DateTime>();

        //Act
        var actual = controller.ViewDetails(createdDate, isVideoDetails);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var title = Assert.IsAssignableFrom<string>(viewResult.ViewData["Title"]);
        Assert.Equal("Article Details", title);
    }

    [Fact]
    public async Task GetViewDetails_WhenIsVideo_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<ViewDetailsQueryViewModel>();
        param.IsVideo = true;
        var details = fixture.Create<IEnumerable<ViewDetails>>();
        var totalItems = fixture.Create<int>();
        var totalViews = fixture.Create<int>();
        var expected = new ValueTuple<IEnumerable<ViewDetails>, int, int>(details, totalItems, totalViews);

        statisticService.GetPostViewDetails(
            Arg.Do<DateTime>(x => param.CreatedDate = x),
            Arg.Do<bool>(x => param.IsVideo = x),
            Arg.Do<int>(x => param.PageIndex = x),
            Arg.Do<int>(x => param.PageSize = x),
            Arg.Do<string>(x => param.ViewSort = x),
            Arg.Do<string>(x => param.AuthorSort = x)
        ).Returns(expected);
        //Act
        var actual = await controller.GetViewDetails(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<ViewDetailsViewModel>(viewResult.Model);
        Assert.Equal(expected.Item1, viewModel.ViewDetails);
        Assert.Equal(expected.Item3, viewModel.TotalView);
        Assert.Equal("Videos", viewModel.Type);
        Assert.Equal("_ViewDetailsGrid", viewResult.ViewName);
    }

    [Fact]
    public async Task GetViewDetails_WhenIsArticle_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var param = fixture.Create<ViewDetailsQueryViewModel>();
        param.IsVideo = false;
        var details = fixture.Create<IEnumerable<ViewDetails>>();
        var totalItems = fixture.Create<int>();
        var totalViews = fixture.Create<int>();
        var expected = new ValueTuple<IEnumerable<ViewDetails>, int, int>(details, totalItems, totalViews);

        statisticService.GetPostViewDetails(
            Arg.Do<DateTime>(x => param.CreatedDate = x),
            Arg.Do<bool>(x => param.IsVideo = x),
            Arg.Do<int>(x => param.PageIndex = x),
            Arg.Do<int>(x => param.PageSize = x),
            Arg.Do<string>(x => param.ViewSort = x),
            Arg.Do<string>(x => param.AuthorSort = x)
        ).Returns(expected);
        //Act
        var actual = await controller.GetViewDetails(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(actual);
        var viewModel = Assert.IsType<ViewDetailsViewModel>(viewResult.Model);
        Assert.Equal(expected.Item1, viewModel.ViewDetails);
        Assert.Equal(expected.Item3, viewModel.TotalView);
        Assert.Equal("Articles", viewModel.Type);
        Assert.Equal("_ViewDetailsGrid", viewResult.ViewName);
    }

    #region Helpers
    private StatisticController GetController()
    {
        statisticService = Substitute.For<IStatisticService>();
           
        var controller = new StatisticController(statisticService);

        return controller;
    }
        
    #endregion Helpers
}