namespace SabaNews.Criteria.UnitTests.Minigame;

using Criteria.Minigame;
using Xunit;

public class GetLeagueMinigameByStageCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetLeagueMinigameByStageCriteria();
        var expected = "minigame_League_getByStage";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetLeagueMinigameByStageCriteria
        {
            Stage = 1,
            LeagueId = 1,
            SeasonId = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

    [Fact]
    public void GetLeagueMinigameByUserCriteria()
    {
        // Arrange
        var criteria = new GetLeagueMinigameByStageCriteria
        {
            Stage = 0,
            LeagueId = -1,
            SeasonId = -1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}