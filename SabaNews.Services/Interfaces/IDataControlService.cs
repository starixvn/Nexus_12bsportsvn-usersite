namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Constants;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Models;
using SabaNews.Models.Banner;
using SabaNews.Models.Home;
using SabaNews.Models.Posts;
using SabaNews.Models.ViewModel.Event.Euro2024;
using SabaNews.Models.ViewModel.Event.WorldCup;
using SabaNews.Models.ViewModel.Posts;
using System.Collections.Generic;
using System.Threading.Tasks;
using Criteria.Minigame;
using Models.Minigame;
using Models.ViewModel.Euro2020;

public interface IDataControlService
{
    Task<PostViewModel> GetHomePageViewModel();

    Task<IEnumerable<Menu>> GetMenuData(string menuType = MenuType.MainMenu);

    Task<BlogViewModel> GetCategoryViewModel(string slug);

    Task<IEnumerable<SitemapModel>> GenerateSitmapXmlData();

    Task<IEnumerable<NewsSitemapModel>> GenerateNewsSitmapXmlData();

    Task<IEnumerable<Post>> GenerateRSSData();

    Task<Euro2020ViewModel> GetEuro2020PageViewModel();

    Task<BannerModel> GetBannerData();

    Task<WorldCupViewModel> GetWorldCupPageViewModel();

    Task<(League, IList<Match>)> GetHomepageWCFixtureData();

    Task<List<MatchLeagueModel>> GetHomepageFixtureData();

    Task<List<StandingLeagueModel>> GetHomepageStandingData();

    Task<IEnumerable<Post>> GetCategoryPostsAsync(string slug);

    Task<IEnumerable<Post>> GetRecentPostsAsync();

    Task<IList<Match>> GetTodayMatches();

    Task<IList<League>> GetLeagues();

    Task<Euro2024ViewModel> GetEuro2024PageViewModel();
    Task<MatchLeague> GetMatchBySeasonAsync(long leagueId, long seasonId);

    Task<IList<SeasonStandings>> GetLeagueSeasonStandingAsync(long leagueId, long seasonId);
    Task<IList<UserMinigameModel>> GetMinigameByStage(GetLeagueMinigameByStageCriteria criteria);
    Task<IList<MinigameModel>> GetMinigameWithEmailByStage(GetLeagueMinigameByStageCriteria criteria);
}