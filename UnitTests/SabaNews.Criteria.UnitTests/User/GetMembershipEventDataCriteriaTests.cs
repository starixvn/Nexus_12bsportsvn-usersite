using SabaNews.Criteria.User;
using System;
using Xunit;

namespace SabaNews.Criteria.UnitTests.User;

public class GetMembershipEventDataCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetMembershipEventDataCriteria();
        var expected = "user_membership_event_get_data";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetMembershipEventDataCriteria
        {
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