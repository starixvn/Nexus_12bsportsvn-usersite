namespace SabaNews.Models.Livescore.MatchManagement;

using SabaNews.Core.Models;
using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;

public class MatchManageGridVewModel
{
    public IList<Match> Matches { get; set; }


    public PagingModel Paging { get; set; }

    public string DateSort { get; set; }
}