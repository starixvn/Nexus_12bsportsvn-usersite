namespace SabaNews.Site.UnitTests.Controllers;

using System.Collections.Generic;
using AutoFixture;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Services.Interfaces;
using System.Threading.Tasks;
using Xunit;
using SabaNews.Core.Constants;
using SabaNews.Models.Posts;
using SabaNews.Models;
using SabaNews.Criteria.Posts;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Http;
using SabaNews.Models.Home;
using SabaNews.Core.Models;
using SabaNews.Models.Categories;
using Site.Controllers;

public class HomeControllerTests : Controller
{
    private IDataControlService dataControlService;
    private IPostService postService;
    private IConfiguration configuration;
    private IUserService userService;
    private IOptionService optionService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task Index_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var expectedViewModel = fixture.Create<PostViewModel>();
        dataControlService.GetHomePageViewModel().Returns(expectedViewModel);

        //Act
        var result = await controller.Index();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<PostViewModel>(viewResult.Model);
        Assert.Equal(expectedViewModel.Category.SEOTitle, viewModel.Header.Title);
    }

    [Fact]
    public async Task Index_WhenSeoTitleIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var expectedViewModel = fixture.Create<PostViewModel>();
        expectedViewModel.Category.SEOTitle = null;
        dataControlService.GetHomePageViewModel().Returns(expectedViewModel);

        //Act
        var result = await controller.Index();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<PostViewModel>(viewResult.Model);
        Assert.Equal(expectedViewModel.Category.Title, viewModel.Header.Title);
    }

    [Fact]
    public async Task Category_WhenOldSlug_RedirectToNewSlug()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var slug = "viet-nam" + CategoryKey.Suffix;

        //Act
        var result = await controller.Category(slug);

        // Assert
        var redirectResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal(CategoryKey.VNFootballSlug + CategoryKey.Suffix, redirectResult.Url);
    }

    [Fact]
    public async Task Category_WhenDataIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var slug = Constants.NewPostSlug + CategoryKey.Suffix;
        BlogViewModel expectedViewModel = null;
        fixture.Create<GetPostsByCateSlugsParam>();
        dataControlService.GetCategoryViewModel(Arg.Do<string>(x => slug = x)).Returns(expectedViewModel);

        //Act
        var result = await controller.Category(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Category_WhenIsPostAndIsRecentPage_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var slug = Constants.NewPostSlug + CategoryKey.Suffix;
        var expectedViewModel = fixture.Create<BlogViewModel>();
        expectedViewModel.IsVideo = false;
        var expectedMenu = new List<Menu> { new() { PostId = 1, CateSlug = "menu-1", ParentId = 2  } };
        fixture.Create<GetPostsByCateSlugsParam>();
        dataControlService.GetMenuData().Returns(expectedMenu);
        dataControlService.GetCategoryViewModel(Arg.Do<string>(x => slug = x)).Returns(expectedViewModel);

        //Act
        var result = await controller.Category(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(Constants.CategoryView, viewResult.ViewName);
    }

    [Fact]
    public async Task Category_WhenIsPostAndIsSubCommentaryCate_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var menuName = "Menu";
        var slug = "dt-viet-nam" + CategoryKey.Suffix;
        var cateParents = new List<CategoryGeneral> { new() {  Slug = CategoryKey.GuessSlug} };
        var expectedViewModel = fixture.Create<BlogViewModel>();
        expectedViewModel.IsVideo = false;
        expectedViewModel.CateParents = cateParents;
        var expectedMenu = new List<Menu>
        {
            new() { PostId = 1, CateSlug = CategoryKey.GuessSlug, ParentId = 0 },
            new() { PostId = 2, CateSlug = "viet-nam", ParentId = 1 },
            new() { PostId = 3, CateSlug = "dt-viet-nam", ParentId = 2  }
        };
        var menuItems = new MenuItems { Item1 = 1, Item2 = 2, Item3 = 3};
        dataControlService.GetMenuData(Arg.Do<string>(x => menuName = x)).Returns(expectedMenu);
        dataControlService.GetCategoryViewModel(Arg.Do<string>(x => slug = x)).Returns(expectedViewModel);

        //Act
        var result = await controller.Category(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(Constants.CategoryView, viewResult.ViewName);
        Assert.Equal(menuItems.Item1, viewModel.MenuItems.Item1);
        Assert.Equal(menuItems.Item2, viewModel.MenuItems.Item2);
        Assert.Equal(menuItems.Item3, viewModel.MenuItems.Item3);
    }

    [Fact]
    public async Task Category_WhenIsPostAndIsSubVideoCate_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var menuName = "Menu";
        var slug = "video-viet-nam" + CategoryKey.Suffix;
        var cateParents = new List<CategoryGeneral> { new() {  Slug = CategoryKey.VideoSlug} };
        var expectedViewModel = fixture.Create<BlogViewModel>();
        expectedViewModel.IsVideo = true;
        expectedViewModel.CateParents = cateParents;
        var expectedMenu = new List<Menu>
        {
            new() { PostId = 1, CateSlug = CategoryKey.VideoSlug, ParentId = 0 },
            new() { PostId = 3, CateSlug = "video-viet-nam", ParentId = 1 }
        };
        dataControlService.GetMenuData(Arg.Do<string>(x => menuName = x)).Returns(expectedMenu);
        dataControlService.GetCategoryViewModel(Arg.Do<string>(x => slug = x)).Returns(expectedViewModel);

        //Act
        var result = await controller.Category(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(Constants.VideoView, viewResult.ViewName);
        Assert.Equal(1, viewModel.MenuItems.Item1);
        Assert.Equal(3, viewModel.MenuItems.Item2);
        Assert.Equal(0, viewModel.MenuItems.Item3);
    }

    [Fact]
    public async Task Category_WhenIsPostAndSubNormalCate_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var menuName = "Menu";
        var slug = "dt-viet-nam" + CategoryKey.Suffix;
        var expectedViewModel = fixture.Create<BlogViewModel>();
        expectedViewModel.IsVideo = false;
        var expectedMenu = new List<Menu>
        {
            new() { PostId = 1, CateSlug = CategoryKey.VNFootballSlug, ParentId = 0 },
            new() { PostId = 3, CateSlug = "viet-nam", ParentId = 1 },
            new() { PostId = 4, CateSlug = "dt-viet-nam", ParentId = 3  }
        };
        var menuItems = new MenuItems { Item1 = 1, Item2 = 3, Item3 = 4};
        dataControlService.GetMenuData(Arg.Do<string>(x => menuName = x)).Returns(expectedMenu);
        dataControlService.GetCategoryViewModel(Arg.Do<string>(x => slug = x)).Returns(expectedViewModel);

        //Act
        var result = await controller.Category(slug);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(Constants.CategoryView, viewResult.ViewName);
        Assert.Equal(menuItems.Item1, viewModel.MenuItems.Item1);
        Assert.Equal(menuItems.Item2, viewModel.MenuItems.Item2);
        Assert.Equal(menuItems.Item3, viewModel.MenuItems.Item3);
    }


    [Theory]
    [InlineData("slug1", "slug2", "slug3")]
    [InlineData("slug1", "slug2", null)]
    [InlineData("slug1", null, null)]
    [InlineData(null, null, null)]
    public void  OldCategorys_WhenCalled_RedicrectExpectView(string slug1, string slug2, string slug3)
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);

        //Act
        var result =  controller.OldCategories(slug1, slug2, slug3);

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Home", redirectResult.ControllerName);
        Assert.Equal("Category", redirectResult.ActionName);
    }

        


    [Fact]
    public void  OldVideo_WhenCalled_RedicrectExpectView()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);

        //Act
        var result =  controller.OldVideo();

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Home", redirectResult.ControllerName);
        Assert.Equal("Category", redirectResult.ActionName);
    }



    [Fact]
    public async Task Warning_WhenHaveFullData_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        var expectedPage = fixture.Create<Category>();
        postService.GetPageDetailBySlugAsync(Arg.Do<string>(x => slug = x)).Returns(expectedPage);
        //Act
        var result = await controller.Warning();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<PageViewModel>(viewResult.Model);
        Assert.Equal(expectedPage, viewModel.Category);
        Assert.Equal(expectedPage.Description, viewModel.Header.Description);
    }

    [Fact]
    public async Task Warning_WhenSeoTitleIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var slug = fixture.Create<string>();
        fixture.Create<string>();
        var expectedPage = fixture.Create<Category>();
        expectedPage.Description = null;
        expectedPage.SEOTitle = null;
        postService.GetPageDetailBySlugAsync(Arg.Do<string>(x => slug = x)).Returns(expectedPage);
        //Act
        var result = await controller.Warning();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<PageViewModel>(viewResult.Model);
        Assert.Equal(expectedPage, viewModel.Category);
        Assert.Equal(expectedPage.Title, viewModel.Header.Description);
    }

    [Fact]
    public void ChangeDomain_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
           
        //Act
        var result =  controller.ChangeDomain();

        // Assert
        Assert.IsType<ViewResult>(result);
           
    }

    [Fact]
    public async Task Search_WhenHaveFullData_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        var keyword = fixture.Create<string>();
        var page = fixture.Create<int>();
        var criteria = fixture.Create<SearchPostsCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();
        postService.SearchPostAsync(Arg.Do<SearchPostsCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var result = await controller.Search(keyword, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Posts);
        Assert.Equal("Search", viewResult.ViewName);
    }

    [Fact]
    public async Task Search_WhenDontHaveData_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        GetDefaultContext(controller);
        string keyword = null;
        var page = fixture.Create<int>();
        var criteria = fixture.Create<SearchPostsCriteria>();
        IEnumerable<Post> expected = new List<Post>();
        postService.SearchPostAsync(Arg.Do<SearchPostsCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var result = await controller.Search(keyword, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Posts);
        Assert.Equal("SearchNotFound", viewResult.ViewName);
    }

    [Fact]
    public async Task Tag_WhenHaveFullData_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        var keyword = fixture.Create<string>();
        var page = fixture.Create<int>();
        var criteria = fixture.Create<GetPostsByTagCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();
        var expectedSeoInfo = fixture.Create<SEOSettingModel>();
        postService.GetPostByTagAsync(Arg.Do<GetPostsByTagCriteria>(x => criteria = x)).Returns(expected);
        postService.GetSeoSettingAsync().Returns(expectedSeoInfo);
        configuration.GetValue<string>("BaseUrl").Returns("baseurl");
        //Act
        var result = await controller.Tag(keyword, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Posts);
        Assert.Equal(Constants.BlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Tag_WhenSeoInfoIsEmpty_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        var keyword = fixture.Create<string>();
        var page = fixture.Create<int>();
        var criteria = fixture.Create<GetPostsByTagCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();
        var expectedSeoInfo = new SEOSettingModel();
        postService.GetPostByTagAsync(Arg.Do<GetPostsByTagCriteria>(x => criteria = x)).Returns(expected);
        postService.GetSeoSettingAsync().Returns(expectedSeoInfo);
        configuration.GetValue<string>("BaseUrl").Returns("baseurl");
        //Act
        var result = await controller.Tag(keyword, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Posts);
        Assert.Equal(Constants.BlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Tag_WhenPostIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        var keyword = fixture.Create<string>();
        var page = fixture.Create<int>();
        var criteria = fixture.Create<GetPostsByTagCriteria>();
        IEnumerable<Post> expected = new List<Post>();
        postService.GetPostByTagAsync(Arg.Do<GetPostsByTagCriteria>(x => criteria = x)).Returns(expected);
        configuration.GetValue<string>("BaseUrl").Returns("baseurl");
        //Act
        var result = await controller.Tag(keyword, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Auth_WhenHaveFullData_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        var page = fixture.Create<int>();
        var authorId = fixture.Create<int>();
        UserSession user = null;
        var criteria = fixture.Create<GetPostsByAuthorCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();
        postService.GetPostsByAuthor(Arg.Do<GetPostsByAuthorCriteria>(x => criteria = x)).Returns(expected);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = authorId )).Returns(user);
        configuration.GetValue<string>("BaseUrl").Returns("baseurl");
        //Act
        var result = await controller.Author(authorId, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Posts);
        Assert.Equal(Constants.BlogView, viewResult.ViewName);
    }

    [Fact]
    public async Task Auth_WhenPostIsNull_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        var page = fixture.Create<int>();
        var authorId = fixture.Create<int>();
        UserSession user = null;
        var criteria = fixture.Create<GetPostsByAuthorCriteria>();
        IEnumerable<Post> expected = new List<Post>();
        postService.GetPostsByAuthor(Arg.Do<GetPostsByAuthorCriteria>(x => criteria = x)).Returns(expected);
        userService.GetUserByIdAsync(Arg.Do<int>(x => x = authorId )).Returns(user);
        configuration.GetValue<string>("BaseUrl").Returns("baseurl");
        //Act
        var result = await controller.Author(authorId, page);

        // Assert
        var viewResult = Assert.IsType<ViewResult>(result);
        var viewModel = Assert.IsType<BlogViewModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Posts);
        Assert.Equal(Constants.EmptyBlogView, viewResult.ViewName);
    }

    [Fact]
    public void RedirectLivescorePage_WhenCalled_RedirectCorrectly()
    {
        // Arrange
        var controller = GetController();

        // Act
        var result = controller.RedirectLivescorePage();

        // Assert
        var redirectResult = Assert.IsType<RedirectResult>(result);
        Assert.Equal("/lich-thi-dau/bong-da", redirectResult.Url);
    }

    [Fact]
    public void Policy_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
           
        //Act
        var result =  controller.Policy();

        // Assert
        Assert.IsType<ViewResult>(result);
           
    }


    [Fact]
    public async Task GetCategoryGrid_WhenSlugIsVideoCategory_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetPostsByCateSlugPagingCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();
        var param = fixture.Create<CategoryPostParams>();
        param.IsVideo = true;
        param.Page = 2;
        postService.GetPostsByCateSlugPagingAsync(Arg.Do<GetPostsByCateSlugPagingCriteria>(x => criteria = x)).Returns(expected);
        // Act
        var result = await controller.GetCategoryGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
        Assert.Equal("~/Views/Home/_VideoGridView.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetCategoryGrid_WhenSlugIsPostsCategory_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetPostsByCateSlugPagingCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();
        var param = fixture.Create<CategoryPostParams>();
        param.IsVideo = false;
        postService.GetPostsByCateSlugPagingAsync(Arg.Do<GetPostsByCateSlugPagingCriteria>(x => criteria = x)).Returns(expected);
        // Act
        var result = await controller.GetCategoryGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
        Assert.Equal("~/Views/Home/_CategoryGridView.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetCategoryGrid_WhenSlugIsNull_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<IEnumerable<Post>>();
        var param = fixture.Create<CategoryPostParams>();
        param.Slug = null;
        postService.GetRecentPostsAsync(Arg.Do<GetRecentPostsParam>(x => criteria = x)).Returns(expected);
        // Act
        var result = await controller.GetCategoryGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
    }

    [Fact]
    public async Task GetCategoryGrid_WhenPostsIsNull_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetRecentPostsParam>();
        var expected = new List<Post>();
        var param = fixture.Create<CategoryPostParams>();
        param.Slug = null;
        postService.GetRecentPostsAsync(Arg.Do<GetRecentPostsParam>(x => criteria = x)).Returns(expected);
        // Act
        var result = await controller.GetCategoryGrid(param);

        // Assert
        var okResult = Assert.IsAssignableFrom<OkObjectResult>(result);
        Assert.False((bool)okResult.Value);
    }

    [Fact]
    public async Task GetTypePostsGrid_WhenIsSearchType_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<SearchPostsCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();
        var param = fixture.Create<TypePostParam>();
        param.Type = Constants.Search;
        postService.SearchPostAsync(Arg.Do<SearchPostsCriteria>(x => criteria = x)).Returns(expected);
        // Act
        var result = await controller.GetTypePostsGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
        Assert.Equal("~/Views/Home/_CategoryGridView.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetTypePostsGrid_WhenIsTagType_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetPostsByTagCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();
        var param = fixture.Create<TypePostParam>();
        param.Type = Constants.Tag;
        postService.GetPostByTagAsync(Arg.Do<GetPostsByTagCriteria>(x => criteria = x)).Returns(expected);
        // Act
        var result = await controller.GetTypePostsGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
        Assert.Equal("~/Views/Home/_CategoryGridView.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetTypePostsGrid_WhenIsAuthorType_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<GetPostsByAuthorCriteria>();
        var expected = fixture.Create<IEnumerable<Post>>();
        var param = fixture.Create<TypePostParam>();
        param.Keyword = "123";
        param.Type = Constants.Author;
        postService.GetPostsByAuthor(Arg.Do<GetPostsByAuthorCriteria>(x => criteria = x)).Returns(expected);
        // Act
        var result = await controller.GetTypePostsGrid(param);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
        Assert.Equal("~/Views/Home/_CategoryGridView.cshtml", viewResult.ViewName);
    }

    [Fact]
    public async Task GetTypePostsGrid_WhenPostsIsNull_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var criteria = fixture.Create<SearchPostsCriteria>();
        var expected = new List<Post>();
        var param = fixture.Create<TypePostParam>();
        param.Type = Constants.Search;
        postService.SearchPostAsync(Arg.Do<SearchPostsCriteria>(x => criteria = x)).Returns(expected);
        // Act
        var result = await controller.GetTypePostsGrid(param);

        // Assert
        var okResult = Assert.IsAssignableFrom<OkObjectResult>(result);
        Assert.False((bool)okResult.Value);
    }

    [Fact]
    public async Task GetHomeFixture_WhenCalled_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<List<MatchLeagueModel>>();
        dataControlService.GetHomepageFixtureData().Returns(expected);
        // Act
        var result = await controller.GetHomeFixture();

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expected, jsonResult.Value);
    }

    [Fact]
    public async Task GetHomeStanding_WhenCalled_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<List<StandingLeagueModel>>();
        dataControlService.GetHomepageStandingData().Returns(expected);
        // Act
        var result = await controller.GetHomeStanding();

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        Assert.Equal(expected, jsonResult.Value);
    }

    [Fact]
    public void OldCategory_WhenSlugIsNewPost_ReturnCorrectlyAction()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<List<StandingLeagueModel>>();
        dataControlService.GetHomepageStandingData().Returns(expected);
        // Act
        var result =  controller.OldCategory(Constants.NewPostSlug);

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Home", redirectResult.ControllerName);
        Assert.Equal("Category", redirectResult.ActionName);
    }

    [Fact]
    public void OldCategory_WhenSlugIsNotNewPost_ReturnCorrectlyAction()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<List<StandingLeagueModel>>();
        dataControlService.GetHomepageStandingData().Returns(expected);
        // Act
        var result = controller.OldCategory("bong-da");

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Home", redirectResult.ControllerName);
        Assert.Equal("Category", redirectResult.ActionName);
    }


    [Fact]
    public void OldSearch_WhenCalled_ReturnCorrectlyAction()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<List<StandingLeagueModel>>();
        dataControlService.GetHomepageStandingData().Returns(expected);
        // Act
        var result = controller.OldSearch();

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Home", redirectResult.ControllerName);
        Assert.Equal("Search", redirectResult.ActionName);
    }

    [Fact]
    public void OldTag_WhenCalled_ReturnCorrectlyAction()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<List<StandingLeagueModel>>();
        dataControlService.GetHomepageStandingData().Returns(expected);
        // Act
        var result = controller.OldTag("tag");

        // Assert
        var redirectResult = Assert.IsType<RedirectToActionResult>(result);
        Assert.Equal("Home", redirectResult.ControllerName);
        Assert.Equal("Tag", redirectResult.ActionName);
    }

    [Fact]
    public async Task GetVideo_WhenCalled_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<IEnumerable<Post>>();
        dataControlService.GetCategoryPostsAsync(Arg.Do<string>(x => x = CategoryKey.VideoSlug)).Returns(expected);
        // Act
        var result = await controller.GetVideo();

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
    }

    [Fact]
    public async Task GetCategorySidebar_WhenCalled_ReturnCorrectlyData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<IEnumerable<Post>>();
        var slug = fixture.Create<string>();
        dataControlService.GetCategoryPostsAsync(Arg.Do<string>(x => x = slug)).Returns(expected);
        // Act
        var result = await controller.GetCategorySidebar(slug, 10);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsAssignableFrom<IEnumerable<Post>>(viewResult.Model);
        Assert.Equal(expected, viewModel);
    }

    #region Helpers
    private HomeController GetController()
    {
        dataControlService = Substitute.For<IDataControlService>();
        postService = Substitute.For<IPostService>();
        configuration = Substitute.For<IConfiguration>();
        userService = Substitute.For<IUserService>();
        optionService =  Substitute.For<IOptionService>();
        var controller = new HomeController(postService, dataControlService, configuration, userService, optionService);

        return controller;
    }

    private void GetDefaultContext(HomeController controller)
    {
        var urlHelperMock = Substitute.For<IUrlHelper>();
        controller.Url = urlHelperMock;
        urlHelperMock.Action(Arg.Any<UrlActionContext>()).Returns("url");
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
    }
    #endregion Helpers
}