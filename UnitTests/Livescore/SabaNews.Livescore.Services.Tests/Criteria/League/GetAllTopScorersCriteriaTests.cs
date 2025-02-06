namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class GetAllTopScorersCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetAllTopScorersCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Top_Scorers_Get", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetAllTopScorersCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}