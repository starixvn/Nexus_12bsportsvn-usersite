namespace SabaNews.Criteria.UnitTests.Posts;

using SabaNews.Criteria.Posts;
using Xunit;

public class SearchPostsCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new SearchPostsCriteria();
        var expected = "search_posts";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("")]
    public void IsValid_WhenCalled_ReturnFalse(string keyword)
    {
        // Arrange
        var criteria = new SearchPostsCriteria
        {
            _Keyword = keyword,
            _Start = 0,
            _End = 10,
            TotalItems = 10
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
        var criteria = new SearchPostsCriteria
        {
            _Keyword = "search",
            _Start = 0,
            _End = 10,
            TotalItems = 10
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}