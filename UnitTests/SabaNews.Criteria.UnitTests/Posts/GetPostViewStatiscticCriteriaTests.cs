namespace SabaNews.Criteria.UnitTests.Posts;

using SabaNews.Criteria.Posts;
using System;
using Xunit;

public class GetPostViewStatiscticCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetPostViewStatiscticCriteria();
        var expected = "post_view_statistic_get";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnFalse()
    {
        // Arrange
        var criteria = new GetPostViewStatiscticCriteria
        {
            FromDate = DateTime.Now,
            ToDate = new DateTime(2000, 01, 01)
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
        var criteria = new GetPostViewStatiscticCriteria
        {
            FromDate = DateTime.Now,
            ToDate = DateTime.Now
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}