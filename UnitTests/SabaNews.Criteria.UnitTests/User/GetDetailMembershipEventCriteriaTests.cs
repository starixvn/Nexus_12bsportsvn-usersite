namespace SabaNews.Criteria.UnitTests.User;

using SabaNews.Criteria.User;
using Xunit;

public class GetDetailMembershipEventCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new GetDetailMembershipEventCriteria();
        var expected = "user_membership_event_get_detail";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new GetDetailMembershipEventCriteria
        {
            UserId = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}