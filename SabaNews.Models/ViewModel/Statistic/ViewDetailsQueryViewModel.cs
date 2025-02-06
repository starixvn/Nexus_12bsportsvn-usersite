namespace SabaNews.Models.ViewModel.Statistic;

using System;
using SabaNews.Core.Constants;

public class ViewDetailsQueryViewModel
{
    public DateTime? CreatedDate { get; set; }

    public bool IsVideo { get; set; }

    public string ViewSort { get; set; }

    public string AuthorSort { get; set; }

    public int PageIndex { get; set; } = Constants.FirstPage;

    public int PageSize { get; set; } = Constants.Perpage;
}