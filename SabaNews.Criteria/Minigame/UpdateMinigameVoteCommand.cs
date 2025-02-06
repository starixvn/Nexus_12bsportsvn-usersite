namespace SabaNews.Criteria.Minigame;

using System;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;

public class UpdateMinigameVoteCommand : BaseNonQueryCommand
{
    public long UserId { get; set; }

    public long MatchId { get; set; }

    public byte Stage { get; set; }

    public long TeamId { get; set; }

    public long LeagueId { get; set; }

    public long SeasonId { get; set; }
    public DateTime UpdatedDate { get; set; } = DateTimeUtilize.UtcNow().DateTime;

    public override string GetSettingKey() => "minigame_updateVote";

    public override bool IsValid() => UserId > 0 && MatchId > 0 && Stage <= Euro2024.MinigameStage2 && Stage >= Euro2024.MinigameStage1;
}