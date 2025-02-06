namespace SabaNews.Services.Interfaces;

using SabaNews.Core.Models;
using SabaNews.Criteria.Comment;
using SabaNews.Models.Comment;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ICommentService
{
    Task<IEnumerable<Comment>> GetCommentsAsync(CmtGetParentAndNumberChildrenCriteria criteria);
    Task<IEnumerable<Comment>> GetCommentChildrenAsync(int postID, int commentID);
    Task<Comment> GetLikeDataAsync(long commentID);
    Task<long> CreateCommentAsync(CreateComment model);
    Task<CommandResult> UpdateLikeDataAsync(long commentID, string ipClient, string type);
}