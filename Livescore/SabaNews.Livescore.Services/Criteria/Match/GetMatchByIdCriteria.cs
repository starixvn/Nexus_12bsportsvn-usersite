namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;
using SabaNews.Livescore.Core.Enum;

public class GetMatchByIdCriteria : CriteriaBase
{
    public long MatchId { get; set; }

    public short SportId { get; set; } = (short)SportType.Soccer;

    public override string GetSettingKey() => "Livescore_Match_GetById";

    public override bool IsValid() => MatchId > 0;
}