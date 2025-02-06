namespace SabaNews.Criteria.UnitTests.Auth;

using SabaNews.Criteria.Auth;
using Xunit;

public class GetSocialUserCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetSocialUserCriteria();
        var expected = "social_user_get_login";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("", "")]
    [InlineData("", "Internal")]
    [InlineData("identifer", "")]
    public void IsValid_WhenCalled_ReturnFalse(string identifer, string loginType)
    {
        // Arrange
        var criteria = new GetSocialUserCriteria
        {
            Identifier = identifer,
            LoginType = loginType
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
        var criteria = new GetSocialUserCriteria
        {
            Identifier = "Identifier",
            LoginType = "Internal"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}