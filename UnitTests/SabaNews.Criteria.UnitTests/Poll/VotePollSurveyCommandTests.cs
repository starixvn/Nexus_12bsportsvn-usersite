using SabaNews.Criteria.Poll;
using Xunit;

namespace SabaNews.Criteria.UnitTests.Poll;

public class VotePollSurveyCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new VotePollSurveyCommand();
        var expected = "poll_vote";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(0, 0)]
    [InlineData(0, 1)]
    [InlineData(1, 0)]
    public void IsValid_WhenCalled_ReturnFalse(int questId, int answerId)
    {
        // Arrange
        var criteria = new VotePollSurveyCommand
        {
            QuestId = questId,
            AnswerId = answerId,
            UserIP = "IP"
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
        var criteria = new VotePollSurveyCommand
        {
            QuestId = 1,
            AnswerId = 1,
            UserIP = "IP"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}