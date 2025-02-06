using System;
using SabaNews.Core.Constants;

namespace SabaNews.Models.ViewModel.Posts;

public class GetDataViewModel
{
    public int PostId { get; set; }
    public int LastTimestamp { get; set; }
    public DateTime FromDate { get; set; }
    public int Category { get; set; }
    public int Subject { get; set; }
    public int LangKey { get; set; }
    public int StartItem  { get; set; } = 0;
    public int RowLimit { get; set; } = Constants.ApiDefaultRowLimit;

    public static bool IsValid(string token) => token != null && token.Equals(Constants.TokenAPIGetData);
}