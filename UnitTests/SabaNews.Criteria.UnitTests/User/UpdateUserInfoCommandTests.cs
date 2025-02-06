namespace SabaNews.Criteria.UnitTests.User;

using SabaNews.Criteria.User;
using Xunit;

public class UpdateUserInfoCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new UpdateUserInfoCommand();
        var expected = "user_update_info";

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
        var criteria = new UpdateUserInfoCommand
        {
            UserID = id,
            _name = "name",
            _gender = "name",
            _isSubscribe = 1,
            _password = "password",
            _phone = "033456136",
            _photo = "avatar.png"
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
        var criteria = new UpdateUserInfoCommand
        {
            UserID = 1,
            _name = "name",
            _gender = "name",
            _isSubscribe = 1,
            _password = "password",
            _phone = "033456136",
            _photo = "avatar.png"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}