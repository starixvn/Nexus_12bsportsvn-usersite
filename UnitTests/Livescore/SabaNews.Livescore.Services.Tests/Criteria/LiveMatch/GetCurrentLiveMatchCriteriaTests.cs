namespace SabaNews.Livescore.Services.Tests.Criteria.LiveMatch;

using SabaNews.Livescore.Services.Criteria.LiveMatch;
using Xunit;

public class GetCurrentLiveMatchCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetCurrentLiveMatchCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_LiveMatch_Get", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetCurrentLiveMatchCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}