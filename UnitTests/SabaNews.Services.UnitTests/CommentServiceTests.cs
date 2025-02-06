namespace SabaNews.Services.UnitTests;

using AutoFixture;
using Newtonsoft.Json;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Comment;
using SabaNews.Models.Comment;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class CommentServiceTests
{
    private IBaseService baseService;
    private ISessionService sessionService;

    [Fact]
    public async Task GetCommentsAsync_WhenCalled_ReturnExpectedComments()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        sessionService.User = null;
        var model = fixture.Create<CmtGetParentAndNumberChildrenCriteria>();
        var expected = GetExpectedComment();
        var criteria = new CmtGetParentAndNumberChildrenCriteria();
        baseService.GetDataAsync<Comment>(Arg.Do<CmtGetParentAndNumberChildrenCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetCommentsAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model.PostID, criteria.PostID);
        Assert.Equal(model.FilterType, criteria.FilterType);
            
    }

    [Fact]
    public async Task GetCommentChildrenAsync_WhenCalled_ReturnExpectedComments()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        var postId = fixture.Create<int>();
        var commentId = fixture.Create<int>();
        var expected = GetExpectedComment();
        var criteria = new CmtGetChildrenCriteria();
        baseService.GetDataAsync<Comment>(Arg.Do<CmtGetChildrenCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetCommentChildrenAsync(postId, commentId);
            
        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(postId, criteria.PostID);
        Assert.Equal(commentId, criteria.CmtID);
    }

    [Fact]
    public async Task GetLikeDataAsync_WhenCalled_ReturnExpectedComment()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        var commentID = fixture.Create<long>();
        var expected = fixture.Create<Comment>();
        var criteria = new CmtGetLikeDataCriteria();
        baseService.GetDataEntityAsync<Comment>(Arg.Do<CmtGetLikeDataCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetLikeDataAsync(commentID);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(commentID, criteria.CommentID);
        Assert.NotNull(expected.CommentTime);
    }


    [Fact]
    public async Task CreateCommentAsync_WhenActionSuccessful_ReturnExpectedCommentID()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        var model = fixture.Create<CreateComment>();
        var expected = new CommandResult { Code = 0 };
        var criteria = new CmtCreateCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<CmtCreateCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.CreateCommentAsync(model);

        //Assert
        Assert.Equal(criteria.CommentID, actual);
        Assert.Equal(model.CommentPostID, criteria.CommentPostID);
        Assert.Equal(model.CommentAuthor, criteria.CommentAuthor);
        Assert.Equal(model.CommentAuthorEmail, criteria.CommentAuthorEmail);
        Assert.Equal(model.CommentDate, criteria.CommentDate);
        Assert.Equal(model.CommentDateGMT, criteria.CommentDateGMT);
        Assert.Equal(model.CommentContent, criteria.CommentContent);
        Assert.Equal(model.CommentAgent, criteria.CommentAgent);
        Assert.Equal(model.CommentParent, criteria.CommentParent);
        Assert.Equal(model.CommentAuthorIP, criteria.CommentAuthorIP);
        Assert.Equal(model.UserID, criteria.UserID);
    }

    [Fact]
    public async Task CreateCommentAsync_WhenActionFailed_ReturnExpectedCommentID()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        var model = fixture.Create<CreateComment>();
        var expected = new CommandResult { Code = 1 };
        var criteria = new CmtCreateCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<CmtCreateCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.CreateCommentAsync(model);

        //Assert
        Assert.Equal(0, actual);
        Assert.Equal(model.CommentPostID, criteria.CommentPostID);
        Assert.Equal(model.CommentAuthor, criteria.CommentAuthor);
        Assert.Equal(model.CommentAuthorEmail, criteria.CommentAuthorEmail);
        Assert.Equal(model.CommentDate, criteria.CommentDate);
        Assert.Equal(model.CommentDateGMT, criteria.CommentDateGMT);
        Assert.Equal(model.CommentContent, criteria.CommentContent);
        Assert.Equal(model.CommentAgent, criteria.CommentAgent);
        Assert.Equal(model.CommentParent, criteria.CommentParent);
        Assert.Equal(model.CommentAuthorIP, criteria.CommentAuthorIP);
        Assert.Equal(model.UserID, criteria.UserID);
    }

    [Fact]
    public async Task UpdateLikeDataAsync_WhenCommentIsNull_ReturnExpectedCommendResult()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        var commentId = fixture.Create<long>();
        var clientIp = fixture.Create<string>();
        var type = fixture.Create<string>();
        Comment comment = null;
        var expected = fixture.Create<CommandResult>();
        var criteria = new CmtUpdateLikeCommand();
        service.GetLikeDataAsync(commentId).Returns(comment);
        baseService.ExecuteNonQueryAsync(Arg.Do<CmtUpdateLikeCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.UpdateLikeDataAsync(commentId, clientIp, type);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(commentId, criteria.CommentID);
        Assert.Equal(1, criteria.CommentLikeCount);
    }

    [Fact]
    public async Task UpdateLikeDataAsync_LikeCountIsZero_ReturnExpectedCommendResult()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        var commentId = fixture.Create<long>();
        var clientIp = fixture.Create<string>();
        var type = fixture.Create<string>();
        var comment = new Comment { CommentID = 1, CommentLikeCount = 0, CommentLikeIPs = "[1,2]", CommentLikeUsers = "[1]", CommentDateGMT = DateTime.UtcNow.AddSeconds(-10) };
        var expected = fixture.Create<CommandResult>();
        var criteria = new CmtUpdateLikeCommand();
        service.GetLikeDataAsync(commentId).Returns(comment);
        baseService.ExecuteNonQueryAsync(Arg.Do<CmtUpdateLikeCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.UpdateLikeDataAsync(commentId, clientIp, type);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(commentId, criteria.CommentID);
        Assert.Equal(1, criteria.CommentLikeCount);
        Assert.Equal("10 giây trước", comment.CommentTime);
    }

    [Fact]
    public async Task UpdateLikeDataAsync_NotExitstUserLiked_ReturnExpectedCommendResult()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        var commentId = fixture.Create<long>();
        var clientIp = fixture.Create<string>();
        var type = fixture.Create<string>();
        var comment = new Comment { CommentID = 1, CommentLikeCount = 1, CommentLikeIPs = "[1,2]", CommentLikeUsers = "", CommentDateGMT = DateTime.UtcNow.AddMinutes(-10) };
        var expected = fixture.Create<CommandResult>();
        var criteria = new CmtUpdateLikeCommand();
        service.GetLikeDataAsync(commentId).Returns(comment);
        baseService.ExecuteNonQueryAsync(Arg.Do<CmtUpdateLikeCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.UpdateLikeDataAsync(commentId, clientIp, type);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(commentId, criteria.CommentID);
        Assert.Equal(1, criteria.CommentLikeCount);
        Assert.Equal("10 phút trước", comment.CommentTime);
    }

    [Fact]
    public async Task UpdateLikeDataAsync_WhenLikedAlready_ReturnExpectedCommendResult()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        var commentId = fixture.Create<long>();
        var clientIp = fixture.Create<string>();
        var type = "like";
            
        var comment = new Comment { CommentID = 1, CommentLikeCount = 2, CommentLikeIPs = "[1,2]", CommentLikeUsers = "[2]", CommentDateGMT = DateTime.UtcNow.AddHours(-2) };
        var arrUsers = JsonConvert.DeserializeObject<List<int>>(comment.CommentLikeUsers);
        var arrIPs = JsonConvert.DeserializeObject<List<string>>(comment.CommentLikeIPs);
        arrUsers.Add(sessionService.User.Id);
        arrIPs.Add(clientIp);
        var getCmtCriteria = fixture.Create<CmtGetLikeDataCriteria>();
        var criteria = new CmtUpdateLikeCommand();

        var expected = fixture.Create<CommandResult>();

        baseService.GetDataEntityAsync<Comment>(Arg.Do<CmtGetLikeDataCriteria>(x => getCmtCriteria = x)).Returns(comment);
        baseService.ExecuteNonQueryAsync(Arg.Do<CmtUpdateLikeCommand>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.UpdateLikeDataAsync(commentId, clientIp, type);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(commentId, criteria.CommentID);
        Assert.Equal(comment.CommentLikeCount + 1, criteria.CommentLikeCount);
        Assert.Equal("2 giờ trước", comment.CommentTime);
    }

    [Fact]
    public async Task UpdateLikeDataAsync_WhenDislike_ReturnExpectedCommendResult()
    {
        //Arrange
        var service = GetCommentService();
        var fixture = new Fixture();
        var commentId = fixture.Create<long>();
        var clientIp = fixture.Create<string>();
        var type = fixture.Create<string>();

        var comment = new Comment { CommentID = 1, CommentLikeCount = 2, CommentLikeIPs = "[1,2]", CommentLikeUsers = "[1,2]" };
        var arrUsers = JsonConvert.DeserializeObject<List<int>>(comment.CommentLikeUsers);
        var arrIPs = JsonConvert.DeserializeObject<List<string>>(comment.CommentLikeIPs);
        arrUsers.Add(sessionService.User.Id);
        arrIPs.Add(clientIp);
        var getCmtCriteria = fixture.Create<CmtGetLikeDataCriteria>();
        var criteria = new CmtUpdateLikeCommand();

        var expected = fixture.Create<CommandResult>();

        baseService.GetDataEntityAsync<Comment>(Arg.Do<CmtGetLikeDataCriteria>(x => getCmtCriteria = x)).Returns(comment);
        baseService.ExecuteNonQueryAsync(Arg.Do<CmtUpdateLikeCommand>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.UpdateLikeDataAsync(commentId, clientIp, type);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(commentId, criteria.CommentID);
        Assert.Equal(comment.CommentLikeCount - 1, criteria.CommentLikeCount);
    }

    private static List<Comment> GetExpectedComment()
    {
        var expected = new List<Comment>
        {
            new() { CommentID = 1, CommentLikeUsers = "[1]", isLiked = false, CommentDateGMT = DateTime.UtcNow.AddSeconds(-10) },
            new() { CommentID = 2, CommentLikeUsers = "[2]", isLiked = false, CommentDateGMT = DateTime.UtcNow.AddMinutes(-10) },
            new() { CommentID = 3, CommentLikeUsers = "[3]", isLiked = false, CommentDateGMT = DateTime.UtcNow.AddHours(-1) }
        };
        return expected;

    }



    #region Helpers
    private CommentService GetCommentService()
    {
        baseService = Substitute.For<IBaseService>();
        sessionService = Substitute.For<ISessionService>();
        sessionService.User = new UserSession { Id = 1, Metadata = "customer" };
        var service = new CommentService(baseService, sessionService);

        return service;
    }

    #endregion Helpers
}