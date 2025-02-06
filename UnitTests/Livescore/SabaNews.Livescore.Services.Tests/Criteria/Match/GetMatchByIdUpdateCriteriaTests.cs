namespace SabaNews.Livescore.Services.Tests.Criteria.Match;

using SabaNews.Livescore.Services.Criteria.Match;
using Xunit;

public class GetMatchByIdUpdateCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetMatchByIdUpdateCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Match_GetByIdUpdate", actual);
    }

    [Fact]
    public void IsValid_InValidParam_ReturnFalse()
    {
        var criteria = new GetMatchByIdUpdateCriteria { MatchId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new GetMatchByIdUpdateCriteria { MatchId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}