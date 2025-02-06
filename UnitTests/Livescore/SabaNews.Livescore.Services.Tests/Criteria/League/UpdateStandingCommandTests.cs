namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class UpdateStandingCommandTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new UpdateStandingCommand();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Standing_Update", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new UpdateStandingCommand { SeasonId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }

    [Fact]
    public void IsValid_Always_ReturnFalse()
    {
        var criteria = new UpdateStandingCommand { SeasonId = -1 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }
}