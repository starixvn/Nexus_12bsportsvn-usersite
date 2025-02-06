namespace SabaNews.Site.Hubs;

using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ILivescoreClient
{
    Task UpdateLiveMatches(IList<Match> matches);

    Task UpdateMatchDetail(MatchDetail detail);
}