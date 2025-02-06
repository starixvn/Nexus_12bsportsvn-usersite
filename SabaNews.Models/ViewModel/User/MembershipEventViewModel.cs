using SabaNews.Core.Models;

namespace SabaNews.Models.ViewModel.User;

public class MembershipEventViewModel
{
    public UserSession User { get; set; }

    public bool IsLogin { get; set; }

    public bool IsAdmin { get; set; }

    public string BaseUrl { get; set; }
    public MembershipEventModel MembershipEventDetail { get; set; }
}