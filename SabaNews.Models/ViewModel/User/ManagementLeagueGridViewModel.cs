namespace SabaNews.Models.ViewModel.User;

using SabaNews.Core.Models;
using SabaNews.Livescore.Models.League;
using System.Collections.Generic;
public class ManagementLeagueGridViewModel
{
    public IEnumerable<League> Leagues { get; set; }

    public PagingModel Paging { get; set; }
}