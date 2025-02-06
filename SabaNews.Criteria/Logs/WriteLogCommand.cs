namespace SabaNews.Criteria.Logs;

using System;
using SabaNews.Core.Helper;

public class WriteLogCommand : BaseNonQueryCommand
{
    public int ActorId { get; set; }

    public int ActionId { get; set; }

    public string Data { get; set; }

    public string OldData { get; set; }

    public DateTimeOffset LogDate { get; set; } = DateTimeUtilize.UtcNow();

    public override string GetSettingKey() => "log_writelog";

    public override bool IsValid() => ActionId > 0;
}