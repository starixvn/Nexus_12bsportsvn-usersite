namespace SabaNews.Criteria.UnitTests.Email;

using SabaNews.Criteria.Email;
using System;
using Xunit;

public class CreateEmailCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CreateEmailCriteria();
        var expected = "email_create";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("title", "")]
    [InlineData("", "content")]
    public void IsValid_WhenCalled_ReturnFalse(string title, string content)
    {
        // Arrange
        var criteria = new CreateEmailCriteria
        {
            Id = 1,
            EmailTitle = title,
            EmailContent = content,
            CreatedDate = DateTime.Now,
            SendDate = DateTime.Now,
            Status = 0,
            CreatedBy = 1,
            EmbeddedLink = "embeddedLink"
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
        var criteria = new CreateEmailCriteria
        {
            Id = 1,
            EmailTitle = "title",
            EmailContent = "content",
            CreatedDate = DateTime.Now,
            SendDate = DateTime.Now,
            Status = 0,
            CreatedBy = 1,
            EmbeddedLink = "embeddedLink"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}