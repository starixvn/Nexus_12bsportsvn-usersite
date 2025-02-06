namespace SabaNews.Criteria.UnitTests.Auth;

using SabaNews.Criteria.Auth;
using Xunit;

public class GetUserLoginCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetUserLoginCriteria();
        var expected = "user_get_login";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("")]
    public void IsValid_WhenCalled_ReturnFalse(string email)
    {
        // Arrange
        var criteria = new GetUserLoginCriteria
        {
            Email = email
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
        var criteria = new GetUserLoginCriteria
        {
            Email = "email"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}