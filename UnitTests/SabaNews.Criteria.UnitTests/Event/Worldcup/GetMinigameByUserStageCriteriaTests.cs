namespace SabaNews.Criteria.UnitTests.Event.Worldcup;

using SabaNews.Criteria.Event.WorldCup;
using Xunit;

public class GetMinigameByUserStageCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetMinigameByUserStageCriteria();
        var expected = "worldcup_minigame_getByUserStage";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetMinigameByUserStageCriteria
        {
            UserId = 1,
            Stage = 2
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

    [Theory]
    [InlineData(0, 0)]
    [InlineData(1, 5)]
    public void IsValid_WhenCalled_ReturnFalse(long userId, byte stage)
    {
        // Arrange
        var criteria = new GetMinigameByUserStageCriteria
        {
            UserId = userId,
            Stage = stage
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}