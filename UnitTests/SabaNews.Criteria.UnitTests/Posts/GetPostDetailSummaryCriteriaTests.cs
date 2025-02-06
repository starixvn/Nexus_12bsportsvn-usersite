namespace SabaNews.Criteria.UnitTests.Posts;

using SabaNews.Criteria.Posts;
using Xunit;

public class GetPostDetailSummaryCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetPostDetailSummaryCriteria();
        var expected = "post_get_detail_summary";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("")]
    public void IsValid_WhenCalled_ReturnFalse(string slug)
    {
        // Arrange
        var criteria = new GetPostDetailSummaryCriteria
        {
            Slug = slug,
            PostType = "post"
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
        var criteria = new GetPostDetailBySlugCriteria
        {
            Slug = "slug",
            PostType = "post"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}