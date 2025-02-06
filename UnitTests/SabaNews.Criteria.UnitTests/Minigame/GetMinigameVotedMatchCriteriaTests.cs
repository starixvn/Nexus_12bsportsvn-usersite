namespace SabaNews.Criteria.UnitTests.Minigame;

using Criteria.Minigame;
using Xunit;

public class GetMinigameVotedMatchCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetMinigameVotedMatchCriteria();
        var expected = "worldcup_minigame_getVoteMatch";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetMinigameVotedMatchCriteria
        {
            MatchId = 1
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
        var criteria = new GetMinigameVotedMatchCriteria
        {
            MatchId = 0
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}