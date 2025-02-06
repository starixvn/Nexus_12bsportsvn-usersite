namespace SabaNews.Models;

using SabaNews.Core.Models;

public class TopHeaderViewModel
{
    public UserSession User { get; set; }
    public string UserUgent { get; set; }
    public bool IsAuthenticated { get; set; }
    public string CateSlug { get; set; }
    public bool IsAdmin { get; set; }
}