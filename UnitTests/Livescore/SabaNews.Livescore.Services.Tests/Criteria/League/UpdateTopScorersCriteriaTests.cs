namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class UpdateTopScorersCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new UpdateTopScorersCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Top_Scorers_Update", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new UpdateTopScorersCriteria 
        {
            PlayerId = 1,
            SeasonId = 1,
            LeagueId = 1,
            TeamId = 1,
            Goals = 10,
            Assists = 10,
            Top = 1
        };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }


    [Fact]
    public void IsValid_Always_ReturnFalse()
    {
        var criteria = new UpdateTopScorersCriteria 
        {
            PlayerId = 1,
            SeasonId = 1,
            LeagueId = 1,
            TeamId = 1,
            Goals = 10,
            Assists = 10,
            Top = 0
        };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }
}