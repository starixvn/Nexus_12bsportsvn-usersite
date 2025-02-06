namespace SabaNews.Criteria.UnitTests.Event.Worldcup;

using SabaNews.Criteria.Event.WorldCup;
using Xunit;

public class GetMinigameVoteMatchCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetMinigameVoteMatchCriteria();
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
        var criteria = new GetMinigameVoteMatchCriteria
        {
            MatchId = 2
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

    [Theory]
    [InlineData(0)]
    public void IsValid_WhenCalled_ReturnFalse(byte matchId)
    {
        // Arrange
        var criteria = new GetMinigameVoteMatchCriteria
        {
            MatchId = matchId
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}