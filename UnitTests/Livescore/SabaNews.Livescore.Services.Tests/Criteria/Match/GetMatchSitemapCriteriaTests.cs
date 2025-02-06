namespace SabaNews.Livescore.Services.Tests.Criteria.Match;

using SabaNews.Livescore.Services.Criteria.Match;
using Xunit;

public class GetMatchSitemapCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetMatchSitemapCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Match_GetSitemap", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetMatchSitemapCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }

}