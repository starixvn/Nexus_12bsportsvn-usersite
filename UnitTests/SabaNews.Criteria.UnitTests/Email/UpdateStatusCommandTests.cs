namespace SabaNews.Criteria.UnitTests.Email;

using SabaNews.Criteria.Email;
using Xunit;

public class UpdateStatusCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new UpdateStatusCommand();
        var expected = "email_update_status";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(0)]
    public void IsValid_WhenCalled_ReturnFalse(int id)
    {
        // Arrange
        var criteria = new UpdateStatusCommand
        {
            EmailId = id,
            Status = 0
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
        var criteria = new UpdateStatusCommand
        {
            EmailId = 1,
            Status = 0
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}