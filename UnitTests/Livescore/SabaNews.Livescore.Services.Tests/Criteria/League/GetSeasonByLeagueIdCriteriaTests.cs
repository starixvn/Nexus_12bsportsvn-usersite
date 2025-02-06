namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class GetSeasonByLeagueIdCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetSeasonByLeagueIdCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Season_GetByLeague", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetSeasonByLeagueIdCriteria { LeagueId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }

    [Fact]
    public void IsValid_Always_ReturnFalse()
    {
        var criteria = new GetSeasonByLeagueIdCriteria { LeagueId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }
}