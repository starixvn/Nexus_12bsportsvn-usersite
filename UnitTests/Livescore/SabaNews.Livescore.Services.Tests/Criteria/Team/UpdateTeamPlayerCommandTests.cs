namespace SabaNews.Livescore.Services.Tests.Criteria.Team;

using SabaNews.Livescore.Services.Criteria.Team;
using Xunit;

public class UpdateTeamPlayerCommandTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new UpdateTeamPlayerCommand();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_PlayerCustom_Update", actual);
    }

    [Fact]
    public void IsValid_InValidParam_ReturnFalse()
    {
        var criteria = new UpdateTeamPlayerCommand { PlayerId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new UpdateTeamPlayerCommand { PlayerId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}