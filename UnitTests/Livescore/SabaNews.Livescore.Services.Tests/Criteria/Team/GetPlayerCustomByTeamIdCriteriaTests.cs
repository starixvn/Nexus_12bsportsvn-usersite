namespace SabaNews.Livescore.Services.Tests.Criteria.Team;

using SabaNews.Livescore.Services.Criteria.Team;
using Xunit;

public class GetPlayerCustomByTeamIdCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetPlayerCustomByTeamIdCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_PlayerCustom_GetByTeamId", actual);
    }

    [Fact]
    public void IsValid_InValidParam_ReturnFalse()
    {
        var criteria = new GetPlayerCustomByTeamIdCriteria { TeamId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new GetPlayerCustomByTeamIdCriteria { TeamId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}