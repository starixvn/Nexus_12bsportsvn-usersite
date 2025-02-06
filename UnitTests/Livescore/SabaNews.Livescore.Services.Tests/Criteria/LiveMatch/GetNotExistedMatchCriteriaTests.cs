namespace SabaNews.Livescore.Services.Tests.Criteria.LiveMatch;

using SabaNews.Livescore.Services.Criteria.LiveMatch;
using Xunit;

public class GetNotExistedMatchCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetNotExistedMatchCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Livematch_GetNotExistedMatch", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetNotExistedMatchCriteria();
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}