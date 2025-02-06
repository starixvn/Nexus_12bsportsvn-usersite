namespace SabaNews.Criteria.UnitTests.Posts;

using SabaNews.Criteria.Posts;
using Xunit;

public class UpdateVideoViewCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new UpdateVideoViewCommand();
        var expected = "post_update_video_view";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(0)]
    public void IsValid_WhenCalled_ReturnFalse(int id)
    {
        // Arrange
        var criteria = new UpdateVideoViewCommand
        {
            PostId = id
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
        var criteria = new UpdateVideoViewCommand
        {
            PostId = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}