namespace SabaNews.Livescore.Services.Tests.Criteria.Match;

using SabaNews.Livescore.Services.Criteria.Match;
using Xunit;

public class GetMatchStatisticCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetMatchStatisticCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Match_GetStatistic", actual);
    }

    [Fact]
    public void IsValid_InValidParam_ReturnFalse()
    {
        var criteria = new GetMatchStatisticCriteria();
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new GetMatchStatisticCriteria { MatchId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}