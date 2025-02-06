namespace SabaNews.Livescore.Services.Tests.Criteria.Match;

using SabaNews.Livescore.Services.Criteria.Match;
using Xunit;

public class GetMatchLineupCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetMatchLineupCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Match_GetLineup", actual);
    }

    [Fact]
    public void IsValid_InValidParam_ReturnFalse()
    {
        var criteria = new GetMatchLineupCriteria();
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new GetMatchLineupCriteria { MatchId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}