namespace SabaNews.Criteria.UnitTests.Auth;

using SabaNews.Criteria.Auth;
using Xunit;

public class CreateSocialUserCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CreateSocialUserCommand();
        var expected = "social_user_create";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("", "", "")]
    [InlineData("", "email@gmail.com", "Internal")]
    [InlineData("identifer", "", "Internal")]
    [InlineData("identifer", "email@gmail.com", "")]
    public void IsValid_WhenCalled_ReturnFalse(string identifer, string email, string loginType)
    {
        // Arrange
        var criteria = new CreateSocialUserCommand
        {
            Identifier = identifer,
            Email = email,
            LoginType = loginType,
            DisplayName = "DisplayName",
            LastName = "LastName",
            FirstName = "First",
            Photo = "photo",
            UserId = 1
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
        var criteria = new CreateSocialUserCommand
        {
            Identifier = "idenifer",
            Email = "email@gmail.com",
            LoginType = "Internal",
            DisplayName = "DisplayName",
            LastName = "LastName",
            FirstName = "First",
            Photo = "photo",
            UserId = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}