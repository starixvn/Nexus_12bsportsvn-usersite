namespace SabaNews.Criteria.UnitTests.Email;

using SabaNews.Criteria.Email;
using System;
using Xunit;

public class GetEmailsCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetEmailsCriteria();
        var expected = "email_get_all";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }


    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetEmailsCriteria
        {
            Search = "",
            Start = 0, 
            End = 10,
            FromDate = DateTime.Now,
            ToDate = DateTime.Now,
            CreatedBy = 1,
            Status = 0,
            TotalItems = 10
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}