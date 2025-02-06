namespace SabaNews.Models.ViewModel.Profile;

using SabaNews.Core.Models;

public class ProfileViewModel
{
    public string Title { get; set; }

    public string Page { get; set; }

    public bool ErrorConnectEmail { get; set; }

    public UserSession User { get; set; }
}