namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class GetTopScorersByRowNumCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetTopScorersByRowNumCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Top_Scorers_GetByRow", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetTopScorersByRowNumCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}