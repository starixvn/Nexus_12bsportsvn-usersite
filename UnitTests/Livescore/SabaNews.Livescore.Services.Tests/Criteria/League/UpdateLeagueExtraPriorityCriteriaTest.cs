namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class UpdateLeagueExtraPriorityCriteriaTest
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new UpdateLeagueExtraPriorityCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_League_Extra_UpdatePriorities", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new UpdateLeagueExtraPriorityCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}