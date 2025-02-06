namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class UpdatePriorityTopScorersCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new UpdatePriorityTopScorersCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Top_Scorers_UpdateTop", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new UpdatePriorityTopScorersCriteria
        {
            IsCheck = true,
            TopUpdate = 1,
            RowNum = 1,
            Top = 1
        };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }

    [Fact]
    public void IsValid_Always_ReturnFalse()
    {
        var criteria = new UpdatePriorityTopScorersCriteria
        {
            IsCheck = true,
            TopUpdate = 1,
            RowNum = 1,
            Top = 0
        };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }
}