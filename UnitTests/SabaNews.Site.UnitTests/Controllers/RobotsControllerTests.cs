namespace SabaNews.Site.UnitTests.Controllers;

using AutoFixture;
using Fanex.Caching;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using SabaNews.Core.Services;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Models;
using SabaNews.Models.Categories;
using SabaNews.Models.Posts;
using SabaNews.Models.RSS;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Extensions;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using SabaNews.Livescore.Services.Interfaces;
using Site.Controllers;
using Xunit;

public class RobotsControllerTests : Controller
{
    private IDataControlService dataControlService;
    private IConfiguration configuration;
    private  IPostService postService;
    private  ICacheWrapperService cacheService;
    private  IMatchService matchService;
    private readonly IFixture fixture = new Fixture();

    public const string articleDaySlug = "article-day-";
    public const string articleYearSlug = "article-year-";
    public const string xmlSuffix = ".xml";

    [Fact]
    public void RobotsTxt_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var domainName = "";
        var sb = new StringBuilder();
        sb.AppendLine("User-agent: *")
            .AppendLine("allow: /")
            .Append("Sitemap: ")
            .Append(domainName)
            .AppendLine("sitemap.xml")
            .Append("Sitemap: ")
            .Append(domainName)
            .AppendLine("sitemap-news.xml");

        var expected = sb.ToString();
        //Act
        var actual = controller.RobotsTxt();

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expected, viewResult.Content);
    }

    [Fact]
    public void Sitemap_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expectedSitemap = SitemapHelper.GetSitemapForDayAndYear("");
        //Act
        var actual = controller.Sitemap();

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }

    [Fact]
    public async Task SitemapGeneral_WhenArticleSitemap_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<IList<Post>>();
        var slug = "2023-10-10" + articleDaySlug;
        var date = new DateTime(2023, 10, 10);
        postService.GetSitemapPostsByDateAsync(Arg.Do<DateTime>(x => x = date)).Returns(expected);
        var expectedSitemap = SitemapHelper.GetSitemapDocument(expected, "");
        //Act
        var actual = await controller.SitemapGeneral(slug);

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }

    [Fact]
    public async Task SitemapGeneral_WhenYearSitemap_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        fixture.Create<IList<Post>>();
        var slug = "2020" + articleYearSlug;
        var expectedSitemap = SitemapHelper.GetSitemapForYear(2020, "");
        //Act
        var actual = await controller.SitemapGeneral(slug);

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }

    [Fact]
    public async Task SitemapCategories_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<IEnumerable<Menu>>();
        dataControlService.GetMenuData().Returns(expected);
        var expectedSitemap = SitemapHelper.GetSitemapCategories(expected, "");
        //Act
        var actual = await controller.SitemapCategories();

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }

    [Fact]
    public async Task SitemapTags_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<IList<Category>>();
        postService.GetAllTagAsync().Returns(expected);
        var expectedSitemap = SitemapHelper.GetSitemapTags(expected, "");
        //Act
        var actual = await controller.SitemapTags();

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }


    [Fact]
    public async Task SitemapNews_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<IEnumerable<NewsSitemapModel>>();
        dataControlService.GenerateNewsSitmapXmlData().Returns(expected);
        var expectedSitemap = SitemapHelper.GetSitemapNews(expected, "");
        //Act
        var actual = await controller.SitemapNews();

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }

    [Fact]
    public async Task SitemapLeagues_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<IList<League>>();
        dataControlService.GetLeagues().Returns(expected);
        var expectedSitemap = SitemapHelper.GetSitemapLeague(expected, "");
        //Act
        var actual = await controller.SitemapLeagues();

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }


    [Fact]
    public async Task SitemapMatches_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<List<MatchSitemap>>();
        matchService.GetMatchSitemapAsync().Returns(expected);
        var expectedSitemap = SitemapHelper.GetSitemapMatch(expected, "");
        //Act
        var actual = await controller.SitemapMatches();

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }

    [Fact]
    public async Task RSS_WhenCalled_ReturnExpectedViewData()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<List<Menu>>();
        dataControlService.GetMenuData().Returns(expected);
        //Act
        var actual = await controller.RSS();

        //Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<RSSHomeModel>(viewResult.Model);
        Assert.Equal(expected, viewModel.Menus);
    }

    [Fact]
    public async Task RSS_WhenCacheIsDisabled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var cate = "cate.rss";
        var expectedPost = fixture.Create<List<Post>>();
        Category expectedCategory = null;
        var expectedParentCate = new List<CategoryGeneral> { new() { Slug = "tin-the-thao" } };
        postService.GetRSSCategoryBySlugAsync(Arg.Do<string>(x => x = cate)).Returns(expectedPost);
        postService.GetCateDetailAsync(Arg.Do<string>(x => x = cate)).Returns(expectedCategory);
        postService.GetCateParentsAsync(Arg.Do<string>(x => x = cate)).Returns(expectedParentCate);
        var expectedSitemap = "";
        //Act
        var actual = await controller.CategoryRSS(cate);

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }


    [Fact]
    public async Task RSS_WhenCacheReturnEmpty_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var cate = "trang-chu.rss";
        var key = fixture.Create<string>();
        RSSCategoryModel model = null;
        var expectedPost = fixture.Create<List<Post>>();
        var expectedCategory = fixture.Create<Category>();
        cacheService.GetAsync<RSSCategoryModel>(Arg.Do<string>(x => x = key)).Returns(model);
        postService.GetRSSRecentBySlugAsync().Returns(expectedPost);
        postService.GetPageDetailBySlugAsync(Arg.Do<string>(x => x = cate)).Returns(expectedCategory);
        var expectedModel = new RSSCategoryModel
        {
            Posts = expectedPost,
            Category = expectedCategory
        };
        RssHelper.GetRSSDocument(expectedModel, "", cate);
        //Act
        var actual = await controller.CategoryRSS(cate);

        //Assert
        Assert.IsType<ContentResult>(actual);
        await cacheService.Received().SetAsync(Arg.Any<string>(), Arg.Any<RSSCategoryModel>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task RSS_WhenCacheHaveData_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var cate = "trang-chu.rss";
        var key = fixture.Create<string>();
        var expectedPost = fixture.Create<List<Post>>();
        var expectedCategory = fixture.Create<Category>();
        expectedCategory.Url = "tin-the-thao/";

        var expectedModel = new RSSCategoryModel
        {
            Posts = expectedPost,
            Category = expectedCategory
        };
        cacheService.GetAsync<RSSCategoryModel>(Arg.Do<string>(x => x = key)).Returns(expectedModel);
        var expectedSitemap = RssHelper.GetRSSDocument(expectedModel, "", "rss/" + cate);
        //Act
        var actual = await controller.CategoryRSS(cate);

        //Assert
        var viewResult = Assert.IsType<ContentResult>(actual);
        Assert.Equal(expectedSitemap, viewResult.Content);
    }

    #region Helpers
    private RobotsController GetController(bool enabledCache = true)
    {
        var inMemorySettings = new Dictionary<string, string> {
            {"RSSCacheConfig:Enabled", enabledCache.ToString()},
            {"RSSCacheConfig:Timeout", "5"}
        };
        configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        dataControlService = Substitute.For<IDataControlService>();
        postService = Substitute.For<IPostService>();
        cacheService = Substitute.For<ICacheWrapperService>();
        matchService = Substitute.For<IMatchService>();
        var controller = new RobotsController(dataControlService, configuration, postService, cacheService, matchService);

        return controller;
    }
        
    #endregion Helpers
}