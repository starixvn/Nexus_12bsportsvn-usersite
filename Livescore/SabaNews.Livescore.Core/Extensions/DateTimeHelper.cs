namespace SabaNews.Livescore.Core.Extensions;

using System;

public static class DateTimeHelper
{
    public static DateTime? UnixTimeStampToDateTime(double unixTimeStamp)
    {
        if (unixTimeStamp > 0)
        {
            var dtDateTime = DateTimeOffset.UnixEpoch.DateTime;
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp);
            return dtDateTime;
        }

        return null;
    }
}