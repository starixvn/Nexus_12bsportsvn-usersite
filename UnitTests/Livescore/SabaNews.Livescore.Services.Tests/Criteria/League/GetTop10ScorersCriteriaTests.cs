namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class GetTop10ScorersCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetTop10ScorersCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Top_Scorers_GetTop10", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetTop10ScorersCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}