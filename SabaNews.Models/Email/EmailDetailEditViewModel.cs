namespace SabaNews.Models.Email;

using SabaNews.Core.Models;
using System.Collections.Generic;

public class EmailDetailEditViewModel
{
    public EmailDetailModel Email { get; set; }

    public string RawUrl { get; set; }


    public IEnumerable<UserSession> UsersForTest { get; set; }

}