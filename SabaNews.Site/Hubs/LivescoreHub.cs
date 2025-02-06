namespace SabaNews.Site.Hubs;

using Microsoft.AspNetCore.SignalR;
using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;
using System.Threading.Tasks;

public class LivescoreHub : Hub<ILivescoreClient>
{
    public async Task UpdateListLiveMatch(IList<Match> matches)
    {
        await Clients.All.UpdateLiveMatches(matches);
    }

    public async Task UpdateLiveMatchDetail(long matchId, MatchDetail detail)
    {
        await Clients.Group(matchId.ToString()).UpdateMatchDetail(detail);
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