namespace SabaNews.Criteria.UnitTests.User;

using SabaNews.Criteria.User;
using Xunit;

public class GetUserForSendEmailCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetUserForSendEmailCriteria();
        var expected = "user_get_for_send_email";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetUserForSendEmailCriteria();

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}