namespace SabaNews.Models.Email;

using SabaNews.Core.Models;
using SabaNews.Models.User;
using System.Collections.Generic;

public class EmailEditViewModel
{
    public EmailModel Email { get; set; }

    public string RawUrl { get; set; }

    public string OriginalUrl { get; set; }

    public IEnumerable<UserSession> UsersForTest { get; set; }

    public IEnumerable<UserSendEmail> UsersForSend { get; set; }

    public IEnumerable<EmailSendData> UsersSelected { get; set; }
}