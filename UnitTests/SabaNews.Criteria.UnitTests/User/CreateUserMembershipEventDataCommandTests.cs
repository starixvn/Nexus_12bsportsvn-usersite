using SabaNews.Criteria.User;
using System;
using Xunit;

namespace SabaNews.Criteria.UnitTests.User;

public class CreateUserMembershipEventDataCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CreateUserMembershipEventDataCommand();
        var expected = "user_membership_event_create_data";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new CreateUserMembershipEventDataCommand
        {
            UserId = 1,
            LuckyNumber = "123",
            JoinDate = DateTime.Now
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnFalse()
    {
        // Arrange
        var criteria = new CreateUserMembershipEventDataCommand
        {
            UserId = 0,
            LuckyNumber = "123",
            JoinDate = DateTime.Now
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}