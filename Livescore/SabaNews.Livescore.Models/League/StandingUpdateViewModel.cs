namespace SabaNews.Livescore.Models.League;

using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;

public class StandingUpdateViewModel
{
    public SeasonStandingUpdate Standing { get; set; }

    public List<StandingGroupModel> Groups { get; set; }

    public StandingGroupModel Group { get; set; }
}