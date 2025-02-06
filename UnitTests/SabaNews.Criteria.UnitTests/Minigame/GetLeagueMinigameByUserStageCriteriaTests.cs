namespace SabaNews.Criteria.UnitTests.Minigame;

using Criteria.Minigame;
using Xunit;

public class GetLeagueMinigameByUserStageCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetLeagueMinigameByUserStageCriteria();
        var expected = "minigame_League_getByUserStage";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetLeagueMinigameByUserStageCriteria
        {
            UserId = 1,
            LeagueId = 1,
            SeasonId = 1,
            Stage = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnFasle()
    {
        // Arrange
        var criteria = new GetLeagueMinigameByUserStageCriteria
        {
            UserId = -1,
            LeagueId = -1,
            SeasonId = -1,
            Stage = 0
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}