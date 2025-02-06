namespace SabaNews.Criteria.UnitTests.Comment;

using SabaNews.Criteria.Comment;
using Xunit;

public class CmtUpdateLikeCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CmtUpdateLikeCommand();
        var expected = "cmt_update_like";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(0)]
    public void IsValid_WhenCalled_ReturnFalse(int cmtId)
    {
        // Arrange
        var criteria = new CmtUpdateLikeCommand
        {
            CommentID = cmtId,
            CommentLikeCount = 1,
            CommentLikeIPs = "IPs",
            CommentLikeUsers = "users"
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
        var criteria = new CmtUpdateLikeCommand
        {
            CommentID = 1,
            CommentLikeCount = 1,
            CommentLikeIPs = "IPs",
            CommentLikeUsers = "users"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}