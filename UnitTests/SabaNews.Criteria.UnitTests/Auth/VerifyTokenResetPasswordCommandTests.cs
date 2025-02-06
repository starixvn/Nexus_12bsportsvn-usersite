namespace SabaNews.Criteria.UnitTests.Auth;

using SabaNews.Criteria.Auth;
using Xunit;

public class VerifyTokenResetPasswordCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new VerifyTokenResetPasswordCommand();
        var expected = "user_verify_token_reset";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(0, "token")]
    [InlineData(1, "")]
    public void IsValid_WhenCalled_ReturnFalse(int id, string token)
    {
        // Arrange
        var criteria = new VerifyTokenResetPasswordCommand
        {
            Id = id,
            Token = token
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }


    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new VerifyTokenResetPasswordCommand
        {
            Id = 1,
            Token = "token"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}