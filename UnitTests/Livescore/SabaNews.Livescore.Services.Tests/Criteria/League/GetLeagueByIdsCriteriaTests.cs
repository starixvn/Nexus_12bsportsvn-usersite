namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class GetLeagueByIdsCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetLeagueByIdsCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_League_GetByIds", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetLeagueByIdsCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}