namespace SabaNews.Models.Email;

using SabaNews.Core.Models;
using System.Collections.Generic;

public class EmailDetailViewModel
{

    public IEnumerable<EmailDetailModel> ListEmailDetails { get; set; }

    public EmailModel Email { get; set; }

    public PagingModel Paging { get; set; }

    public int NumberEmailFailed { get; set; }

}