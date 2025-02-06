namespace SabaNews.Site.UnitTests.Controllers;

using AutoFixture;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Comment;
using SabaNews.Models.Comment;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Controllers;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Models.ViewModel;
using Xunit;

public class CommentControllerTests : Controller
{
    private ICommentService commentService;
    private ISessionService sessionService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task GetChildrenComment_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var commentId = fixture.Create<int>();
        var expected = fixture.Create<IEnumerable<Comment>>();
        commentService.GetCommentChildrenAsync(Arg.Do<int>(x => postId = x), Arg.Do<int>(x => commentId = x)).Returns(expected);
        //Act
        var result = await controller.GetChildrenComment(postId, commentId);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var template = Assert.IsAssignableFrom<IEnumerable<Comment>>(jsonResult.Value.GetType().GetProperty("data").GetValue(jsonResult.Value));
        Assert.Equal(expected, template);
    }

    [Fact]
    public async Task GetComments_WhenInOtherPage_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var filterType = fixture.Create<string>();
        var page = fixture.Create<int>();
        var getMore = fixture.Create<bool>();
        var criteria = fixture.Create<CmtGetParentAndNumberChildrenCriteria>();
        var expected = fixture.Create<IEnumerable<Comment>>();
        commentService.GetCommentsAsync(Arg.Do<CmtGetParentAndNumberChildrenCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var result = await controller.GetComments(postId, filterType, page, getMore);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsType<CommentViewModel>(viewResult.Model);
        Assert.Equal(viewResult, result);
        Assert.Equal(getMore, viewModel.GetMore);
        Assert.Equal(expected, viewModel.CommentTemplate.Comments);
        Assert.Equal(filterType, viewModel.FilterType);
        Assert.False(viewModel.IsLogin);

    }

    [Fact]
    public async Task GetComments_WhenInFirstPage_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var filterType = fixture.Create<string>();
        var page = 1;
        var getMore = true;
        var criteria = fixture.Create<CmtGetParentAndNumberChildrenCriteria>();
        var expected = fixture.Create<IEnumerable<Comment>>();
        sessionService.User = new UserSession { Id = 1 };
        commentService.GetCommentsAsync(Arg.Do<CmtGetParentAndNumberChildrenCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var result = await controller.GetComments(postId, filterType, page, getMore);

        // Assert
        var viewResult = Assert.IsType<PartialViewResult>(result);
        var viewModel = Assert.IsType<CommentViewModel>(viewResult.Model);
        Assert.Equal(viewResult, result);
        Assert.False(viewModel.GetMore);
        Assert.Equal(expected, viewModel.CommentTemplate.Comments);
        Assert.Equal(filterType, viewModel.FilterType);
        Assert.True(viewModel.IsLogin);

    }

    [Fact]
    public async Task CreateComment_WhenCreateSuccessful_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var parent = fixture.Create<int>();
        var content = fixture.Create<string>();
        var model = fixture.Create<CreateComment>();
        var expected = fixture.Create<long>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        controller.ControllerContext.HttpContext.Request.Headers["x-forwarded-for"] = fixture.Create<string>();

        sessionService.User = fixture.Create<UserSession>();
        commentService.CreateCommentAsync(Arg.Do<CreateComment>(x => model = x)).Returns(expected);
        //Act
        var result = await controller.CreateComment(postId, parent, content);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var comment = Assert.IsAssignableFrom<CreateComment>(jsonResult.Value.GetType().GetProperty("comment").GetValue(jsonResult.Value));
        var isSuccessful = Assert.IsAssignableFrom<bool>(jsonResult.Value.GetType().GetProperty("isSuccessful").GetValue(jsonResult.Value));
        Assert.Equal(model, comment);
        Assert.Equal(expected != 0, isSuccessful);

    }

    [Fact]
    public async Task CreateComment_WhenCreatefailed_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var parent = fixture.Create<int>();
        var content = fixture.Create<string>();
        var model = fixture.Create<CreateComment>();
        var expected = 0;
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Headers["x-forwarded-for"] = fixture.Create<string>();

        sessionService.User = fixture.Create<UserSession>();
        commentService.CreateCommentAsync(Arg.Do<CreateComment>(x => model = x)).Returns(expected);
        //Act
        var result = await controller.CreateComment(postId, parent, content);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var comment = Assert.IsAssignableFrom<CreateComment>(jsonResult.Value.GetType().GetProperty("comment").GetValue(jsonResult.Value));
        var isSuccessful = Assert.IsAssignableFrom<bool>(jsonResult.Value.GetType().GetProperty("isSuccessful").GetValue(jsonResult.Value));
        Assert.Equal(model, comment);
        Assert.False(isSuccessful);

    }

    [Fact]
    public async Task CreateComment_WhenNotAuthenticate_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var postId = fixture.Create<int>();
        var parent = fixture.Create<int>();
        var content = fixture.Create<string>();
           

        //Act
        var result = await controller.CreateComment(postId, parent, content);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var isSuccessful = Assert.IsAssignableFrom<bool>(jsonResult.Value.GetType().GetProperty("isSuccessful").GetValue(jsonResult.Value));
        Assert.False(isSuccessful);

    }

    [Fact]
    public async Task Like_WhenNotAuthenticate_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var cmtId = fixture.Create<long>();
        var type = fixture.Create<string>();


        //Act
        var result = await controller.Like(cmtId, type);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var isSuccessful = Assert.IsAssignableFrom<bool>(jsonResult.Value.GetType().GetProperty("isSuccessful").GetValue(jsonResult.Value));
        Assert.False(isSuccessful);

    }

    [Fact]
    public async Task Like_WhenAuthenticated_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var cmtId = fixture.Create<long>();
        var type = fixture.Create<string>();
        var address = fixture.Create<string>();
        sessionService.User = fixture.Create<UserSession>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Headers["x-forwarded-for"] = "";
        controller.ControllerContext.HttpContext.Connection.RemoteIpAddress = fixture.Create<IPAddress>();
        var expected = fixture.Create<CommandResult>();
        commentService.UpdateLikeDataAsync(Arg.Do<long>(x => cmtId = x), Arg.Do<string>(x => address = x), Arg.Do<string>(x => address = x)).Returns(expected);
        //Act
        var result = await controller.Like(cmtId, type);

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(result);
        var actual = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expected, actual);

    }

    #region Helpers
    private CommentController GetController()
    {
        commentService = Substitute.For<ICommentService>();
        sessionService = Substitute.For<ISessionService>();
        var controller = new CommentController(commentService, sessionService);

        return controller;
    }
       
    #endregion Helpers
}