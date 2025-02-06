namespace SabaNews.Livescore.Services.Tests.Criteria.Match;

using SabaNews.Livescore.Services.Criteria.Match;
using Xunit;

public class GetMatchByIdsCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetMatchByIdsCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Match_GetByIds", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetMatchByIdsCriteria { MatchIds = "" };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}