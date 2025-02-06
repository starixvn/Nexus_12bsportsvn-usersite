namespace SabaNews.Services.UnitTests;

using SabaNews.Core.Models;
using SabaNews.Criteria.Auth;
using System.Threading.Tasks;
using Xunit;
using AutoFixture;
using NSubstitute;
using SabaNews.Models.Auth;
using SabaNews.Core.Services;

public class ExternalAuthServiceTests
{
    private IBaseService baseService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task CreateUserAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetExternalAuthService();
        var model = fixture.Create<ExternalUser>();
        var expected = fixture.Create<CommandResult>();
        var criteria = new CreateSocialUserCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<CreateSocialUserCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.CreateUserAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model.DisplayName, criteria.DisplayName);
        Assert.Equal(model.Email, criteria.Email);
        Assert.Equal(model.FirstName, criteria.FirstName);
        Assert.Equal(model.Identifier, criteria.Identifier);
        Assert.Equal(model.LastName, criteria.LastName);
        Assert.Equal(model.LoginType, criteria.LoginType);

    }

    [Fact]
    public async Task GetUserAsync_WhenCalled_ReturnExpectedUserSessions()
    {
        //Arrange
        var service = GetExternalAuthService();
        var identifer = fixture.Create<string>();
        var loginType = fixture.Create<string>();
        var expected = fixture.Create<UserSession>();
        var criteria = new GetSocialUserCriteria();
        baseService.GetDataEntityAsync<UserSession>(Arg.Do<GetSocialUserCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetUserAsync(identifer, loginType) ;

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(identifer, criteria.Identifier);
        Assert.Equal(loginType, criteria.LoginType);
           

    }

    #region Helpers
    private ExternalAuthService GetExternalAuthService()
    {
        baseService = Substitute.For<IBaseService>();
           
        var service = new ExternalAuthService(baseService);

        return service;
    }
    #endregion Helpers
}