namespace SabaNews.Criteria.UnitTests.Logs;

using SabaNews.Criteria.Logs;
using Xunit;

public class WriteLogCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new WriteLogCommand();
        var expected = "log_writelog";

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
        var criteria = new WriteLogCommand
        {
            ActionId = id,
            Data = "data",
            OldData = "oldDate",
            ActorId = 1
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
        var criteria = new WriteLogCommand
        {
            ActionId = 1,
            Data = "data",
            OldData = "oldDate",
            ActorId = 1
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}