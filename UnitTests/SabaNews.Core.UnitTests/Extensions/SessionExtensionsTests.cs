using Fanex.Data;
using Microsoft.AspNetCore.Http;
using NSubstitute;
using SabaNews.Core.Extensions;
using Xunit;

namespace SabaNews.Core.UnitTests.Extensions;

public class SessionExtensionsTests
{
    public SessionExtensionsTests()
    {
        DbSettingProviderManager
            .StartTestingSession()
            .Run();
    }

    [Fact]
    public void SetObject_RunAsExpected()
    {
        // Arrange
        var session = Substitute.For<ISession>();

        // Act
        session.SetObject("test", "test");

        //Assert
        session.Received().Set("test", Arg.Any<byte[]>());

    }


    [Fact]
    public void Get_WrongKey_ReturnNull()
    {
        // Arrange
        var session = Substitute.For<ISession>();
        // Act
        var result = session.Get("test");

        //Assert
        Assert.Null(result);

    }


    [Fact]
    public void Get_RightKey_RunAsExpected()
    {
        // Arrange
        var session = Substitute.For<ISession>();
        session.TryGetValue("test", out var expected).Returns(true);

        // Act
        var result = session.Get<byte[]>("test");

        //Assert
        Assert.Equal(expected, result);

    }
}