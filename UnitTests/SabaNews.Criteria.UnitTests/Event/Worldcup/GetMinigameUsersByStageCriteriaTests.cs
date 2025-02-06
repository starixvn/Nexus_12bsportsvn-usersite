namespace SabaNews.Criteria.UnitTests.Event.Worldcup;

using SabaNews.Criteria.Event.WorldCup;
using Xunit;

public class GetMinigameUsersByStageCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetMinigameUsersByStageCriteria();
        var expected = "worldcup_minigame_get_by_stage";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetMinigameUsersByStageCriteria
        {
            stage = 2
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

    [Theory]
    [InlineData(0)]
    public void IsValid_WhenCalled_ReturnFalse(byte stage)
    {
        // Arrange
        var criteria = new GetMinigameUsersByStageCriteria
        {
            stage = stage
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}