namespace SabaNews.Criteria.UnitTests.Comment;

using SabaNews.Criteria.Comment;
using Xunit;

public class CmtGetLikeDataCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CmtGetLikeDataCriteria();
        var expected = "cmt_get_like_data_cmtId";

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
        var criteria = new CmtGetLikeDataCriteria
        {
            CommentID = cmtId
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
        var criteria = new CmtGetLikeDataCriteria
        {
            CommentID = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}