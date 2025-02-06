namespace SabaNews.Criteria.UnitTests.Event.Worldcup;

using SabaNews.Criteria.Event.WorldCup;
using Xunit;

public class UpdateMinigameVoteCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new UpdateMinigameVoteCommand();
        var expected = "worldcup_minigame_updateVote";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new UpdateMinigameVoteCommand
        {
            UserId = 1,
            Stage = 2,
            TeamId = 1,
            MatchId = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

    [Theory]
    [InlineData(0, 0, 1)]
    [InlineData(1, 5, 1)]
    [InlineData(1, 5, 0)]
    public void IsValid_WhenCalled_ReturnFalse(long userId, byte stage, long  matchId)
    {
        // Arrange
        var criteria = new UpdateMinigameVoteCommand
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