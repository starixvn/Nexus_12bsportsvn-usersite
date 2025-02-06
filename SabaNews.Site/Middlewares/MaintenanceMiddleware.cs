namespace SabaNews.Site.Middlewares;

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using SabaNews.Core.Models;
using SabaNews.Core.Services;

public class MaintenanceMiddleware(RequestDelegate next, UMSettings umSettings, ILogServiceProvider logServiceProvider)
{
    public async Task Invoke(HttpContext context)
    {
        if (umSettings.Enabled && !IsBackdoorIPs(context) && !IsWhiteListUrl(context))
        {
            context.Response.Redirect("/maintenance");
            return;
        }
        await next.Invoke(context);
    }

    private bool IsBackdoorIPs(HttpContext context)
    {
        var currentIP = GetClientIPAddress(context);
        var IsBackdoorIPs = umSettings.WhiteListIPs.Exists(ip =>
            currentIP.Contains(ip, StringComparison.OrdinalIgnoreCase));

        return IsBackdoorIPs;
    }

    private bool IsWhiteListUrl(HttpContext context)
    {
        var currentPath = context.Request.Path.Value;
        var isWhiteListUrl = umSettings.WhiteListUrls.Exists(url => currentPath.Contains(url, StringComparison.OrdinalIgnoreCase));
        logServiceProvider.WriteLogFileInfo($"IP {GetClientIPAddress(context)}; Current url: {currentPath}; IsWhiteList: {isWhiteListUrl}");
        return isWhiteListUrl;
    }

    private static string GetClientIPAddress(HttpContext context)
    {
        var ip = string.Empty;
        if (!string.IsNullOrEmpty(context.Request.Headers["X-Forwarded-For"]))
        {
            ip = context.Request.Headers["X-Forwarded-For"];
        }
        else
        {
            ip = context.Request.HttpContext.Features.Get<IHttpConnectionFeature>().RemoteIpAddress.ToString();
        }
        return ip;
    }
}