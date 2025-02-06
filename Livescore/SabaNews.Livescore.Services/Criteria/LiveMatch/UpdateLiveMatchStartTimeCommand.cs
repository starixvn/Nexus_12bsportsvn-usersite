namespace SabaNews.Livescore.Services.Criteria.LiveMatch;

using System;
using SabaNews.Core.Models;

public class UpdateLiveMatchStartTimeCommand : BaseNonQueryCommand
{
    public long MatchId { get; set; }

    public DateTime? StartTime { get; set; }
    public long StartTimeStamp { get; set; }

    public override string GetSettingKey() => "Livescore_LiveMatch_StartTime_Update";

    public override bool IsValid() => MatchId > 0 && StartTime.HasValue;
}