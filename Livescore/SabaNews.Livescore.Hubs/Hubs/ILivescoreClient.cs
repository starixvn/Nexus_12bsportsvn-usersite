namespace SabaNews.Livescore.Hubs
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using SabaNews.Livescore.Models.Match;

    public interface ILivescoreClient
    {
        Task UpdateLiveSoccer(IList<Match> matches);

        Task UpdateLiveSoccerCommentary();
    }
}