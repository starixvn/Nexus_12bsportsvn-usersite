namespace SabaNews.Livescore.Hubs
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.SignalR;
    using SabaNews.Livescore.Models.Match;

    public class LivescoreHub : Hub<ILivescoreClient>
    {
        public async Task UpdateLiveSoccer(IList<Match> matches)
        {
            await Clients.All.UpdateLiveSoccer(matches);
        }

        public async Task UpdateLiveSoccerCommentary(long matchId)
        {
            await Clients.Group(matchId.ToString()).UpdateLiveSoccerCommentary();
        }

        public async Task JoinSoccerGroup(long matchId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, matchId.ToString());
        }

        public async Task LeaveSoccerGroup(long matchId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, matchId.ToString());
        }
    }
}