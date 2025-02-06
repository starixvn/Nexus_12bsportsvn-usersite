namespace SabaNews.Services.UnitTests;

using AutoFixture;
using Microsoft.AspNetCore.Hosting;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Auth;
using SabaNews.Models.Auth;
using System.Threading.Tasks;
using Xunit;

public class AuthServiceTests
{
    private IBaseService baseService;
    private IWebHostEnvironment webHostEnvironment;
    private IBaseMailService mailService;
        

    [Fact]
    public async Task GetUserAsync_WhenCalled_ReturnExpectedUser()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var email = fixture.Create<string>();
        var expected = fixture.Create<UserSession>();
        var criteria = new GetUserLoginCriteria();
        baseService.GetDataEntityAsync<UserSession>(Arg.Do<GetUserLoginCriteria>(x => criteria = x)).Returns(expected);

        //Act
        var actual = await service.GetUserAsync(email);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(email, criteria.Email);
    }

    [Fact]
    public async Task CreateUserAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var param = fixture.Create<RegisterModel>();
        var expected = fixture.Create<CommandResult>();
        var command = new CreateUserCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<CreateUserCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.CreateUserAsync(param);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(param.Email, command._Email);
        Assert.Equal(param.Name, command._Name);
        Assert.Equal(param.Id, command.UserId);
    }

    [Fact]
    public void ComparePassword_WhenCalled_ReturnExpectedUser()
    {
        //Arrange
        var service = GetAuthService();
        var plainText = "123";
        var encrypt = BCrypt.Net.BCrypt.HashPassword("123");
           
        //Act
        var result = service.ComparePassword(plainText, encrypt);

        //Assert
        Assert.True(result);
    }

    [Fact]
    public async Task CreateTokenConfirmEmail_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var model = fixture.Create<ConfirmEmailModel>();
        fixture.Create<string>();
        fixture.Create<ConfirmEmailModel>();
        var expected = fixture.Create<CommandResult>();
        var command = new CreateTokenConfirmEmailCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<CreateTokenConfirmEmailCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.CreateTokenConfirmEmail(model);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(model.Email, command.Email);
        Assert.Equal(model.Token, command.Token);
    }

    [Fact]
    public async Task ConfirmEmailAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var userId = fixture.Create<int>();
        var token = fixture.Create<string>();
        var expected = fixture.Create<CommandResult>();
        var command = new ConfirmEmailCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<ConfirmEmailCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.ConfirmEmailAsync(userId, token);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(userId, command.Id);
        Assert.Equal(token, command.Token);
    }


    [Fact]
    public async Task CreateTokenResetPassword_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var email = fixture.Create<string>();
        var token = fixture.Create<string>();
        var expected = fixture.Create<CommandResult>();
        var command = new CreateTokenResetPasswordCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<CreateTokenResetPasswordCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.CreateTokenResetPassword(email, token);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(email, command.Email);
        Assert.Equal(token, command.Token);
    }

    [Fact]
    public async Task VerifyTokenResetPasswordAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var userId = fixture.Create<int>();
        var token = fixture.Create<string>();
        var expected = fixture.Create<CommandResult>();
        var command = new VerifyTokenResetPasswordCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<VerifyTokenResetPasswordCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.VerifyTokenResetPasswordAsync(userId, token);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(userId, command.Id);
        Assert.Equal(token, command.Token);
    }

    [Fact]
    public async Task ResetPasswordAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var model = fixture.Create<ResetPasswordModel>();
        var expected = fixture.Create<CommandResult>();
        var command = new ResetPasswordCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<ResetPasswordCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.ResetPasswordAsync(model);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(model.Id, command.Id);
        Assert.Equal(model.Token, command.Token);
    }

    [Fact]
    public async Task CreateUserSubscribeToken_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var model = fixture.Create<CreateUserSubscribeTokenCommand>();
        var expected = fixture.Create<CommandResult>();
        var command = new CreateUserSubscribeTokenCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<CreateUserSubscribeTokenCommand>(x => command = x)).Returns(expected);

        //Act
        var actual = await service.CreateUserSubscribeToken(model);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(model.UserId, command.UserId);
        Assert.Equal(model.Token, command.Token);
        Assert.Equal(model.CurrentToken, command.CurrentToken);
    }

    [Fact]
    public async Task SendMailAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var subject = fixture.Create<string>();
        var body = fixture.Create<string>();
        var email = fixture.Create<string>();
        var expected = fixture.Create<CommandResult>();
        var model = new MailModel();
        mailService.SendMailAsync(Arg.Do<MailModel>(x => model = x)).Returns(expected);

        //Act
        var actual = await service.SendMailAsync(subject, body, email);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(subject, model.Subject);
        Assert.Equal(body, model.Body);
        Assert.Equal(email, model.ReceiverEmail);
    }

    [Fact]
    public async Task SendMailResetPasswordAsync_WhenCalled_CallExpectedFunction()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var email = fixture.Create<string>();
        var url = fixture.Create<string>();
        var expected = fixture.Create<CommandResult>();
        var model = new MailModel();
        mailService.SendMailAsync(Arg.Do<MailModel>(x => model = x)).Returns(expected);
            
        //Act
        await service.SendMailResetPasswordAsync(email, url);

        //Assert
        Assert.Equal(email, model.ReceiverEmail);
        mailService.Received().ReadTextFile(Arg.Any<string>());
    }

    [Fact]
    public async Task SendMailConfirmationAsync_WhenCalled_CallExpectedFunction()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var email = fixture.Create<string>();
        var url = fixture.Create<string>();
        var expected = fixture.Create<CommandResult>();
        var model = new MailModel();
        mailService.SendMailAsync(Arg.Do<MailModel>(x => model = x)).Returns(expected);

        //Act
        await service.SendMailConfirmationAsync(email, url);

        //Assert
        Assert.Equal(email, model.ReceiverEmail);
        mailService.Received().ReadTextFile(Arg.Any<string>());
    }

    [Fact]
    public async Task SendMailEventAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetAuthService();
        var fixture = new Fixture();
        var subject = fixture.Create<string>();
        var body = fixture.Create<string>();
        var email = fixture.Create<string>();
        var expected = fixture.Create<CommandResult>();
        var model = new MailModel();
        mailService.SendMailAsync(Arg.Do<MailModel>(x => model = x)).Returns(expected);

        //Act
        var actual = await service.SendMailEventAsync(subject, body, email);

        //Assert
        Assert.Equal(expected, actual);

        Assert.Equal(subject, model.Subject);
        Assert.Equal(email, model.ReceiverEmail);
    }


    #region Helpers
    private AuthService GetAuthService()
    {
        baseService = Substitute.For<IBaseService>();
        webHostEnvironment = Substitute.For<IWebHostEnvironment>();
        mailService = Substitute.For<IBaseMailService>();
        var service = new AuthService(baseService, webHostEnvironment, mailService);

        return service;
    }

    #endregion Helpers
}