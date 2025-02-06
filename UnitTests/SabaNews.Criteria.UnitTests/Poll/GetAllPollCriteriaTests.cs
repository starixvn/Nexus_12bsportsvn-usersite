using SabaNews.Criteria.Poll;
using Xunit;

namespace SabaNews.Criteria.UnitTests.Poll;

public class GetAllPollCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetAllPollCriteria();
        var expected = "poll_get_all";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetAllPollCriteria();
           

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}