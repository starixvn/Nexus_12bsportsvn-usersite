namespace SabaNews.Site.Controllers;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Comment;
using SabaNews.Models.Comment;
using SabaNews.Services.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;
using Models.ViewModel;

public class CommentController(ICommentService commentService, ISessionService sessionService) : Controller
{
    [Route("/comments/getchildren")]
    public async Task<IActionResult> GetChildrenComment(int postID, int commentID)
    {
        var comments = await commentService.GetCommentChildrenAsync(postID, commentID);
        return Json(new { data = comments });
    }

    [Route("/comments")]
    public async Task<IActionResult> GetComments(int postID, string filterType, int page, bool getMore = false)
    {
        var start = (page - 1) * Constants.Perpage;
        var criteria = new CmtGetParentAndNumberChildrenCriteria
        {
            PostID = postID,
            FilterType = filterType,
            Start = start, 
            End = Constants.Perpage
        };
        var comments = await commentService.GetCommentsAsync(criteria);
        var commentTemplate = new CommentTemplate
        {
            Comments = comments,
            TotalItems = criteria.TotalItems,
            TotalParentCmt = criteria.TotalParentCmt
        };
        if (page == 1 && comments.Count() <= Constants.GetFiveItems && getMore)
        {
            getMore = false;
        }
        var paging = new PagingModel
        {
            CurrentPage = page,
            PageSize = Constants.Perpage,
            TotalPages = (int)Math.Ceiling(criteria.TotalParentCmt / (double)Constants.Perpage)
        };
        var model = new CommentViewModel
        {
            CommentTemplate = commentTemplate,
            Paging = paging,
            FilterType  = filterType,
            IsLogin = sessionService.User != null,
            GetMore = getMore
        };
        return PartialView("_Comments", model);
    }

    [HttpPost]
    [Route("/comments/create")]
    public async Task<IActionResult> CreateComment(int postID, int parent, string commentContent)
    {
        var isAuthenticated = sessionService.User != null;
        if (!isAuthenticated) {
            return Json(new { isSuccessful = false });
        }
        var remoteIpAddress = GetRemoteIpAddress();
            
        var model = new CreateComment
        {
            CommentPostID = postID,
            CommentAuthor = sessionService.User.Name,
            CommentAuthorEmail = sessionService.User.Email,
            CommentAuthorIP = remoteIpAddress,
            CommentDate = DateTimeUtilize.Now(),
            CommentDateGMT = DateTimeUtilize.UtcNow(),
            CommentContent = commentContent,
            CommentAgent = Request.Headers["User-Agent"].ToString(),
            CommentParent = parent,
            UserID = sessionService.User.Id,
            Photo = sessionService.User.Photo
        };
        var result = await commentService.CreateCommentAsync(model);
        model.CommentID = result;
        return Json(new { isSuccessful = result != 0, comment = model });
    }

    [HttpPost]
    [Route("/comments/like")]
    public async Task<IActionResult> Like(long commentID, string type)
    {
        var isAuthenticated = sessionService.User != null;
        if (!isAuthenticated)
        {
            return Json(new { isSuccessful = false });
        }
        var remoteIpAddress = GetRemoteIpAddress();
        var commandResult = await commentService.UpdateLikeDataAsync(commentID, remoteIpAddress, type);
        return Json(commandResult);
    }

    public string GetRemoteIpAddress()
    {
        var clientIP = HttpContext.Request.Headers["x-forwarded-for"].ToString();
        if (string.IsNullOrWhiteSpace(clientIP))
        {
            clientIP = HttpContext.Connection.RemoteIpAddress.ToString();
        }
        return clientIP;
    }
}