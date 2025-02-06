namespace SabaNews.Core.Middlewares;

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SabaNews.Core.Services;

public class ErrorHandler(RequestDelegate next, ILogServiceProvider logService)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await logService.WriteExceptionSentryErrorAsync(ex);
        }
    }
}