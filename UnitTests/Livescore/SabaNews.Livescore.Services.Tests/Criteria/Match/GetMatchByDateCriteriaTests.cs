namespace SabaNews.Livescore.Services.Tests.Criteria.Match;

using System;
using SabaNews.Livescore.Services.Criteria.Match;
using Xunit;

public class GetMatchByDateCriteriaTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new GetMatchByDateCriteria();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Match_GetByDate", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new GetMatchByDateCriteria { EventDate = DateTime.Now, Timezone = 7, FromTime = DateTime.UtcNow, ToTime = DateTime.Now, SportId = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}