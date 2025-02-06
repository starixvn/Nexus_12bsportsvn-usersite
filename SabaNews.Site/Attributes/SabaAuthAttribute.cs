namespace SabaNews.Site.Attributes;

using System;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SabaNews.Core.Constants;
using SabaNews.Core.Extensions;
using SabaNews.Core.Models;

[AttributeUsage(AttributeTargets.Class)]
public class SabaAuthAttribute : Attribute, IAuthorizationFilter
{
    public string Role { get; set; }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var userSession = context.HttpContext.Session.Get<UserSession>(SessionKey.User);
        if (userSession is null || userSession.Id == 0)
        {
            UnauthorizedResponse(context);
            return;
        }

        if (!string.IsNullOrWhiteSpace(Role) && !IsValidRole(userSession))
        {
            UnauthorizedResponse(context);
        }
    }

    private bool IsValidRole(UserSession userSession)
        => userSession.Metadata.Contains(Role);

    private static void UnauthorizedResponse(AuthorizationFilterContext context)
    {
        context.HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        context.Result = new RedirectResult("/");
    }
}