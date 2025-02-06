namespace SabaNews.Site.UnitTests.Controllers;

using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using Models.ViewModel.Euro2020;
using NSubstitute;
using SabaNews.Criteria.Posts;
using SabaNews.Models;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Core.Constants;
using SabaNews.Services.Interfaces;
using Xunit;
using SabaNews.Site.Controllers.Event;

public class Euro2020ControllerTests : Controller
{
    private IDataControlService dataControlService;
    private IPostService postService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task Index_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<Euro2020ViewModel>();
        dataControlService.GetEuro2020PageViewModel().Returns(expected);
        //Act
        var actual = await controller.Index();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<Euro2020ViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel);
    }

    [Fact]
    public async Task Team_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>(); 
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Team();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<CategoryViewModel>(viewResult.Model);
        expectedPosts = expectedPosts.OrderBy(item => item.PostExcerpt);
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
    }

    [Fact]
    public async Task Team_WhenHaveNoSeoTitle_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>();
        expectedCategory.SEOTitle = null;
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Team();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<CategoryViewModel>(viewResult.Model);
        expectedPosts = expectedPosts.OrderBy(item => item.PostExcerpt);
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
    }

    [Fact]
    public async Task Category_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var page = fixture.Create<int>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Category(slug, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<CategoryViewModel>(viewResult.Model);
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
    }

    [Fact]
    public async Task Category_WhenHaveNoSeoTitle_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var page = fixture.Create<int>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>();
        expectedCategory.SEOTitle = null;
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Category(slug, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<CategoryViewModel>(viewResult.Model);
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
    }

    [Fact]
    public async Task Category_WhenHaveNoPost_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var page = fixture.Create<int>();
        IEnumerable<Post> expectedPosts = new List<Post>();
        var expectedCategory = fixture.Create<Category>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Category(slug, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Video_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var page = fixture.Create<int>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Video(page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<CategoryViewModel>(viewResult.Model);
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
    }

    [Fact]
    public async Task Video_WhenHaveNoCateSeoTitle_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var page = fixture.Create<int>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>();
        expectedCategory.SEOTitle = null;
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Video(page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<CategoryViewModel>(viewResult.Model);
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
    }

    [Fact]
    public async Task Video_WhenHaveNoPost_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var page = fixture.Create<int>();
        IEnumerable<Post> expectedPosts = new List<Post>();
        var expectedCategory = fixture.Create<Category>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Video(page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Schedule_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Schedule();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<CategoryViewModel>(viewResult.Model);
        expectedPosts = expectedPosts.Where(item => item.PostExcerpt.Trim().ToLower(CultureInfo.InvariantCulture) != Constants.TemplatePost).OrderBy(item => item.PostDate).ToList();
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
    }

    [Fact]
    public async Task Schedule_WhenHaveNoCateSeoTitle_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        fixture.Create<int>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>();
        expectedCategory.SEOTitle = null;
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Schedule();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<CategoryViewModel>(viewResult.Model);
        expectedPosts = expectedPosts.Where(item => item.PostExcerpt.Trim().ToLower(CultureInfo.InvariantCulture) != Constants.TemplatePost).OrderBy(item => item.PostDate).ToList();
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
    }

    [Fact]
    public async Task Schedule_WhenHaveNoPost_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        fixture.Create<int>();
        IEnumerable<Post> expectedPosts = new List<Post>();
        var expectedCategory = fixture.Create<Category>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        //Act
        var actual = await controller.Schedule();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Ranking_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var type = fixture.Create<string>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>();
        var expectedDetail = fixture.Create<Post>();
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => slug = x), Arg.Do<string>(x => type = x)).Returns(expectedDetail);
        //Act
        var actual = await controller.Ranking();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<Euro2020RankingViewModel>(viewResult.Model);
        expectedPosts = expectedPosts.Where(item => item.PostExcerpt.Trim().ToLower(CultureInfo.InvariantCulture) != Constants.TemplatePost).OrderBy(item => item.PostDate).ToList();
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
        Assert.Equal(expectedDetail, viewModel.ThirdPlaceTable);
    }

    [Fact]
    public async Task Ranking_WhenHaveNoCateSeoTitle_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var model = fixture.Create<GetPostsByCateSlugCriteria>();
        var slug = fixture.Create<string>();
        var type = fixture.Create<string>();
        var expectedPosts = fixture.Create<IEnumerable<Post>>();
        var expectedCategory = fixture.Create<Category>();
        var expectedDetail = fixture.Create<Post>();
        expectedCategory.SEOTitle = null;
        postService.GetPostsByCateSlugAsync(Arg.Do<GetPostsByCateSlugCriteria>(x => model = x)).Returns(expectedPosts);
        postService.GetCateDetailAsync(Arg.Do<string>(x => slug = x)).Returns(expectedCategory);
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => slug = x), Arg.Do<string>(x => type = x)).Returns(expectedDetail);
        //Act
        var actual = await controller.Ranking();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<Euro2020RankingViewModel>(viewResult.Model);
        expectedPosts = expectedPosts.Where(item => item.PostExcerpt.Trim().ToLower(CultureInfo.InvariantCulture) != Constants.TemplatePost).OrderBy(item => item.PostDate).ToList();
        Assert.Equal(expectedPosts, viewModel.Posts);
        Assert.Equal(expectedCategory, viewModel.Category);
        Assert.Equal(expectedDetail, viewModel.ThirdPlaceTable);
    }

    [Fact]
    public async Task GetTabData_WhenPostsNotNull_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var type = fixture.Create<string>();
        var expectedDetail = fixture.Create<Post>();
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => slug = x), Arg.Do<string>(x => type = x)).Returns(expectedDetail);
        //Act
        var actual = await controller.GetTabData(slug);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var post = Assert.IsAssignableFrom<Post>(jsonResult.Value.GetType().GetProperty("data").GetValue(jsonResult.Value));
        var isSuccessful = Assert.IsAssignableFrom<bool>(jsonResult.Value.GetType().GetProperty("isSuccessful").GetValue(jsonResult.Value));
        Assert.Equal(expectedDetail, post);
        Assert.True(isSuccessful);
    }

    [Fact]
    public async Task GetTabData_WhenPostIsNull_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var type = fixture.Create<string>();
        Post expectedDetail = null;
        postService.GetPostDetailBySlugAsync(Arg.Do<string>(x => slug = x), Arg.Do<string>(x => type = x)).Returns(expectedDetail);
        //Act
        var actual = await controller.GetTabData(slug);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var isSuccessful = Assert.IsAssignableFrom<bool>(jsonResult.Value.GetType().GetProperty("isSuccessful").GetValue(jsonResult.Value));
        Assert.False(isSuccessful);
    }

    #region Helpers
    private Euro2020Controller GetController()
    {
        dataControlService = Substitute.For<IDataControlService>();
        postService = Substitute.For<IPostService>();
        var controller = new Euro2020Controller(postService, dataControlService);

        return controller;
    }

    #endregion Helpers
}