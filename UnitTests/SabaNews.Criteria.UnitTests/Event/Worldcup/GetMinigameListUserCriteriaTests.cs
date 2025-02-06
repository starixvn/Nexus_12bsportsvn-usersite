namespace SabaNews.Criteria.UnitTests.Event.Worldcup;

using SabaNews.Criteria.Event.WorldCup;
using Xunit;

public class GetMinigameListUserCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetMinigameListUserCriteria();
        var expected = "worldcup_minigame_get_list_users";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }



    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetMinigameListUserCriteria();

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}