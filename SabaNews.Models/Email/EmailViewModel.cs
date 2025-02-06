namespace SabaNews.Models.Email;

using SabaNews.Core.Models;
using System.Collections.Generic;

public class EmailViewModel
{
    public IEnumerable<EmailModel> Emails { get; set; }

    public PagingModel Paging { get; set; }


}