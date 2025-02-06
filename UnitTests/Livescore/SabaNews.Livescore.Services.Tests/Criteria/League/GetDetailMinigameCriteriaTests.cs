namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class GetDetailMinigameCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetDetailMinigameCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescorer_Minigame_Get_Detail", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetDetailMinigameCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}