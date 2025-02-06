namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class GetDataMinigameCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetDataMinigameCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescorer_Minigame_Get_Data", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetDataMinigameCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}