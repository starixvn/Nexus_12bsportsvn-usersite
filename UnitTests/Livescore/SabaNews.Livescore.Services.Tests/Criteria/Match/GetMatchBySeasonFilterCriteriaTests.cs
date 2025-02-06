namespace SabaNews.Livescore.Services.Tests.Criteria.Match;

using SabaNews.Livescore.Services.Criteria.Match;
using Xunit;

public class GetMatchBySeasonFilterCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetMatchBySeasonFilterCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Match_GetBySeason_Filter", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetMatchBySeasonFilterCriteria { LeagueId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }

    [Fact]
    public void IsValid_Always_ReturnFalse()
    {
        var criteria = new GetMatchBySeasonFilterCriteria { LeagueId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }
}