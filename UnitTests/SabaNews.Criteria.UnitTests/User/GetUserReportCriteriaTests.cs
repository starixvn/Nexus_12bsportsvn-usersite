namespace SabaNews.Criteria.UnitTests.User;

using SabaNews.Criteria.User;
using System;
using Xunit;

public class GetUserReportCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetUserReportCriteria();
        var expected = "user_get_report";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnFalse()
    {
        // Arrange
        var criteria = new GetUserReportCriteria
        {
            FromDate = DateTime.Now,
            ToDate = new DateTime(2020, 1 , 1),
            DateSort = "asc",
            Search = "search",
            Start = 0,
            End = 10,
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
        var criteria = new GetUserReportCriteria
        {
            FromDate = DateTime.Now,
            ToDate  = DateTime.Now,
            DateSort = "asc",
            Search = "search",
            Start = 0,
            End = 10,
            TotalItems = 10
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}