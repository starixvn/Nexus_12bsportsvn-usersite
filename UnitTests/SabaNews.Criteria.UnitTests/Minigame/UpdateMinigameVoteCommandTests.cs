namespace SabaNews.Criteria.UnitTests.Minigame;

using Criteria.Minigame;
using Xunit;

public class UpdateMinigameVoteCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new UpdateMinigameVoteCommand();
        var expected = "minigame_updateVote";

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
            MatchId = 1,
            Stage = 1,
            TeamId = 1,
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
        var criteria = new UpdateMinigameVoteCommand
        {
            UserId = 0,
            MatchId = 0,
            Stage = 0,
            TeamId = 1,
            LeagueId = 1,
            SeasonId = 0
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}