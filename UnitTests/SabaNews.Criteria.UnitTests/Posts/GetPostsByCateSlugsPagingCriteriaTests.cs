namespace SabaNews.Criteria.UnitTests.Posts;

using SabaNews.Criteria.Posts;
using Xunit;


public class GetPostsByCateSlugsPagingCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetPostsByCateSlugsPagingCriteria();
        var expected = "post_get_by_cate_slugs_paging";

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
        var criteria = new GetPostsByCateSlugsPagingCriteria
        {
            Slug1 = slug
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
        var criteria = new GetPostsByCateSlugsPagingCriteria
        {
            Slug1 = "slug"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}