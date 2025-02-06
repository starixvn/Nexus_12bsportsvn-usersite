namespace SabaNews.Criteria.UnitTests.Email;

using SabaNews.Criteria.Email;
using Xunit;

public class FilterEmailDetailCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new FilterEmailDetailCriteria();
        var expected = "email_detail_filter";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }


    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new FilterEmailDetailCriteria
        {
            EmailID = 1,
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