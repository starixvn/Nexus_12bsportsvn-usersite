namespace SabaNews.Models.Email;

using SabaNews.Core.Models;
using SabaNews.Models.User;
using System.Collections.Generic;

public class EmaiCreateViewModel
{
    public IEnumerable<UserSession> UsersForTest { get; set; }

    public IEnumerable<UserSendEmail> UsersForSend { get; set; }
}