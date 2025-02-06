namespace SabaNews.Livescore.Services.Tests.Criteria.Team;

using SabaNews.Livescore.Services.Criteria.Team;
using Xunit;

public class GetTeamByStageCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetTeamByStageCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Team_GetByStage", actual);
    }

    [Fact]
    public void IsValid_InValidParam_ReturnFalse()
    {
        var criteria = new GetTeamByStageCriteria { StageId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new GetTeamByStageCriteria { StageId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}