namespace SabaNews.Livescore.Services.Tests.Criteria.Match;

using SabaNews.Livescore.Services.Criteria.Match;
using Xunit;

public class GetSeasonStandingsCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetSeasonStandingsCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Match_GetSeasonStandings", actual);
    }

    [Theory]
    [InlineData(0, 1)]
    [InlineData(1, 0)]
    [InlineData(0, 0)]
    public void IsValid_InValidParam_ReturnFalse(long leagueId, long seasionId)
    {
        var criteria = new GetSeasonStandingsCriteria { LeagueId = leagueId, SeasonId = seasionId };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new GetSeasonStandingsCriteria { LeagueId = 1, SeasonId = 10000 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}