namespace SabaNews.Livescore.Services.Tests.Criteria.LiveMatch;

using SabaNews.Livescore.Services.Criteria.LiveMatch;
using Xunit;

public class InsertLiveMatchToTemporayTableCommandTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new InsertLiveMatchToTemporayTableCommand();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_Livematch_Temporary_Insert", actual);
    }

    [Fact]
    public void IsValid_Always_ReturnTrue()
    {
        var criteria = new InsertLiveMatchToTemporayTableCommand { MatchIds = string.Empty };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}