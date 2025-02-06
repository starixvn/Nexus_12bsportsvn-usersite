namespace SabaNews.Site.Controllers;

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models.Auth;
using SabaNews.Services.Interfaces;

public class AuthController(
    IAuthService authService,
    ISessionService sessionService) : Controller
{
    private const string LoginForm = "login";

    public IActionResult Index(string openForm)
    {
        var form = openForm == LoginForm ? "_Login" : "_Register";
        return PartialView(form);
    }

    [HttpPost]
    public async Task<IActionResult> Login(LoginModel model)
    {
        var user = await authService.GetUserAsync(model.Email);
        if (user != null && !string.IsNullOrEmpty(user.Password) && authService.ComparePassword(model.Password, user.Password))
        {
            await DoLoginAsync(user.Name, user.Email);
            user.LoginType = LoginType.Internal;
            sessionService.User = user;
            return Json(new CommandResult { Code = 0, Message = string.Empty });
        }
        return Json(new CommandResult { Code = 1, Message = Constants.WrongUsernameOrPassword });
    }

    [HttpPost]
    public async Task<IActionResult> Register(RegisterModel model)
    {
        var commandResult = new CommandResult
        {
            Message = Constants.InvalidData
        };
        if (!ModelState.IsValid)
        {
            return Json(commandResult);
        }
        commandResult = await authService.CreateUserAsync(model);
        if (commandResult.IsSuccessful || commandResult.Code == 2)
        {
            var token = Guid.NewGuid().ToString();
            var createTokenResult = await authService.CreateTokenConfirmEmail(new ConfirmEmailModel { Email = model.Email, Token = token });
            if (!createTokenResult.IsSuccessful)
            {
                return Json(createTokenResult);
            }
            var url = Url.Action("ConfirmEmail", "Auth", new { UserId = model.Id, token }, Request.Scheme);
            await authService.SendMailConfirmationAsync(model.Email, url);
        }
        return Json(commandResult);
    }

    [HttpGet]
    public IActionResult SendEmailConfirm()
    {
        return PartialView("_ConfirmEmail");
    }

    [HttpPost]
    public async Task<IActionResult> SendEmailConfirm(string email)
    {
        var token = Guid.NewGuid().ToString();
        var model = new ConfirmEmailModel { Email = email, Token = token };
        var commandResult = await authService.CreateTokenConfirmEmail(model);
        if (!commandResult.IsSuccessful)
        {
            return Json(commandResult);
        }
        var url = Url.Action("ConfirmEmail", "Auth", new { model.UserId, token }, Request.Scheme);
        await authService.SendMailConfirmationAsync(email, url);
        return Json(commandResult);
    }

    [HttpGet]
    public async Task<IActionResult> ConfirmEmail(int userId, string token)
    {
        var commandResult = await authService.ConfirmEmailAsync(userId, token);
        if (!commandResult.IsSuccessful && sessionService.User != null)
        {
            return Redirect("/");
        }
        return View(commandResult.IsSuccessful);
    }

    [HttpGet]
    public IActionResult ForgotPassword()
    {
        return PartialView("_ForgotPassword");
    }

    [HttpPost]
    public async Task<IActionResult> ForgotPassword(string email)
    {
        var token = Guid.NewGuid().ToString();
        var commandResult = await authService.CreateTokenResetPassword(email, token);
        if (!commandResult.IsSuccessful)
        {
            return Json(commandResult);
        }
        var user = await authService.GetUserAsync(email);
        var url = Url.Action("ResetPassword", "Auth", new { UserId = user.Id, token }, Request.Scheme);
        await authService.SendMailResetPasswordAsync(user.Email, url);
        return Json(commandResult);
    }

    //verify token
    [HttpGet]
    public async Task<IActionResult> ResetPassword(int userId, string token)
    {
        var commandResult = await authService.VerifyTokenResetPasswordAsync(userId, token);
        ViewBag.UserId = userId;
        ViewBag.Token = token;
        return View(commandResult.IsSuccessful);
    }

    //submit new password
    [HttpPost]
    public async Task<IActionResult> ResetPassword(ResetPasswordModel model)
    {
        var commandResult = await authService.ResetPasswordAsync(model);
        return Json(commandResult);
    }

    public async Task<IActionResult> Logout(string returnUrl)
    {
        sessionService.ClearAll();
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        if (string.IsNullOrWhiteSpace(returnUrl))
        {
            returnUrl = "/";
        }
        return Redirect(returnUrl);
    }

    private async Task DoLoginAsync(string name, string email)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, name),
            new(ClaimTypes.Email, email)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }
}