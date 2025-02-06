namespace SabaNews.Criteria.UnitTests.Auth;

using Criteria.Auth;
using Xunit;

public class CreateUserCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new CreateUserCommand();
        var expected = "user_create";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData("", "email", "password")]
    [InlineData("name", "", "password")]
    [InlineData("name", "email", "")]
    public void IsValid_WhenCalled_ReturnFalse(string name, string email, string password)
    {
        // Arrange
        var criteria = new CreateUserCommand
        {
            _Email = email,
            _Name = name,
            _Password = password,
            UserId = 1
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
        var criteria = new CreateUserCommand
        {
            _Name = "Name",
            _Email = "Email",
            _Password = "password",
            UserId = 1,
            _Phone = "12313",
            _YearOfBirth = "1069"
        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}