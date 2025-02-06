namespace SabaNews.Services;

using Newtonsoft.Json;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Comment;
using SabaNews.Models.Comment;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class CommentService(IBaseService baseService, ISessionService sessionService) : ICommentService
{
    public async Task<IEnumerable<Comment>> GetCommentsAsync(CmtGetParentAndNumberChildrenCriteria criteria)
    {
        var comments = await baseService.GetDataAsync<Comment>(criteria);
        return UpdateLikeComment(comments).ToList();
    }

    public async Task<IEnumerable<Comment>> GetCommentChildrenAsync(int postID, int commentID)
    {
        var criteria = new CmtGetChildrenCriteria
        {
            PostID = postID,
            CmtID = commentID
        };
        var comments = await baseService.GetDataAsync<Comment>(criteria);
        return UpdateLikeComment(comments).ToList();
    }

    public async Task<Comment> GetLikeDataAsync(long commentID)
    {
        var criteria = new CmtGetLikeDataCriteria
        {
            CommentID = commentID
        };
        return await baseService.GetDataEntityAsync<Comment>(criteria);
    }
    public async Task<long> CreateCommentAsync(CreateComment model)
    {
        var command = new CmtCreateCommand
        {
            CommentPostID = model.CommentPostID,
            CommentAuthor = model.CommentAuthor,
            CommentAuthorEmail = model.CommentAuthorEmail,
            CommentDate = model.CommentDate,
            CommentDateGMT = model.CommentDateGMT,
            CommentContent = model.CommentContent,
            CommentAgent = model.CommentAgent,
            CommentParent = model.CommentParent,
            CommentAuthorIP = model.CommentAuthorIP,
            UserID = model.UserID
        };

        var result = await baseService.ExecuteNonQueryAsync(command);
        return result.IsSuccessful ? (int)command.CommentID : 0;
    }

    public async Task<CommandResult> UpdateLikeDataAsync(long commentID, string ipClient, string type)
    {
        var currentUser = sessionService.User.Id;
        var comment = await GetLikeDataAsync(commentID);
        var likeCount = 0;
        var ips = "";
        var users = "";
        if (comment == null || comment.CommentLikeCount == 0 || string.IsNullOrEmpty(comment.CommentLikeUsers))
        {

            var arrUsers = new List<int> { currentUser };
            var arrIPs = new List<string> { ipClient };
            users = JsonConvert.SerializeObject(arrUsers);
            ips = JsonConvert.SerializeObject(arrIPs);
            likeCount = 1;
        }
        else
        {
            var arrUsers = JsonConvert.DeserializeObject<List<int>>(comment.CommentLikeUsers);
            var arrIPs = JsonConvert.DeserializeObject<List<string>>(comment.CommentLikeIPs);
            if (type == Constants.CommentTypeLike)
            {
                arrUsers.Add(currentUser);
                arrIPs.Add(ipClient);
                likeCount = (int)(comment.CommentLikeCount + 1);
            }
            else
            {
                arrUsers = arrUsers.FindAll(val => val != currentUser);
                arrIPs = arrIPs.FindAll(val => !val.Equals(ipClient));
                likeCount = arrUsers.Count;
            }
            users = JsonConvert.SerializeObject(arrUsers);
            ips = JsonConvert.SerializeObject(arrIPs);
                
        }
            
        var criteria = new CmtUpdateLikeCommand
        {
            CommentID = commentID,
            CommentLikeCount = likeCount,
            CommentLikeIPs = ips,
            CommentLikeUsers = users
        };
        return await baseService.ExecuteNonQueryAsync(criteria);
    }


    private IEnumerable<Comment> UpdateLikeComment(IEnumerable<Comment> comments)
    {
        var isAuthenticated = sessionService.User != null;
        if (!isAuthenticated)
        {
            return comments;
        }
        var currentUser = sessionService.User.Id;
        foreach (var comment in comments)
        {
            if (!string.IsNullOrEmpty(comment.CommentLikeUsers))
            {
                var arrUsers = JsonConvert.DeserializeObject<List<int>>(comment.CommentLikeUsers);
                var HasUser = arrUsers.FindIndex(item => item == currentUser);
                if (HasUser != -1)
                {
                    comment.isLiked = true;
                }
            }
        }
        return comments;
    }


}