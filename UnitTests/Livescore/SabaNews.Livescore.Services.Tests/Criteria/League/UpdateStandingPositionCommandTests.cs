namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;


public class UpdateStandingPositionCommandTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new UpdateStandingPositionCommand();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Standing_UpdatePosition", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new UpdateStandingPositionCommand { SeasonId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }

    [Fact]
    public void IsValid_Always_ReturnFalse()
    {
        var criteria = new UpdateStandingPositionCommand { SeasonId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }
}