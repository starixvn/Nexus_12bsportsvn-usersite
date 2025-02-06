using System.Collections.Generic;
using System.Threading.Tasks;
using AutoFixture;
using Fanex.Caching;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Core.Services;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Models;
using SabaNews.Models.Banner;
using SabaNews.Models.Home;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Event.Euro2024;
using SabaNews.Models.ViewModel.Event.WorldCup;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Services.Interfaces;
using Xunit;

namespace SabaNews.Services.UnitTests;

using Criteria.Minigame;
using Livescore.Services.Interfaces;
using Models.Minigame;
using Models.ViewModel.Euro2020;

public class DataControlServiceTests
{
    private IFetchDataService fetchDataService;
    private ICacheWrapperService cacheWrapperService;
    private IPostService postService;
    private ILogServiceProvider logServiceProvider;
    private IConfiguration configuration;
    private IBannerService bannerService;
    private IEuro2024Service euro2024Service;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task GetHomePageViewModel_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<PostViewModel>();
        cacheWrapperService.GetAsync<PostViewModel>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetHomePageViewModel();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetHomePageViewModel_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        PostViewModel expectedFromCache = null;
        var expected = fixture.Create<PostViewModel>();
        cacheWrapperService.GetAsync<PostViewModel>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetHomePageViewModel().Returns(expected);

        //Act
        var actual = await service.GetHomePageViewModel();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<PostViewModel>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetHomePageViewModel_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var expected = fixture.Create<PostViewModel>();
        fetchDataService.GetHomePageViewModel().Returns(expected);

        //Act
        var actual = await service.GetHomePageViewModel();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetCategoryViewModel_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var slug = fixture.Create<string>();
        var key = fixture.Create<string>();
        var expected = fixture.Create<BlogViewModel>();
        cacheWrapperService.GetAsync<BlogViewModel>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetCategoryViewModel(slug);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetCategoryViewModel_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var slug = fixture.Create<string>();
        BlogViewModel expectedFromCache = null;
        var expected = fixture.Create<BlogViewModel>();
        cacheWrapperService.GetAsync<BlogViewModel>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetCategoryViewModel(Arg.Do<string>(x => x = slug)).Returns(expected);

        //Act
        var actual = await service.GetCategoryViewModel(slug);

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<BlogViewModel>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetCategoryViewModel_WhenPageIsNotFirstPage_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var slug = fixture.Create<string>();
        var expected = fixture.Create<BlogViewModel>();
        fetchDataService.GetCategoryViewModel(Arg.Do<string>(x => x = slug)).Returns(expected);

        //Act
        var actual = await service.GetCategoryViewModel(slug);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMenuData_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<Menu>>();
        cacheWrapperService.GetAsync<IEnumerable<Menu>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetMenuData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMenuData_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        IEnumerable<Menu> expectedFromCache = null;
        var expected = fixture.Create<IEnumerable<Menu>>();
        cacheWrapperService.GetAsync<IEnumerable<Menu>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetMenuData(Arg.Do<string>(x => x = MenuType.MainMenu)).Returns(expected);

        //Act
        var actual = await service.GetMenuData();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IEnumerable<Menu>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetMenuData_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        var expected = fixture.Create<IEnumerable<Menu>>();
        fetchDataService.GetMenuData(Arg.Do<string>(x => x = MenuType.MainMenu)).Returns(expected);

        //Act
        var actual = await service.GetMenuData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GenerateSitmapXmlData_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<SitemapModel>>();
        postService.GetSitemapDataAsync().Returns(expected);

        //Act
        var actual = await service.GenerateSitmapXmlData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GenerateNewsSitmapXmlData_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<NewsSitemapModel>>();
        cacheWrapperService.GetAsync<IEnumerable<NewsSitemapModel>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GenerateNewsSitmapXmlData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GenerateNewsSitmapXmlData_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        IEnumerable<NewsSitemapModel> expectedFromCache = null;
        var expected = fixture.Create<IEnumerable<NewsSitemapModel>>();
        cacheWrapperService.GetAsync<IEnumerable<NewsSitemapModel>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        postService.GetNewsSitemapDataAsync().Returns(expected);

        //Act
        var actual = await service.GenerateNewsSitmapXmlData();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IEnumerable<NewsSitemapModel>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GenerateNewsSitmapXmlData_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<NewsSitemapModel>>();
        postService.GetNewsSitemapDataAsync().Returns(expected);

        //Act
        var actual = await service.GenerateNewsSitmapXmlData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GenerateRSSData_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<Post>>();
        cacheWrapperService.GetAsync<IEnumerable<Post>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GenerateRSSData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GenerateRSSData_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        IEnumerable<Post> expectedFromCache = null;
        var expected = fixture.Create<IEnumerable<Post>>();
        cacheWrapperService.GetAsync<IEnumerable<Post>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        postService.GetRSSDataAsync().Returns(expected);

        //Act
        var actual = await service.GenerateRSSData();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IEnumerable<Post>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GenerateRSSData_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<Post>>();
        postService.GetRSSDataAsync().Returns(expected);

        //Act
        var actual = await service.GenerateRSSData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetEuro2020PageViewModel_WhenCalled_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var expected = fixture.Create<Euro2020ViewModel>();
        fetchDataService.GetEuro2020ViewModel().Returns(expected);

        //Act
        var actual = await service.GetEuro2020PageViewModel();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetBannerData_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<BannerModel>();
        cacheWrapperService.GetAsync<BannerModel>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetBannerData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetBannerData_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        BannerModel expectedFromCache = null;
        var expected = fixture.Create<BannerModel>();
        cacheWrapperService.GetAsync<BannerModel>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        bannerService.GetBannerInfoAsync().Returns(expected);

        //Act
        var actual = await service.GetBannerData();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<BannerModel>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetBannerData_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        var expected = fixture.Create<BannerModel>();
        bannerService.GetBannerInfoAsync().Returns(expected);

        //Act
        var actual = await service.GetBannerData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetWorldCupPageViewModel_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<WorldCupViewModel>();
        cacheWrapperService.GetAsync<WorldCupViewModel>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetWorldCupPageViewModel();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetWorldCupPageViewModel_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        WorldCupViewModel expectedFromCache = null;
        var expected = fixture.Create<WorldCupViewModel>();
        cacheWrapperService.GetAsync<WorldCupViewModel>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetWorldCupViewModel().Returns(expected);

        //Act
        var actual = await service.GetWorldCupPageViewModel();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<WorldCupViewModel>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetWorldCupPageViewModel_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        var expected = fixture.Create<WorldCupViewModel>();
        fetchDataService.GetWorldCupViewModel().Returns(expected);

        //Act
        var actual = await service.GetWorldCupPageViewModel();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetHomepageWCFixtureData_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        fixture.Create<string>();
        var expected = fixture.Create<(League, IList<Match>)>();
        fetchDataService.GetWCFixtureData().Returns(expected);
        //Act
        var actual = await service.GetHomepageWCFixtureData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetHomepageFixtureData_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<List<MatchLeagueModel>>();
        cacheWrapperService.GetAsync<List<MatchLeagueModel>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetHomepageFixtureData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetHomepageFixtureData_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        List<MatchLeagueModel> expectedFromCache = null;
        var expected = fixture.Create<List<MatchLeagueModel>>();
        cacheWrapperService.GetAsync<List<MatchLeagueModel>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetHomepageFixture().Returns(expected);

        //Act
        var actual = await service.GetHomepageFixtureData();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<List<MatchLeagueModel>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetHomepageFixtureData_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        var expected = fixture.Create<List<MatchLeagueModel>>();
        fetchDataService.GetHomepageFixture().Returns(expected);

        //Act
        var actual = await service.GetHomepageFixtureData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetHomepageStandingData_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<List<StandingLeagueModel>>();
        cacheWrapperService.GetAsync<List<StandingLeagueModel>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetHomepageStandingData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetHomepageStandingData_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        List<StandingLeagueModel> expectedFromCache = null;
        var expected = fixture.Create<List<StandingLeagueModel>>();
        cacheWrapperService.GetAsync<List<StandingLeagueModel>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetHomepageStanding().Returns(expected);

        //Act
        var actual = await service.GetHomepageStandingData();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<List<StandingLeagueModel>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetHomepageStandingData_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        var expected = fixture.Create<List<StandingLeagueModel>>();
        fetchDataService.GetHomepageStanding().Returns(expected);

        //Act
        var actual = await service.GetHomepageStandingData();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetCategoryPostsAsync_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<Post>>();
        cacheWrapperService.GetAsync<IEnumerable<Post>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetCategoryPostsAsync(key);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetCategoryPostsAsync_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var start = 0;
        var end = 10;
        IEnumerable<Post> expectedFromCache = null;
        var expected = fixture.Create<IEnumerable<Post>>();
        cacheWrapperService.GetAsync<IEnumerable<Post>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        postService.GetPostsBySlugAsync(Arg.Do<string>(x => key = x), Arg.Do<int>(x => start = x), Arg.Do<int>(x => end = x)).Returns(expected);

        //Act
        var actual = await service.GetCategoryPostsAsync(key);

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IEnumerable<Post>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetCategoryPostsAsync_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        var key = fixture.Create<string>();
        var start = 0;
        var end = 10;
        var expected = fixture.Create<IEnumerable<Post>>();
        postService.GetPostsBySlugAsync(Arg.Do<string>(x => key = x), Arg.Do<int>(x => start = x), Arg.Do<int>(x => end = x)).Returns(expected);

        //Act
        var actual = await service.GetCategoryPostsAsync(key);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetRecentPostsAsync_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<IEnumerable<Post>>();
        cacheWrapperService.GetAsync<IEnumerable<Post>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetRecentPostsAsync();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetRecentPostsAsync_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var param = fixture.Create<GetRecentPostsParam>();
        IEnumerable<Post> expectedFromCache = null;
        var expected = fixture.Create<IEnumerable<Post>>();
        cacheWrapperService.GetAsync<IEnumerable<Post>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        postService.GetRecentPostsAsync(Arg.Do<GetRecentPostsParam>(x => param = x)).Returns(expected);

        //Act
        var actual = await service.GetRecentPostsAsync();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IEnumerable<Post>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetRecentPostsAsync_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var param = fixture.Create<GetRecentPostsParam>();
        var expected = fixture.Create<IEnumerable<Post>>();
        postService.GetRecentPostsAsync(Arg.Do<GetRecentPostsParam>(x => param = x)).Returns(expected);


        //Act
        var actual = await service.GetRecentPostsAsync();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetTodayMatches_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<IList<Match>>();
        cacheWrapperService.GetAsync<IList<Match>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetTodayMatches();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetTodayMatches_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        IList<Match> expectedFromCache = null;
        var expected = fixture.Create<IList<Match>>();
        cacheWrapperService.GetAsync<IList<Match>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetTodayMatches().Returns(expected);

        //Act
        var actual = await service.GetTodayMatches();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IList<Match>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetTodayMatches_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var expected = fixture.Create<IList<Match>>();
        fetchDataService.GetTodayMatches().Returns(expected);

        //Act
        var actual = await service.GetTodayMatches();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetLeagues_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<IList<League>>();
        cacheWrapperService.GetAsync<IList<League>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetLeagues();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetLeagues_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        IList<League> expectedFromCache = null;
        var expected = fixture.Create<IList<League>>();
        cacheWrapperService.GetAsync<IList<League>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetLeaguesAsync().Returns(expected);

        //Act
        var actual = await service.GetLeagues();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IList<League>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetLeagues_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        var expected = fixture.Create<IList<League>>();
        fetchDataService.GetLeaguesAsync().Returns(expected);

        //Act
        var actual = await service.GetLeagues();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMatchBySeasonAsync_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        var expected = fixture.Create<MatchLeague>();

        cacheWrapperService.GetAsync<MatchLeague>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetMatchBySeasonAsync(leagueId, seasonId);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMatchBySeasonAsync_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        MatchLeague expectedFromCache = null;
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        var expected = fixture.Create<MatchLeague>();

        cacheWrapperService.GetAsync<MatchLeague>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var actual = await service.GetMatchBySeasonAsync(leagueId, seasonId);

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<MatchLeague>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetMatchBySeasonAsync_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        var expected = fixture.Create<MatchLeague>();
        fetchDataService.GetMatchBySeasonAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var actual = await service.GetMatchBySeasonAsync(leagueId, seasonId);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetLeagueSeasonStandingAsync_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        var expected = fixture.Create<IList<SeasonStandings>>();

        cacheWrapperService.GetAsync<IList<SeasonStandings>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetLeagueSeasonStandingAsync(leagueId, seasonId);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetLeagueSeasonStandingAsync_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        IList<SeasonStandings> expectedFromCache = null;
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        var expected = fixture.Create<IList<SeasonStandings>>();

        cacheWrapperService.GetAsync<IList<SeasonStandings>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetLeagueSeasonStandingAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var actual = await service.GetLeagueSeasonStandingAsync(leagueId, seasonId);

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IList<SeasonStandings>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetLeagueSeasonStandingAsync_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var leagueId = fixture.Create<long>();
        var seasonId = fixture.Create<long>();
        var expected = fixture.Create<IList<SeasonStandings>>();
        fetchDataService.GetLeagueSeasonStandingAsync(Arg.Do<long>(x => leagueId = x), Arg.Do<long>(x => seasonId = x)).Returns(expected);

        //Act
        var actual = await service.GetLeagueSeasonStandingAsync(leagueId, seasonId);

        //Assert
        Assert.Equal(expected, actual);
    }


    [Fact]
    public async Task GetEuro2024PageViewModel_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<Euro2024ViewModel>();

        cacheWrapperService.GetAsync<Euro2024ViewModel>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetEuro2024PageViewModel();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetEuro2024PageViewModel_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        Euro2024ViewModel expectedFromCache = null;
        var expected = fixture.Create<Euro2024ViewModel>();

        cacheWrapperService.GetAsync<Euro2024ViewModel>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        fetchDataService.GetEuro2024ViewModel().Returns(expected);

        //Act
        var actual = await service.GetEuro2024PageViewModel();

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<Euro2024ViewModel>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetEuro2024PageViewModel_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        var expected = fixture.Create<Euro2024ViewModel>();
        fetchDataService.GetEuro2024ViewModel().Returns(expected);

        //Act
        var actual = await service.GetEuro2024PageViewModel();

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMinigameByStage_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<IList<UserMinigameModel>>();
        var param = fixture.Create<GetLeagueMinigameByStageCriteria>();

        cacheWrapperService.GetAsync<IList<UserMinigameModel>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetMinigameByStage(param);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMinigameByStage_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        IList<UserMinigameModel> expectedFromCache = null;
        var expected = fixture.Create<IList<UserMinigameModel>>();
        var param = fixture.Create<GetLeagueMinigameByStageCriteria>();

        cacheWrapperService.GetAsync<IList<UserMinigameModel>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        euro2024Service.GetLeagueMinigameByStageAsync(Arg.Do<GetLeagueMinigameByStageCriteria>(x => x = param)).Returns(expected);

        //Act
        var actual = await service.GetMinigameByStage(param);

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IList<UserMinigameModel>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetMinigameByStage_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var expected = fixture.Create<IList<UserMinigameModel>>();
        var param = fixture.Create<GetLeagueMinigameByStageCriteria>();

        euro2024Service.GetLeagueMinigameByStageAsync(Arg.Do<GetLeagueMinigameByStageCriteria>(x => x = param)).Returns(expected);
            

        //Act
        var actual = await service.GetMinigameByStage(param);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMinigameWithEmailByStage_WhenCacheHaveData_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        var expected = fixture.Create<IList<MinigameModel>>();
        var param = fixture.Create<GetLeagueMinigameByStageCriteria>();

        cacheWrapperService.GetAsync<IList<MinigameModel>>(Arg.Do<string>(x => x = key)).Returns(expected);
        //Act
        var actual = await service.GetMinigameWithEmailByStage(param);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetMinigameWithEmailByStage_WhenCacheReturnNull_ReturnExpectedData()
    {
        var service = GetDataControlService(true);
        var key = fixture.Create<string>();
        IList<MinigameModel> expectedFromCache = null;
        var expected = fixture.Create<IList<MinigameModel>>();
        var param = fixture.Create<GetLeagueMinigameByStageCriteria>();

        cacheWrapperService.GetAsync<IList<MinigameModel>>(Arg.Do<string>(x => x = key)).Returns(expectedFromCache);
        euro2024Service.GetLeagueMinigameByStageWithEmailAsync(Arg.Do<GetLeagueMinigameByStageCriteria>(x => x = param)).Returns(expected);

        //Act
        var actual = await service.GetMinigameWithEmailByStage(param);

        //Assert
        Assert.Equal(expected, actual);
        logServiceProvider.Received().WriteLogFileInfo(Arg.Any<string>());
        await cacheWrapperService.Received().SetAsync(Arg.Any<string>(), Arg.Any<IList<MinigameModel>>(), Arg.Any<CacheItemOptions>());
    }

    [Fact]
    public async Task GetMinigameWithEmailByStage_WhenNotUsingCache_ReturnExpectedData()
    {
        var service = GetDataControlService(false);
        fixture.Create<string>();
        var expected = fixture.Create<IList<MinigameModel>>();
        var param = fixture.Create<GetLeagueMinigameByStageCriteria>();

        euro2024Service.GetLeagueMinigameByStageWithEmailAsync(Arg.Do<GetLeagueMinigameByStageCriteria>(x => x = param)).Returns(expected);
            

        //Act
        var actual = await service.GetMinigameWithEmailByStage(param);

        //Assert
        Assert.Equal(expected, actual);
    }



    #region Helpers

    private DataControlService GetDataControlService(bool isEnable)
    {
        var inMemorySettings = new Dictionary<string, string> {
            {"IsEnabledUseFanexCaching", $"{isEnable}"}
        };
        configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        fetchDataService = Substitute.For<IFetchDataService>();
        cacheWrapperService = Substitute.For<ICacheWrapperService>();
        postService = Substitute.For<IPostService>();
        logServiceProvider = Substitute.For<ILogServiceProvider>();
        bannerService = Substitute.For<IBannerService>();
        Substitute.For<IMatchService>();
        euro2024Service = Substitute.For<IEuro2024Service>();

        var service = new DataControlService(fetchDataService, configuration, cacheWrapperService, postService, logServiceProvider, bannerService, euro2024Service);

        return service;
    }

    #endregion Helpers
}