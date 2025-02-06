using SabaNews.Criteria.Email;
using Xunit;

namespace SabaNews.Criteria.UnitTests.Email;

public class VerifyTokenEmailDetailCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new VerifyTokenEmailDetailCommand();
        var expected = "email_detail_verify_token";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }


    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new VerifyTokenEmailDetailCommand
        {
            TokenId = "tokenid"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}