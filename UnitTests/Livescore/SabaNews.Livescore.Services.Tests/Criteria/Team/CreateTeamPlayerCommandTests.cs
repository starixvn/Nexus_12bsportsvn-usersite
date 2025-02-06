namespace SabaNews.Livescore.Services.Tests.Criteria.Team;

using SabaNews.Livescore.Services.Criteria.Team;
using Xunit;

public class CreateTeamPlayerCommandTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new CreateTeamPlayerCommand();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_PlayerCustom_Create", actual);
    }

    [Fact]
    public void IsValid_InValidParam_ReturnFalse()
    {
        var criteria = new CreateTeamPlayerCommand { TeamId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new CreateTeamPlayerCommand { TeamId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}