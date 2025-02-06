using SabaNews.Criteria.Email;
using System;
using Xunit;

namespace SabaNews.Criteria.UnitTests.Email;

public class UpdateEmailCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new UpdateEmailCommand();
        var expected = "email_update";

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
        var criteria = new UpdateEmailCommand
        {
            _EmailId = id,
            EmailContent = "content",
            EmailTitle = "title",
            EmbeddedLink = "link",
            SendDate = DateTime.Now,
            CreatedBy = 1,
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
        var criteria = new UpdateEmailCommand
        {
            _EmailId = 1,
            EmailContent = "content",
            EmailTitle = "title",
            EmbeddedLink = "link",
            SendDate = DateTime.Now,
            CreatedBy = 1,
            Status = 0
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}