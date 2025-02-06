namespace SabaNews.Services.Interfaces;

using System.Collections.Generic;
using System.Threading.Tasks;
using Models.ViewModel.Euro2020;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Models;
using SabaNews.Models.Home;
using SabaNews.Models.ViewModel.Event.Euro2024;
using SabaNews.Models.ViewModel.Event.WorldCup;
using SabaNews.Models.ViewModel.Posts;

public interface IFetchDataService
{
    Task<PostViewModel> GetHomePageViewModel();

    Task<IEnumerable<Menu>> GetMenuData(string menuType);

    Task<BlogViewModel> GetCategoryViewModel(string slug);

    Task<Euro2020ViewModel> GetEuro2020ViewModel();

    Task<WorldCupViewModel> GetWorldCupViewModel();

    Task<(League, IList<Match>)> GetWCFixtureData();

    Task<List<MatchLeagueModel>> GetHomepageFixture();
        
    Task<List<StandingLeagueModel>> GetHomepageStanding();

    Task<IList<Match>> GetTodayMatches();

    Task<IList<League>> GetLeaguesAsync();

    Task<Euro2024ViewModel> GetEuro2024ViewModel();

    Task<MatchLeague> GetMatchBySeasonAsync(long leagueId, long seasonId);
    Task<IList<SeasonStandings>> GetLeagueSeasonStandingAsync(long leagueId, long seasonId);
}