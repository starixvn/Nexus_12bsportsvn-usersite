namespace SabaNews.Core.Models;

using System;

public class AppSettings
{
    public const string ConfigurationKey = "AppSettings";
    public DateTime MinDateSyncLivescoreData { get; set; }
    public int BatchSizeSyncLivescoreData { get; set; }
    public int BatchSizeSyncMatches { get; set; }
    public bool IsSkipSyncFinishedMatches { get; set; }
    public int HeadToHeadMaxFutureDays { get; set; }
    public int SyncHeadToHeadRowLimit { get; set; }
    public int NumOfDayPastToSyncMatch { get; set; }
    public int NumOfDayFutureToSyncMatch { get; set; }
    public int SyncIncidentMinutes { get; set; }
    public bool IsSyncIncident { get; set; }
}