namespace SabaNews.Criteria.UnitTests.Comment;

using SabaNews.Criteria.Comment;
using Xunit;

public class CmtGetChildrenCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CmtGetChildrenCriteria();
        var expected = "cmt_get_children";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(0, 1)]
    [InlineData(1, 0)]
    public void IsValid_WhenCalled_ReturnFalse(int postId, int cmtId)
    {
        // Arrange
        var criteria = new CmtGetChildrenCriteria
        {
            PostID = postId,
            CmtID = cmtId
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
        var criteria = new CmtGetChildrenCriteria
        {
            PostID = 1,
            CmtID = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}