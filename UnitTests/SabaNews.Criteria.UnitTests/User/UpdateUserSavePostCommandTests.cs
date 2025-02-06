namespace SabaNews.Criteria.UnitTests.User;

using SabaNews.Criteria.User;
using Xunit;

public class UpdateUserSavePostCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new UpdateUserSavePostCommand();
        var expected = "user_save_post";

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
        var criteria = new UpdateUserSavePostCommand
        {
            UserID = id,
            ListPosts = "1,2,3"
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
        var criteria = new UpdateUserSavePostCommand
        {
            UserID = 1,
            ListPosts = "1,2,3"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}