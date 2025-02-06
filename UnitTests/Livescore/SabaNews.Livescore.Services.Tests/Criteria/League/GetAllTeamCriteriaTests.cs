namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class GetAllTeamCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetAllTeamCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Team_GetAll", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetAllTeamCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}