namespace SabaNews.Site.Extensions;

using System;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Fanex.Caching;
using Fanex.Data.Repository;
using Fanex.Logging;
using Livescore.Repositories.Interfaces;
using Livescore.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SabaNews.Core.Repositories;
using SabaNews.Core.Services;
using SabaNews.Livescore.Repositories;
using SabaNews.Livescore.Services;
using SabaNews.Services;
using SabaNews.Services.ExportExcel;
using SabaNews.Services.Interfaces;

public static class DI
{
    public static void RegisterServices(this IServiceCollection services)
    {

        //Base Service
        services.AddSingleton<IBaseService, BaseService>();
        services.AddSingleton<IDynamicRepository, DynamicRepository>();
        services.AddSingleton<IBaseRepository, BaseRepository>();
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddSingleton<ICacheService, CacheService>();
        services.AddSingleton<ICacheWrapperService, CacheWrapperService>();
        services.AddSingleton<ILogger, Logger>();
        services.AddSingleton<ILogServiceProvider, LogServiceProvider>();
        services.AddScoped<IBaseMailService, BaseMailService>();
        services.AddScoped<ISessionService, SessionService>();

        //LivescoreService
        services.AddScoped<IMatchRepository, MatchRepository>();
        services.AddScoped<ILeagueService, LeagueService>();
        services.AddScoped<IMatchService, MatchService>();

        //Other services
        services.AddTransient<ISerializerService, SerializerService>();
        services.AddTransient<IAuthService, AuthService>();
        services.AddTransient<IPostService, PostService>();
        services.AddTransient<IUserService, UserService>();
        services.AddTransient<IPathService, PathService>();
        services.AddTransient<IEmailService, EmailService>();

        services.AddTransient<IFetchDataService, FetchDataService>();
        services.AddTransient<IDataControlService, DataControlService>();
        services.AddTransient<ICommentService, CommentService>();
        services.AddTransient<IExternalAuthService, ExternalAuthService>();
        services.AddTransient<IStatisticService, StatisticService>();
        services.AddTransient<IPollService, PollService>();
        services.AddTransient<IBannerService, BannerService>();
        services.AddTransient<ILogService, Services.LogService>();
        services.AddTransient<IExportExcelService, ExportExcelService>();
        services.AddTransient<ICategoryService, CategoryService>();
        services.AddTransient<IFileService, FileService>();
        services.AddTransient<IWorldCupService, WorldCupService>();
        services.AddTransient<IOptionService, OptionService>();
        services.AddTransient<IEuro2024Service, Euro2024Service>();
    }

    public static void RegisterAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(options =>
        {
            options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
        }).AddCookie(options =>
        {
            options.Cookie.IsEssential = true;
            options.ExpireTimeSpan = TimeSpan.FromMinutes(int.Parse(configuration.GetSection("Authentication:SessionTimeOut").Value));
            options.Cookie.Name = ".Sabasports.Auth.SharedCookie";
        }).AddGoogle(options =>
        {
            AddGoogleAuthenticateOptions(options, configuration);
        }).AddFacebook(options =>
        {
            AddFacebookAuthenticateOptions(options, configuration);
        });
    }

    public static void RegisterCookiePolicy(this IServiceCollection services)
    {
        services.Configure<CookiePolicyOptions>(options =>
        {
            options.MinimumSameSitePolicy = SameSiteMode.Unspecified;
            options.OnAppendCookie = cookieContext =>
                CheckSameSite(cookieContext.Context, cookieContext.CookieOptions);
            options.OnDeleteCookie = cookieContext =>
                CheckSameSite(cookieContext.Context, cookieContext.CookieOptions);
        });
    }

    private static void CheckSameSite(HttpContext httpContext, CookieOptions options)
    {
        if (options.SameSite == SameSiteMode.None)
        {
            var userAgent = httpContext.Request.Headers["User-Agent"].ToString();
            if (DisallowsSameSiteNone(userAgent))
            {
                options.SameSite = SameSiteMode.Unspecified;
            }
        }
    }

    private static bool DisallowsSameSiteNone(string userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
        {
            return false;
        }

        if (userAgent.Contains("CPU iPhone OS 12") ||
            userAgent.Contains("iPad; CPU OS 12"))
        {
            return true;
        }

        if (userAgent.Contains("Macintosh; Intel Mac OS X 10_14") &&
            userAgent.Contains("Version/") && userAgent.Contains("Safari"))
        {
            return true;
        }

        if (userAgent.Contains("Chrome/5") || userAgent.Contains("Chrome/6"))
        {
            return true;
        }

        return false;
    }

    private static HttpClient GetDefaultHttpClient(IConfiguration configuration)
    {
        var isUseProxy = bool.Parse(configuration.GetSection("ProxySettings:IsUseProxy").Value);
        var proxyAddress = configuration.GetSection("ProxySettings:ProxyAddress").Value;
        var bypassOnLocal = bool.Parse(configuration.GetSection("ProxySettings:BypassProxyOnLocal").Value);

        HttpClient httpClient;

        if (isUseProxy)
        {
            var proxy = new WebProxy(proxyAddress, bypassOnLocal);
            var socketsHttpHandler = new SocketsHttpHandler
            {
                UseProxy = isUseProxy,
                Proxy = proxy
            };

            httpClient = new HttpClient(handler: socketsHttpHandler);
        }
        else
        {
            httpClient = new HttpClient();
        }

        return httpClient;
    }

    private static void AddGoogleAuthenticateOptions(GoogleOptions options, IConfiguration configuration)
    {
        options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.ClientId = configuration.GetValue<string>("Authentication:Google:ClientId");
        options.ClientSecret = configuration.GetValue<string>("Authentication:Google:ClientSecret");
        options.Backchannel = GetDefaultHttpClient(configuration);
        options.CorrelationCookie = new CookieBuilder
        {
            Expiration = TimeSpan.FromDays(1),
            Name = "Sabasports.Google.Cookie"
        };
        options.Events = new OAuthEvents
        {
            OnCreatingTicket = context =>
            {
                var picture = context.User.GetProperty("picture").GetString();

                context.Identity.AddClaim(new Claim(ClaimTypes.Thumbprint, picture));

                return Task.CompletedTask;
            },
            OnRemoteFailure = context =>
            {
                context.Response.Redirect("/");
                context.HandleResponse();
                return Task.CompletedTask;
            },
            OnAccessDenied = context =>
            {
                context.Response.Redirect("/");
                context.HandleResponse();
                return Task.CompletedTask;
            }
        };
    }

    private static void AddFacebookAuthenticateOptions(FacebookOptions options, IConfiguration configuration)
    {
        options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.ClientId = configuration.GetValue<string>("Authentication:Facebook:ClientId");
        options.ClientSecret = configuration.GetValue<string>("Authentication:Facebook:ClientSecret");
        options.Backchannel = GetDefaultHttpClient(configuration);

        options.CorrelationCookie = new CookieBuilder
        {
            Expiration = TimeSpan.FromDays(1),
            Name = "Sabasports.Facebook.Cookie"
        };
        options.Fields.Add("picture");
        options.Events = new OAuthEvents
        {
            OnCreatingTicket = context =>
            {
                var identity = (ClaimsIdentity)context.Principal.Identity;
                var profileImg = context.User.GetProperty("picture").GetProperty("data").GetProperty("url").GetString();
                identity.AddClaim(new Claim(ClaimTypes.Thumbprint, profileImg));
                return Task.CompletedTask;
            },
            OnRemoteFailure = context =>
            {
                context.Response.Redirect("/");
                context.HandleResponse();
                return Task.CompletedTask;
            },
            OnAccessDenied = context =>
            {
                context.Response.Redirect("/");
                context.HandleResponse();
                return Task.CompletedTask;
            }
        };
    }
}