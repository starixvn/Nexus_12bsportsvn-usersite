namespace SabaNews.Livescore.Services.Criteria.LiveMatch;

using SabaNews.Core.Models;

public class InsertLiveMatchToTemporayTableCommand : BaseNonQueryCommand
{
    public string MatchIds { get; set; }

    public override string GetSettingKey() => "Livescore_Livematch_Temporary_Insert";

    public override bool IsValid() => true;
}