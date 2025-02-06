namespace SabaNews.Models.ViewModel.Statistic;

using System;
using System.Collections.Generic;
using SabaNews.Core.Models;
using SabaNews.Models.Posts;

public class ViewDetailsViewModel
{
    public DateTime CreatedDate { get; set; }

    public string Type { get; set; }

    public int Quantity { get; set; }

    public int TotalView { get; set; }

    public string ViewSort { get; set; }

    public string AuthorSort { get; set; }

    public string Tooltip { get; set; }

    public bool IsVideo { get; set; }

    public PagingModel Paging { get; set; }

    public IEnumerable<ViewDetails> ViewDetails { get; set; }
}