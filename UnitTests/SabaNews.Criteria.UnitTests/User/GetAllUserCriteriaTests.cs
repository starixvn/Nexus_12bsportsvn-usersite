namespace SabaNews.Criteria.UnitTests.User;

using SabaNews.Criteria.User;
using Xunit;

public class GetAllUserCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetAllUserCriteria();
        var expected = "user_get_all";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetAllUserCriteria
        {
            UserRole = "administrator"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}