namespace SabaNews.Criteria.UnitTests.Email;

using SabaNews.Criteria.Email;
using System;
using Xunit;

public class CreateEmailDetailCriteriaTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CreateEmailDetailCriteria();
        var expected = "email_detail_create";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(0, 1)]
    [InlineData(1, 0)]
    public void IsValid_WhenCalled_ReturnFalse(int emailId, int userId)
    {
        // Arrange
        var criteria = new CreateEmailDetailCriteria
        {
            EmailId = emailId,
            UserId = userId,
            TokenId = "token",
            EmailTitle = "title",
            EmailContent = "content",
            EmailAddress = "email@gmail.com",
            SendTime = DateTime.Now,
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
        var criteria = new CreateEmailDetailCriteria
        {
            EmailId = 1,
            UserId = 1,
            TokenId = "token",
            EmailTitle = "title",
            EmailContent = "content",
            EmailAddress = "email@gmail.com",
            SendTime = DateTime.Now,
            Status = 0
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}