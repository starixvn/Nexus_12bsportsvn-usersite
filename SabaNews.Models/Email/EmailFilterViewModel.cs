namespace SabaNews.Models.Email;

using SabaNews.Core.Models;
using System;
using System.Collections.Generic;

public class EmailFilterViewModel
{
    public int Page { get; set; }

    public int PageSize { get; set; }

    public string Search { get; set; }

    public DateTimeOffset FromDate { get; set; }

    public DateTimeOffset ToDate { get; set; }

    public int Status { get; set; }

    public int CreatedBy { get; set; }

    public IEnumerable<UserSession> Users { get; set; }

}