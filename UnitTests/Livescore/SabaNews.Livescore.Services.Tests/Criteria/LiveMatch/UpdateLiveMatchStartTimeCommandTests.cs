namespace SabaNews.Livescore.Services.Tests.Criteria.LiveMatch;

using System;
using SabaNews.Livescore.Services.Criteria.LiveMatch;
using Xunit;

public class UpdateLiveMatchStartTimeCommandTests
{
    [Fact]
    public void GetSettingKey_Return_ExpectedStringValue()
    {
        var criteria = new UpdateLiveMatchStartTimeCommand();
        var actual = criteria.GetSettingKey();
        Assert.Equal("Livescore_LiveMatch_StartTime_Update", actual);
    }

    [Theory]
    [InlineData(1000, null)]
    [InlineData(0, null)]
    public void IsValid_InValidParam_ReturnFalse(long matchId, DateTime? startTime)
    {
        var criteria = new UpdateLiveMatchStartTimeCommand { MatchId = matchId, StartTime = startTime };
        var actual = criteria.IsValid();
        Assert.False(actual);
    }

    [Fact]
    public void IsValid_ValidParam_ReturnTrue()
    {
        var criteria = new UpdateLiveMatchStartTimeCommand { MatchId = 1000, StartTime = DateTime.Now, StartTimeStamp = 1 };
        var actual = criteria.IsValid();
        Assert.True(actual);
    }
}