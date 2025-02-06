namespace SabaNews.Criteria.UnitTests.Email;

using SabaNews.Criteria.Email;
using Xunit;

public class UpdateEmailDetailCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new UpdateEmailDetailCommand();
        var expected = "email_detail_update";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new UpdateEmailDetailCommand
        {
            UserId = 1,
            EmailId = 1,
            EmailTitle = "title",
            EmailContent = "content"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }

    [Theory]
    [InlineData(0, 0)]
    [InlineData(0, 1)]
    [InlineData(1, 0)]
    public void IsValid_WhenCalled_ReturnFalse(int userId, int emailId)
    {
        // Arrange
        var criteria = new UpdateEmailDetailCommand
        {
            UserId = userId,
            EmailId = emailId,
            EmailTitle = "title",
            EmailContent = "content"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.False(actual);
    }
}