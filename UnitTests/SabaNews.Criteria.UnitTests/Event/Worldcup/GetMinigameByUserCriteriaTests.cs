using SabaNews.Criteria.Event.WorldCup;
using Xunit;

namespace SabaNews.Criteria.UnitTests.Event.Worldcup;

public class GetMinigameByUserCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetMinigameByUserCriteria();
        var expected = "worldcup_minigame_getByUser";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetMinigameByUserCriteria
        {
            UserId = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

    [Theory]
    [InlineData(0)]
    public void IsValid_WhenCalled_ReturnFalse(long userId)
    {
        // Arrange
        var criteria = new GetMinigameByUserCriteria
        {
            UserId = userId
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}