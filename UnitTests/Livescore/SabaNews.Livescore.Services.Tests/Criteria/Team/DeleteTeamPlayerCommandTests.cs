namespace SabaNews.Livescore.Services.Tests.Criteria.Team;

using SabaNews.Livescore.Services.Criteria.Team;
using Xunit;

public class DeleteTeamPlayerCommandTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new DeleteTeamPlayerCommand();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_PlayerCustom_Delete", actual);
    }

    [Fact]
    public void IsValid_InValidParam_ReturnFalse()
    {
        var criteria = new DeleteTeamPlayerCommand { PlayerId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new DeleteTeamPlayerCommand { PlayerId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}