using System;
using System.Linq;
using System.Net;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using System.Threading;
using Fanex.Caching.Redis;
using Fanex.Data.MySql;
using Fanex.Logging.Extensions;
using Fanex.Logging.Extensions.AspNetCore;
using Fanex.Logging.Extensions.Database;
using Fanex.Logging.Sentry;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NLog;
using NLog.Web;
using SabaNews.Core.Helper;
using SabaNews.Core.Middlewares;
using SabaNews.Core.Models;
using SabaNews.Site.Extensions;
using SabaNews.Site.Hubs;
using SabaNews.Site.Middlewares;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);
NLog.LogManager.Setup().LoadConfigurationFromFile("nlog.config").GetCurrentClassLogger();
var services = builder.Services;
var configuration = builder.Configuration;
var env = builder.Environment;
builder.Logging.ClearProviders();
builder.Host.UseNLog();

services.AddFanexSql(configuration);
services.AddFanexLogSentry(configuration);

ExceptionHandler
    .UseConfig(new LoggingConfiguration())
    .UseGetDbExceptionInfo(DatabaseInfoGetters.GetDbExceptionInfo);

services.AddAntiforgery(o => o.HeaderName = "XSRF-TOKEN");

services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

var redisConfig = configuration.GetSection("RedisConfig:ConnectionString").Value;
var appName = configuration.GetSection("RedisConfig:ApplicationName").Value;
var redis = ConnectionMultiplexer.Connect(configuration.GetSection("RedisConfig:ConnectionString").Value);
services.AddDataProtection()
    .SetApplicationName(appName)
    .PersistKeysToStackExchangeRedis(redis, $"{appName}:DataProtection:Keys");

services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConfig;
    options.InstanceName = $"{appName}:Session:";
});

services.AddSignalR(hubOptions =>
{
    hubOptions.EnableDetailedErrors = true;
    hubOptions.MaximumReceiveMessageSize = int.Parse(configuration.GetSection("SignalRMaximumReceiveMessageSize").Value);
}).AddStackExchangeRedis(redisConfig, options =>
{
    options.Configuration.ChannelPrefix = $"{appName}:SignalR";
});

services.RegisterCookiePolicy();

services.RegisterAuthentication(configuration);

services.AddSession(options =>
{
    options.Cookie.Name = ".SabaSports.Session";
    options.IdleTimeout = TimeSpan.FromMinutes(int.Parse(configuration.GetSection("Authentication:SessionTimeOut").Value));
    options.Cookie.IsEssential = true;
});
services.AddRedisCache(configuration.GetSection("RedisConfig"));

services.Configure<MailConfigs>(options => configuration.GetSection("MailConfigs").Bind(options));
services.Configure<LivescoreMainPageCacheConfig>(options => configuration.GetSection("LivescoreMainPageCacheConfig").Bind(options));
services.Configure<RouteOptions>(options => {
    options.ConstraintMap.Add("categoryslug", typeof(CategoryConstraint));
});

services.AddResponseCompression(options => {
    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
        ["text/javascript"]
    );
});
services.AddResponseCaching();
services.AddSingleton(configuration);

services.AddSingleton(HtmlEncoder.Create(allowedRanges: UnicodeRanges.All));

var umSettings = configuration.GetSection(UMSettings.SettingKey).Get<UMSettings>();
services.AddSingleton(umSettings);

services.RegisterServices();
services.AddHttpClient();
services.AddControllersWithViews();

const short WorkerThreads = 300;
const short CompletionPortThreads = 300;
_ = ThreadPool.SetMinThreads(WorkerThreads, CompletionPortThreads);

var app = builder.Build();
if (env.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseMiddleware<ErrorHandler>();
    app.UseHsts();
    app.UseHttpsRedirection();

    app.Use((context, next) =>
    {
        context.Response.Headers.Remove("X-Frame-Options");
        context.Response.Headers["X-Frame-Options"] = "AllowAll";

        if (context.Request.Headers["x-forwarded-proto"] == "https")
        {
            context.Request.Scheme = "https";
        }
        return next();
    });
}
var isUM = bool.Parse(configuration.GetSection("UMSettings:Enabled").Value);
if (isUM)
{
    app.UseWhen(
    context => !context.Request.Path.StartsWithSegments("/maintenance", StringComparison.OrdinalIgnoreCase),
    appBuilder =>
    {
        appBuilder.UseMiddleware<MaintenanceMiddleware>();
    });
}
app.Use(async (ctx, next) =>
{
    await next();

    if (ctx.Response.StatusCode == (int)HttpStatusCode.NotFound && !ctx.Response.HasStarted)
    {
        ctx.Request.Path = "/404";
        await next();
    }
});
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.All
});
app.UseResponseCaching();
app.UseResponseCompression();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = context =>
    {
        // Cache static file for 1 year
        if (!string.IsNullOrEmpty(context.Context.Request.Query["v"]))
        {
            context.Context.Response.Headers.Add("cache-control", new[] { "public,max-age=31536000" });
            context.Context.Response.Headers.Add("Expires", new[] { DateTimeUtilize.UtcNow().AddYears(1).ToString("R") }); // Format RFC1123
        }
    }
});

app.UseRouting();

app.UseCookiePolicy();
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.MapControllerRoute(
    name: "Admin",
    pattern: "{area:exists}/{controller=Statistic}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapHub<LivescoreHub>("/livescore/hubs", options =>
{
    options.Transports = HttpTransportType.WebSockets;
});

await app.RunAsync();