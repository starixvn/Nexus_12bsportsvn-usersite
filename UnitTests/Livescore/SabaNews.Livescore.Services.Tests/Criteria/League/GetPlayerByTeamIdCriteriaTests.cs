namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class GetPlayerByTeamIdCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetPlayerByTeamIdCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Player_GetByTeamId", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetPlayerByTeamIdCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}