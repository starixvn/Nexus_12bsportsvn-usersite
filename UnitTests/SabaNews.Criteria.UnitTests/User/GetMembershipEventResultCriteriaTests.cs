namespace SabaNews.Criteria.UnitTests.User;

using SabaNews.Criteria.User;
using System;
using Xunit;


public class GetMembershipEventResultCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetMembershipEventResultCriteria();
        var expected = "user_membership_event_get_result";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetMembershipEventResultCriteria
        {
            ResultNumber = 123,
            ToDate = DateTime.Now,
            Start = 0, 
            End = 10
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}