namespace SabaNews.Criteria.UnitTests.Posts;

using SabaNews.Criteria.Posts;
using Xunit;

public class GetPostDetailByIdCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetPostDetailByIdCriteria();
        var expected = "post_get_by_id";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnFalse()
    {
        // Arrange
        var criteria = new GetPostDetailByIdCriteria
        {
            PostId = 0
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
        var criteria = new GetPostDetailByIdCriteria
        {
            PostId = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

}