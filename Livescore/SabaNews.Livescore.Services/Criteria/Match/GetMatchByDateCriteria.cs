namespace SabaNews.Livescore.Services.Criteria.Match;

using System;
using Fanex.Data;
using Fanex.Data.Repository;

public class GetMatchByDateCriteria : CriteriaBase
{
    [SpParam(Ignored = true)]
    public DateTime EventDate { get; set; }

    [SpParam(Ignored = true)]
    public float Timezone { get; set; }

    public DateTime FromTime { get; set; }
    public DateTime ToTime { get; set; }

    public short SportId { get; set; }

    public override string GetSettingKey() => "Livescore_Match_GetByDate";

    public override bool IsValid() => true;
}