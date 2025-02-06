namespace SabaNews.Criteria.UnitTests.Auth;

using SabaNews.Criteria.Auth;
using Xunit;

public class CreateTokenResetPasswordCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CreateTokenResetPasswordCommand();
        var expected = "user_create_token_reset";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }
}