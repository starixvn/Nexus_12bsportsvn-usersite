namespace SabaNews.Models.ViewModel.User;

using System;

public class UserFilterViewModel
{
    public DateTimeOffset FromDate { get; set; }

    public DateTimeOffset ToDate { get; set; }

    public string DateSort { get; set; }

    public string Search { get; set; }

    public string SearchType { get; set; }

    public int PageSize { get; set; }

    public int Page { get; set; } 

}