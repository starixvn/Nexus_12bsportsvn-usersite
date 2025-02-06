namespace SabaNews.Criteria.UnitTests.Posts;

using SabaNews.Criteria.Posts;
using System;
using Xunit;

public class GetViewDetailOnDateCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetViewDetailOnDateCriteria();
        var expected = "post_view_detail_get";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnFalse()
    {
        // Arrange
        var criteria = new GetViewDetailOnDateCriteria
        {
            CreatedDate = null,
            PageIndex = 1,
            PageSize = 10,
            AuthorSortType = "desc",
            ViewSortType = "asc",
            IsVideo = false,
            TotalItems = 10,
            TotalViews = 100
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
        var criteria = new GetViewDetailOnDateCriteria
        {
            CreatedDate = DateTime.Now,
            PageIndex = 1,
            PageSize = 10,
            AuthorSortType = "desc",
            ViewSortType = "asc",
            IsVideo = false,
            TotalItems = 10,
            TotalViews = 100
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}