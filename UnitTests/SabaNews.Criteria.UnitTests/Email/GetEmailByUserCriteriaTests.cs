namespace SabaNews.Criteria.UnitTests.Email;

using SabaNews.Criteria.Email;
using Xunit;

public class GetEmailByUserCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetEmailByUserCriteria();
        var expected = "email_get_by_user";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }


    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetEmailByUserCriteria
        {
            UserId = 1,
            Search = "",
            Start = 0,
            End = 10,
            TotalItems = 10
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}