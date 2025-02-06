namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class InsertTopScorersCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new InsertTopScorersCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Top_Scorers_Insert", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new InsertTopScorersCriteria
        {
            LeagueId = 1,
            SeasonId =  1,
            TeamId = 1,
            Top = 1,
            Goals = 10,
            PlayerId = 1
        };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }

    [Fact]
    public void IsValid_Always_ReturnFalse()
    {
        var criteria = new InsertTopScorersCriteria
        {
            LeagueId = -1,
            SeasonId =  -1,
            TeamId = 0,
            Top = 0,
            Goals = 10,
            PlayerId = 0
        };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }
}