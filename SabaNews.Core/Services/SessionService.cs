namespace SabaNews.Core.Services;

using Microsoft.AspNetCore.Http;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Extensions;

public interface ISessionService
{
    UserSession User { get; set; }

    void ClearAll();
}

public class SessionService(ISession session) : ISessionService
{
    public SessionService(IHttpContextAccessor accessor) : this(accessor.HttpContext.Session)
    {
    }

    public UserSession User
    {
        get => session.Get<UserSession>(SessionKey.User);

        set => session.SetObject(SessionKey.User, value);
    }

    public void ClearAll()
    {
        session.Clear();
    }
}