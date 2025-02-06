namespace SabaNews.Models.ViewModel.User;

using SabaNews.Core.Models;
using System.Collections.Generic;

public class MembershipEventGridViewModel
{
    public IEnumerable<MembershipEventModel> Users { get; set; }

    public PagingModel Paging { get; set; }
}