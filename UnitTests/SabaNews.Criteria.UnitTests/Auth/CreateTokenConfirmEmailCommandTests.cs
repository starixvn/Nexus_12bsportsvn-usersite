namespace SabaNews.Criteria.UnitTests.Auth;

using SabaNews.Criteria.Auth;
using Xunit;

public class CreateTokenConfirmEmailCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CreateTokenConfirmEmailCommand();
        var expected = "user_create_token_confirm";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("", "")]
    [InlineData("", "token")]
    [InlineData("email@gmail.com", "")]
    public void IsValid_WhenCalled_ReturnFalse(string email, string token)
    {
        // Arrange
        var criteria = new CreateTokenConfirmEmailCommand
        {
            Email = email,
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
        var criteria = new CreateTokenConfirmEmailCommand
        {
                
            Email = "email@gmail.com",
            Token = "token"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}