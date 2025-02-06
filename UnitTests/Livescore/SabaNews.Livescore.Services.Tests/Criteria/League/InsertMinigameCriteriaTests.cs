namespace SabaNews.Livescore.Services.Tests.Criteria.League;

using SabaNews.Livescore.Services.Criteria.League;
using Xunit;

public class InsertMinigameCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new InsertMinigameCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescorer_Minigame_Create", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new InsertMinigameCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}