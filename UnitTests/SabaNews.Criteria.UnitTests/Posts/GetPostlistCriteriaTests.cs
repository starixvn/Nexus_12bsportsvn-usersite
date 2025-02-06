using SabaNews.Criteria.Posts;
using System;
using Xunit;

namespace SabaNews.Criteria.UnitTests.Posts;

public class GetPostlistCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetPostlistCriteria();
        var expected = "get_posts";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }



    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetPostlistCriteria
        {
            _fromDate = DateTime.Now,
            _Category = 1,
            _Subject = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}