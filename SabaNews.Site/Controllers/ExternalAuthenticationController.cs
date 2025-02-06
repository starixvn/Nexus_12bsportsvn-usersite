namespace SabaNews.Site.Controllers;

using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Services;
using SabaNews.Models.Auth;
using SabaNews.Services.Interfaces;

public class ExternalAuthenticationController(
    IExternalAuthService externalAuthService,
    ISessionService sessionService,
    IUserService userService) : Controller
{
    public IActionResult Login(string provider = GoogleDefaults.AuthenticationScheme, string returnUrl = null)
    {
        var redirectUrl = Url.Action("ExternalResponse", "ExternalAuthentication", new { provider, returnUrl }, Request.Scheme);
        var properties = new AuthenticationProperties { RedirectUri = redirectUrl };

        return Challenge(properties, provider);
    }

    public async Task<IActionResult> ExternalResponse(string provider, string returnUrl)
    {
        returnUrl ??= Constants.HomepageUrl;
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (result == null || result.Principal == null)
        {
            return Redirect(returnUrl);
        }
        var claims = result.Principal.Identities.FirstOrDefault()?.Claims;
        var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        if (sessionService.User != null && sessionService.User.Email != email)
        {
            var user = sessionService.User;
            user.ErrorConnectWrongEmail = true;
            sessionService.User = user;
            return Redirect(returnUrl);
        }
        var userInfo = GetExternalUserInfo(provider, claims);

        await SetSessionUserAsync(userInfo);

        await DoLoginAsync(userInfo.DisplayName, userInfo.Identifier);
            

        return Redirect(returnUrl);
    }

    private ExternalUser GetExternalUserInfo(string provider, IEnumerable<Claim> claims)
    {
        var userInfo = new ExternalUser
        {
            Identifier = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
            FirstName = claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value,
            LastName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value,
            DisplayName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
            Email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
            Avatar = claims.FirstOrDefault(c => c.Type == ClaimTypes.Thumbprint)?.Value,
            LoginType = provider
        };
        return userInfo;
    }

    private async Task SetSessionUserAsync(ExternalUser userInfo)
    {
        var user = await externalAuthService.GetUserAsync(userInfo.Identifier, userInfo.LoginType);
        if (user != null)
        {
            sessionService.User = user;
        }
        else
        {
            var result = await externalAuthService.CreateUserAsync(userInfo);
            user = await userService.GetUserByIdAsync(userInfo.Id);
            if (result.IsSuccessful)
            {
                sessionService.User = user;
            }
        }
    }

    private async Task DoLoginAsync(string name, string identify)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, name),
            new(ClaimTypes.NameIdentifier, identify)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }
}