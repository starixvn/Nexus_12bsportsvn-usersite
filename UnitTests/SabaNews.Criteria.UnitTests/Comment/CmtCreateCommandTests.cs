using SabaNews.Criteria.Comment;
using System;
using Xunit;

namespace SabaNews.Criteria.UnitTests.Comment;

public class CmtCreateCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CmtCreateCommand();
        var expected = "cmt_create";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(0, 1, "content", "email")]
    [InlineData(1, 0, "content", "email")]
    [InlineData(1, 1, "", "email")]
    [InlineData(1, 1, "content", "")]
    public void IsValid_WhenCalled_ReturnFalse(int postId, int userId, string content, string email)
    {
        // Arrange
        var criteria = new CmtCreateCommand
        {
            CommentID = 1,
            CommentPostID = postId,
            CommentAgent = "agent",
            CommentAuthor = "author",
            CommentAuthorEmail = email,
            CommentAuthorIP = "192.168",
            CommentContent = content,
            CommentDate = DateTime.Now,
            CommentDateGMT = DateTime.UtcNow,
            CommentParent = 1,
            UserID = userId
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
        var criteria = new CmtCreateCommand
        {
            CommentID = 1,
            CommentPostID = 1,
            CommentAgent = "agent",
            CommentAuthor = "author",
            CommentAuthorEmail = "email",
            CommentAuthorIP = "192.168",
            CommentContent = "content",
            CommentDate = DateTime.Now,
            CommentDateGMT = DateTime.UtcNow,
            CommentParent = 1,
            UserID = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}