namespace SabaNews.Services;

using Fanex.Caching;
using Microsoft.Extensions.Configuration;
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
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Criteria.Minigame;
using Models.Minigame;
using Models.ViewModel.Euro2020;

public class DataControlService(
    IFetchDataService fetchDataService,
    IConfiguration configuration,
    ICacheWrapperService cacheWrapperService,
    IPostService postService,
    ILogServiceProvider logServiceProvider,
    IBannerService bannerService,
    IEuro2024Service euro2024Service)
    : IDataControlService
{
    private readonly bool IsUsingCache = configuration.GetValue<bool>("IsEnabledUseFanexCaching");

    public async Task<PostViewModel> GetHomePageViewModel()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<PostViewModel>(CacheKey.HomePageViewModel);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get Homepage data from DB---------");
                result = await fetchDataService.GetHomePageViewModel();
                await cacheWrapperService.SetAsync(CacheKey.HomePageViewModel, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheHomePageTimeoutMinutes)
                    });
            }

            return result;
        }

        return await fetchDataService.GetHomePageViewModel();
    }

    public async Task<BlogViewModel> GetCategoryViewModel(string slug)
    {
        if (IsUsingCache)
        {
            var cacheKey = CacheKey.CategoryViewModel + "-" + slug;
            var result = await cacheWrapperService.GetAsync<BlogViewModel>(cacheKey);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo($"-------Get Category {slug} data from DB---------");

                result = await fetchDataService.GetCategoryViewModel(slug);
                if (result != null)
                {
                    await cacheWrapperService.SetAsync(cacheKey, result,
                        new CacheItemOptions
                        {
                            RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheSubCategoryTimeoutMinutes)
                        });
                }
            }

            return result;
        }

        return await fetchDataService.GetCategoryViewModel(slug);
    }

    public async Task<IEnumerable<Menu>> GetMenuData(string menuType = MenuType.MainMenu)
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<IEnumerable<Menu>>(menuType);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo($"-------Get {menuType} data from DB---------");
                result = await fetchDataService.GetMenuData(menuType);
                await cacheWrapperService.SetAsync(menuType, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheMenuTimeoutMinutes)
                    });
            }

            return result;
        }

        return await fetchDataService.GetMenuData(menuType);
    }

    public async Task<IEnumerable<SitemapModel>> GenerateSitmapXmlData()
    {
        return await postService.GetSitemapDataAsync();

    }

    public async Task<IEnumerable<NewsSitemapModel>> GenerateNewsSitmapXmlData()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<IEnumerable<NewsSitemapModel>>(CacheKey.NewsSitemapXml);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get News Sitemap data from DB---------");

                result = await postService.GetNewsSitemapDataAsync();
                await cacheWrapperService.SetAsync(CacheKey.NewsSitemapXml, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheNewSitemapTimeoutMinutes)
                    });
            }

            return result;
        }

        return await postService.GetNewsSitemapDataAsync();
    }

    public async Task<IEnumerable<Post>> GenerateRSSData()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<IEnumerable<Post>>(CacheKey.RSS);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get RSS data from DB---------");

                result = await postService.GetRSSDataAsync();
                await cacheWrapperService.SetAsync(CacheKey.RSS, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheRSSTimeoutMinutes)
                    });
            }

            return result;
        }

        return await postService.GetRSSDataAsync();
    }

    public async Task<BannerModel> GetBannerData()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<BannerModel>(CacheKey.Banner);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get Banner data from DB---------");

                result = await bannerService.GetBannerInfoAsync();
                await cacheWrapperService.SetAsync(CacheKey.Banner, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheBannerTimeoutMinutes)
                    });
            }

            return result;
        }

        return await bannerService.GetBannerInfoAsync();
    }

    public async Task<Euro2020ViewModel> GetEuro2020PageViewModel()
    {
        var result = await fetchDataService.GetEuro2020ViewModel();
        return result;
    }

    public async Task<WorldCupViewModel> GetWorldCupPageViewModel()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<WorldCupViewModel>(CacheKey.WorldCup);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get world cup data from DB---------");

                result = await fetchDataService.GetWorldCupViewModel();
                await cacheWrapperService.SetAsync(CacheKey.WorldCup, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheWorldCupTimeoutMinutes)
                    });
            }

            return result;
        }

        return await fetchDataService.GetWorldCupViewModel();
    }

    public async Task<(League, IList<Match>)> GetHomepageWCFixtureData()
    {
        return await fetchDataService.GetWCFixtureData();
    }

    public async Task<List<MatchLeagueModel>> GetHomepageFixtureData()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<List<MatchLeagueModel>>(CacheKey.HomePageFixture);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get homepage fixture from DB---------");
                result = await fetchDataService.GetHomepageFixture();
                await cacheWrapperService.SetAsync(CacheKey.HomePageFixture, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheHompageFixtureTimeoutMinutes)
                    });
            }

            return result;
        }

        return await fetchDataService.GetHomepageFixture();
    }

    public async Task<List<StandingLeagueModel>> GetHomepageStandingData()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<List<StandingLeagueModel>>(CacheKey.HomePageStanding);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get homepage fixture from DB---------");
                result = await fetchDataService.GetHomepageStanding();
                await cacheWrapperService.SetAsync(CacheKey.HomePageStanding, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheHompageFixtureTimeoutMinutes)
                    });
            }

            return result;
        }

        return await fetchDataService.GetHomepageStanding();
    }

    public async Task<IEnumerable<Post>> GetCategoryPostsAsync(string slug)
    {
        if (IsUsingCache)
        {
            var cacheKey = CacheKey.CategoryPosts + "-" + slug;
            var result = await cacheWrapperService.GetAsync<IEnumerable<Post>>(cacheKey);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo($"-------Get {cacheKey} data from DB---------");

                result = await postService.GetPostsBySlugAsync(slug, Constants.FromFirstItem, Constants.GetTenItems);
                await cacheWrapperService.SetAsync(cacheKey, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheCategoryPostTimeoutMinutes)
                    });
            }

            return result;
        }

        return await postService.GetPostsBySlugAsync(slug, Constants.FromFirstItem, Constants.GetTenItems);
    }

    public async Task<IEnumerable<Post>> GetRecentPostsAsync()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<IEnumerable<Post>>(CacheKey.RecentPost);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get recent posts data from DB---------");

                result = await postService.GetRecentPostsAsync(new GetRecentPostsParam { Start = Constants.FromFirstItem, End = Constants.GetElevenItems });
                await cacheWrapperService.SetAsync(CacheKey.RecentPost, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheRecentPostTimeoutMinutes)
                    });
            }

            return result;
        }

        return await postService.GetRecentPostsAsync(new GetRecentPostsParam { Start = Constants.FromFirstItem, End = Constants.GetElevenItems });
    }

    public async Task<IList<Match>> GetTodayMatches()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<IList<Match>>(CacheKey.TodayMatches);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get today matches from DB---------");
                result = await fetchDataService.GetTodayMatches();
                await cacheWrapperService.SetAsync(CacheKey.TodayMatches, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheTodayMatchesTimeoutMinutes)
                    });
            }

            return result;
        }

        return await fetchDataService.GetTodayMatches();
    }

    public async Task<IList<League>> GetLeagues()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<IList<League>>(CacheKey.Leagues);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get all leagues from DB---------");
                result = await fetchDataService.GetLeaguesAsync();
                await cacheWrapperService.SetAsync(CacheKey.Leagues, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheLeaguesTimeoutMinutes)
                    });
            }

            return result;
        }

        return await fetchDataService.GetLeaguesAsync();
    }

    public async Task<MatchLeague> GetMatchBySeasonAsync(long leagueId, long seasonId)
    {
        if (IsUsingCache)
        {
            var key = $"{CacheKey.GetMatchBySeason}-{leagueId}-{seasonId}";
            var result = await cacheWrapperService.GetAsync<MatchLeague>(key);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo($"-------Get MatchBySeasonAsync({leagueId},{seasonId}) from DB---------");
                result = await fetchDataService.GetMatchBySeasonAsync(leagueId, seasonId);
                await cacheWrapperService.SetAsync(key, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheGetMatchBySeasonTimeout)
                    });
            }

            return result;
        }

        return await fetchDataService.GetMatchBySeasonAsync(leagueId, seasonId);
    }

    public async Task<IList<SeasonStandings>> GetLeagueSeasonStandingAsync(long leagueId, long seasonId)
    {
        if (IsUsingCache)
        {
            var key = $"{CacheKey.GetLeagueSeasonStanding}-{leagueId}-{seasonId}";
            var result = await cacheWrapperService.GetAsync<IList<SeasonStandings>>(key);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo($"-------Get GetLeagueSeasonStandingAsync({leagueId},{seasonId}) from DB---------");
                result = await fetchDataService.GetLeagueSeasonStandingAsync(leagueId, seasonId);
                await cacheWrapperService.SetAsync(key, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.GetLeagueSeasonStandingTimeout)
                    });
            }

            return result;
        }

        return await fetchDataService.GetLeagueSeasonStandingAsync(leagueId, seasonId);
    }

    public async Task<Euro2024ViewModel> GetEuro2024PageViewModel()
    {
        if (IsUsingCache)
        {
            var result = await cacheWrapperService.GetAsync<Euro2024ViewModel>(CacheKey.Euro2024);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get euro 2024 data from DB---------");

                result = await fetchDataService.GetEuro2024ViewModel();
                await cacheWrapperService.SetAsync(CacheKey.Euro2024, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheWorldCupTimeoutMinutes)
                    });
            }

            return result;
        }

        return await fetchDataService.GetEuro2024ViewModel();
    }

    public async Task<IList<UserMinigameModel>> GetMinigameByStage(GetLeagueMinigameByStageCriteria criteria)
    {
        if (IsUsingCache)
        {
            var key = $"{CacheKey.GetMinigameByStage}-{criteria.Stage}-{criteria.LeagueId}-{criteria.SeasonId}";
            var result = await cacheWrapperService.GetAsync<IList<UserMinigameModel>>(key);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get euro 2024 data from DB---------");

                result = await euro2024Service.GetLeagueMinigameByStageAsync(criteria);
                await cacheWrapperService.SetAsync(key, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheEuroMinigameTimeout)
                    });
            }

            return result;
        }

        return await euro2024Service.GetLeagueMinigameByStageAsync(criteria);
    }

    public async Task<IList<MinigameModel>> GetMinigameWithEmailByStage(GetLeagueMinigameByStageCriteria criteria)
    {
        if (IsUsingCache)
        {
            var key = $"{CacheKey.GetMinigameWithEmailByStage}-{criteria.Stage}-{criteria.LeagueId}-{criteria.SeasonId}";
            var result = await cacheWrapperService.GetAsync<IList<MinigameModel>>(key);

            if (result == null)
            {
                logServiceProvider.WriteLogFileInfo("-------Get euro 2024 data from DB---------");

                result = await euro2024Service.GetLeagueMinigameByStageWithEmailAsync(criteria);
                await cacheWrapperService.SetAsync(key, result,
                    new CacheItemOptions
                    {
                        RelativeExpiration = TimeSpan.FromMinutes(Constants.CacheAdminEuroMinigameTimeout)
                    });
            }

            return result;
        }

        return await euro2024Service.GetLeagueMinigameByStageWithEmailAsync(criteria);
    }
}