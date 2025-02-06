namespace SabaNews.Site.Controllers;

using System;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Email;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Models.ViewModel.Profile;
using SabaNews.Services.Interfaces;

public class ProfileController(
    IUserService userService,
    ISessionService sessionService,
    IPostService postService,
    IAuthService authService,
    IPathService pathService,
    IEmailService emailService) : Controller
{
    [Route("Profile")]
    public async Task<IActionResult> Index()
    {
        var isAuthenticated = sessionService.User != null;
        if (!isAuthenticated)
        {
            return Redirect(Constants.HomepageUrl);
        }

        var user = await userService.GetUserByIdAsync(sessionService.User.Id);
        if (user == null)
        {
            return Redirect(Constants.HomepageUrl);
        }
        sessionService.User = user;
        var model = new ProfileViewModel
        {
            Title = Constants.Profile + sessionService.User.Name + Constants.ProfileSiteName,
            Page = Constants.ProfileIndexPage,
            ErrorConnectEmail = sessionService.User.ErrorConnectWrongEmail,
            User = user
        };
        return View(model);
    }

    [HttpPost]
    public async Task<IActionResult> SavePost(int postID)
    {
        var isAuthenticated = sessionService.User != null;
        if (!isAuthenticated)
        {
            return Redirect(Constants.HomepageUrl);
        }

        var user = await userService.GetUserByIdAsync(sessionService.User.Id);
        var listSavePosts = user.HandleSavePosts;
        var post = listSavePosts.Find(val => val.PostID == postID);
        if (post != null)
        {
            listSavePosts = listSavePosts.FindAll(val => val.PostID != postID);
        }
        else
        {
            var newSavePost = new SavePost
            {
                PostID = postID,
                Date = DateTimeUtilize.Now().ToString("yyyy-MM-dd")
            };
            listSavePosts.Add(newSavePost);
        }
        var listPosts = JsonConvert.SerializeObject(listSavePosts);
        var commandResult = await userService.UpdateUserSavePostAsync(sessionService.User.Id, listPosts);
        if (commandResult.IsSuccessful)
        {
            user.SavedPosts = listPosts;
            user.HandleSavePosts = listSavePosts;
            sessionService.User = user;
        }
        return Json(commandResult);
    }

    public async Task<ActionResult> ListSavedPosts()
    {
        var isAuthenticated = sessionService.User != null;
        if (!isAuthenticated)
        {
            return Redirect(Constants.HomepageUrl);
        }

        var user = await userService.GetUserByIdAsync(sessionService.User.Id);
        var savedPosts = user.HandleSavePosts;
        var listPostID = string.Join(",", savedPosts.ConvertAll(val => val.PostID));
        var posts = await postService.GetSavedPostsByUserID(listPostID);
        var haveSavedToday = savedPosts.Find(val => val.Date == DateTimeUtilize.Now().ToString("yyyy-MM-dd"));
        var model = new SavedPostViewModel
        {
            Posts = posts,
            ToDayPost = haveSavedToday,
            User = user,
            Title = Constants.Profile + user.Name + Constants.ProfileSiteName,
            Page = Constants.ProfileListPostsPage
        };
        return View(model);
    }

    public async Task<ActionResult> UpdateProfile(string type, string value)
    {
        var isAuthenticated = sessionService.User != null;
        if (!isAuthenticated)
        {
            return Redirect(Constants.HomepageUrl);
        }

        var user = await userService.GetUserByIdAsync(sessionService.User.Id);
        switch (type)
        {
            case ProfileUpdateType.Phone:
                user.Phone = value;
                break;
            case ProfileUpdateType.Name:
                user.Name = value;
                break;
            case ProfileUpdateType.Gender:
                user.Gender = value;
                break;
            case ProfileUpdateType.YearOfBirth:
                user.YearOfBirth = value;
                break;
            case ProfileUpdateType.IsSubscribe:
                user.IsSubscribe = int.Parse(value);
                break;
            default:
                throw new InvalidOperationException();
        }
        var commandResult =  await userService.UpdateUserInfoAsync(user);
        if (commandResult.IsSuccessful)
        {
            sessionService.User = user;
        }
        return Json(commandResult);

    }

    public async Task<ActionResult> UpdateProfilePassword(string oldPassword, string newPassword)
    {
        var result = new CommandResult();
        var user = await userService.GetUserByIdAsync(sessionService.User.Id);
        if (!authService.ComparePassword(oldPassword, user.Password))
        {
            result.Message = Constants.WrongPassword;
            return Json(result);
        }
        user.Password = BCrypt.HashPassword(newPassword);
        result = await userService.UpdateUserInfoAsync(user);
        if (result.IsSuccessful)
        {
            sessionService.User = user;
        }
        return Json(result);

    }

    public async Task<ActionResult> UpdatePhoto(IFormFile file)
    {
        var isAuthenticated = sessionService.User != null;
        if (!isAuthenticated)
        {
            return Redirect(Constants.HomepageUrl);
        }
        var user = await userService.GetUserByIdAsync(sessionService.User.Id);
        var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
        filename = pathService.EnsureCorrectFilename(filename);
        filename = DateTimeUtilize.Now().Millisecond + filename ;
        var filePath = pathService.MapAbsoluteRootPath(Constants.UploadFolder + filename);
        await using (var output = System.IO.File.Create(filePath))
            await file.CopyToAsync(output);

        var oldPhoto = pathService.MapAbsoluteRootPath(Constants.UploadFolder + user.Photo);
        if (System.IO.File.Exists(oldPhoto))
        {
            System.IO.File.Delete(oldPhoto);
        }
        user.Photo = filename;
        var linkPhoto = "";
        var commandResult = await userService.UpdateUserInfoAsync(user);
        if (commandResult.IsSuccessful)
        {
            linkPhoto = Constants.UploadFolder + filename;
            sessionService.User = user;
        }
        return Json( new { commandResult, linkPhoto, filePath });
    }

    public async Task<ActionResult> SocialDisconnect(int userId, string type)
    {
        var commandResult = await userService.DisconnectLoginTypeAsync(userId, type);
        if (commandResult.IsSuccessful && string.IsNullOrEmpty(commandResult.Message) && string.IsNullOrEmpty(sessionService.User.Password))
        {
            sessionService.ClearAll();
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
        return Json(commandResult);
    }

    public IActionResult ConfirmUnsubscribe(int userId, string token)
    {
        var model = new UnsubscribeViewModel
        {
            UserId = userId,
            Token = token
        };
        return View(model);
    }

    [HttpPost]
    public async Task<ActionResult> Unsubscribe(int userId, string token)
    {
        var result = await userService.UnSubcriteUserAsync(userId, token);
        return PartialView("_Unsubscribe", result.IsSuccessful);
    }

    [Route("VerifySendEmailLink")]
    public async Task<ActionResult> VerifySendEmailLink(string returnUrl, string token = "")
    {
        if (token == "")
        {
            return Redirect(returnUrl ?? Constants.HomepageUrl);
        }
        var command = new VerifyTokenEmailDetailCommand
        {
            TokenId = token
        };
        var result = await emailService.VerifyTokenEmailDetailAsync(command);
        if (!result.IsSuccessful)
        {
            return View(Constants.NotfoundView);
        }
        return Redirect(returnUrl);
    }

        
}