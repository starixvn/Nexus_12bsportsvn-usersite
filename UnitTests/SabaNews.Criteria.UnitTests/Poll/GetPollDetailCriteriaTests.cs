using SabaNews.Criteria.Poll;
using Xunit;

namespace SabaNews.Criteria.UnitTests.Poll;

public class GetPollCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetPollDetailCriteria();
        var expected = "poll_get";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(0, 1)]
    [InlineData(1, 0)]
    public void IsValid_WhenCalled_ReturnFalse(int questId, int themeId)
    {
        // Arrange
        var criteria = new GetPollDetailCriteria
        {
            QuestId = questId,
            ThemeId = themeId,
            UserIp = "IP"
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
        var criteria = new GetPollDetailCriteria
        {
            QuestId = 1,
            ThemeId = 1,
            UserIp = "IP"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}