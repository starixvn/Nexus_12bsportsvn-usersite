namespace SabaNews.Livescore.Services.Tests.Criteria.Team;

using SabaNews.Livescore.Services.Criteria.Team;
using Xunit;

public class GetPlayerCustomByIdCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetPlayerCustomByIdCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_PlayerCustom_GetById", actual);
    }

    [Fact]
    public void IsValid_InValidParam_ReturnFalse()
    {
        var criteria = new GetPlayerCustomByIdCriteria { PlayerId = 0 };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new GetPlayerCustomByIdCriteria { PlayerId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}