namespace SabaNews.Services.UnitTests;

using AutoFixture;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.User;
using SabaNews.Models.User;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class UserServiceTests
{
    private IBaseService baseService;
    private ISessionService sessionService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task UpdateUserSavePostAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetUserService();
        var userID = fixture.Create<int>();
        var listPosts = fixture.Create<string>();
        var command = fixture.Create<UpdateUserSavePostCommand>();
        var expected = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateUserSavePostCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.UpdateUserSavePostAsync(userID, listPosts);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(userID, command.UserID);
        Assert.Equal(listPosts, command.ListPosts);
    }

    [Fact]
    public async Task GetUserByIdAsync_WhenCalled_ReturnExpectedUser()
    {
        //Arrange
        var service = GetUserService();
        var userID = fixture.Create<int>();
        var criteria = fixture.Create<GetUserByIdCriteria>();
        var expected = fixture.Create<UserSession>();
        baseService.GetDataEntityAsync<UserSession>(Arg.Do<GetUserByIdCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.GetUserByIdAsync(userID);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(userID, criteria.UserId);
    }

    [Fact]
    public async Task UpdateUserInfoAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetUserService();
        var param = fixture.Create<UserSession>();
        var command = fixture.Create<UpdateUserInfoCommand>();
        var expected = fixture.Create<CommandResult>();
        sessionService.User = param;
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateUserInfoCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.UpdateUserInfoAsync(param);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(param.Id, command.UserID);
        Assert.Equal(param.Name, command._name);
        Assert.Equal(param.Password, command._password);
        Assert.Equal(param.Phone, command._phone);
        Assert.Equal(param.Gender, command._gender);
        Assert.Equal(param.Photo, command._photo);
        Assert.Equal(param.IsSubscribe, command._isSubscribe);
    }

    [Fact]
    public async Task GetAllUserAsync_WhenCalled_ReturnExpectedUsers()
    {
        //Arrange
        var service = GetUserService();
        var param = fixture.Create<GetAllUserCriteria>();
        var criteria = fixture.Create<GetAllUserCriteria>();
        var expected = fixture.Create<IEnumerable<UserSession>>();
        baseService.GetDataAsync<UserSession>(Arg.Do<GetAllUserCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.GetAllUserAsync(param);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(param, criteria);
    }

    [Fact]
    public async Task GetUserReportAsync_WhenCalled_ReturnExpectedUsers()
    {
        //Arrange
        var service = GetUserService();
        var param = fixture.Create<GetUserReportCriteria>();
        var criteria = fixture.Create<GetUserReportCriteria>();
        var expected = fixture.Create<IEnumerable<UserReportModel>>();
        baseService.GetDataAsync<UserReportModel>(Arg.Do<GetUserReportCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.GetUserReportAsync(param);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(param, criteria);
    }

    [Fact]
    public async Task UnSubcriteUserAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetUserService();
        var userId = fixture.Create<int>();
        var token = fixture.Create<string>();
        var command = fixture.Create<UserUnsubribeCommand>();
        var expected = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<UserUnsubribeCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.UnSubcriteUserAsync(userId, token);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(userId, command.UserId);
        Assert.Equal(token, command.Token);
    }

    [Fact]
    public async Task DisconnectLoginTypeAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetUserService();
        var userId = fixture.Create<int>();
        var loginType = fixture.Create<string>();
        var command = fixture.Create<SocialDisconnectTypeCommand>();
        var expected = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<SocialDisconnectTypeCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.DisconnectLoginTypeAsync(userId, loginType);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(loginType, command.LoginType);
    }

    [Fact]
    public async Task CreateUserMembershipEventDataAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetUserService();
        var command = fixture.Create<CreateUserMembershipEventDataCommand>();
        var expected = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<CreateUserMembershipEventDataCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.CreateUserMembershipEventDataAsync(command);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public async Task GetUserMembershipEventDataAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetUserService();
        var criteria = fixture.Create<GetMembershipEventDataCriteria>();
        var expected = fixture.Create<IEnumerable<MembershipEventModel>>();
        baseService.GetDataAsync<MembershipEventModel>(Arg.Do<GetMembershipEventDataCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetUserMembershipEventDataAsync(criteria);

        //Assert
        Assert.Equal(expected, actual);

    }

    [Fact]
    public async Task GetDetailMembershipEventDataAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetUserService();
        var criteria = fixture.Create<GetDetailMembershipEventCriteria>();
        var expected = fixture.Create<MembershipEventModel>();
        baseService.GetDataEntityAsync<MembershipEventModel>(Arg.Do<GetDetailMembershipEventCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetDetailMembershipEventDataAsync(criteria);

        //Assert
        Assert.Equal(expected, actual);

    }

    [Fact]
    public async Task GetMembershipEventResultAsync_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetUserService();
        var criteria = fixture.Create<GetMembershipEventResultCriteria>();
        var expected = fixture.Create<IEnumerable<MembershipEventModel>>();
        baseService.GetDataAsync<MembershipEventModel>(Arg.Do<GetMembershipEventResultCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetMembershipEventResultAsync(criteria);

        //Assert
        Assert.Equal(expected, actual);

    }

    [Fact]
    public async Task GetUserForSendEmail_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetUserService();
        var criteria = fixture.Create<GetUserForSendEmailCriteria>();
        var expected = fixture.Create<IEnumerable<UserSendEmail>>();
        baseService.GetDataAsync<UserSendEmail>(Arg.Do<GetUserForSendEmailCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetUserForSendEmail(criteria);

        //Assert
        Assert.Equal(expected, actual);

    }

    #region Helpers
    private UserService GetUserService()
    {
        baseService = Substitute.For<IBaseService>();
        Substitute.For<ILogService>();
        sessionService = Substitute.For<ISessionService>();
        var service = new UserService(baseService);

        return service;
    }
    #endregion Helpers
}