namespace SabaNews.Core.UnitTests.Services;

using AutoFixture;
using Microsoft.AspNetCore.Http;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using Xunit;

public class SessionServiceTests
{
    private ISession session;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void WhenSetValue_CallExpectedFunction()
    {
        // Arrange
        var service = GetServiceWithAccesstor();
        var user = fixture.Create<UserSession>();
        user.SavedPosts = null;
        //Act
        service.User = user;
        //Assert
    }

    [Fact]
    public void WhenGetValue_CallExpectedFunction()
    {
        // Arrange
        var service = GetServiceWithSession();
        var user = fixture.Create<UserSession>();
        user.SavedPosts = null;
        service.User = user;
        //Act
        _ = service.User;

        // Assert
        session.Received().TryGetValue(Arg.Any<string>(), out Arg.Any<byte[]>());
    }

    [Fact]
    public void ClearAll_WhenCalled_CallExpectedFunction()
    {
        // Arrange
        var service = GetServiceWithSession();

        //Act
        service.ClearAll();

        // Assert
        session.Received().Clear();
    }

    #region Helpers

    private SessionService GetServiceWithSession()
    {
        session = Substitute.For<ISession>();

        var controller = new SessionService(session);

        return controller;
    }

    private SessionService GetServiceWithAccesstor()
    {
        var accessor = Substitute.For<IHttpContextAccessor>();

        var controller = new SessionService(accessor);

        return controller;
    }

    #endregion Helpers
}