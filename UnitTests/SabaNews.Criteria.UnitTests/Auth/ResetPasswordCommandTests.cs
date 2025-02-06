namespace SabaNews.Criteria.UnitTests.Auth;

using SabaNews.Criteria.Auth;
using Xunit;

public class ResetPasswordCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new ResetPasswordCommand();
        var expected = "user_reset_password";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }



    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new ResetPasswordCommand
        {
            Id = 1,
            _Password = "password",
            Token = "token"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}