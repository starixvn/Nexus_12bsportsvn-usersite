namespace SabaNews.Site.Extensions;

using System;
using TimeZoneConverter;

public static class DateTimeExtensions
{
    private static readonly TimeZoneInfo SEAsiaTimeZone = TZConvert.GetTimeZoneInfo("SE Asia Standard Time");
    private static readonly TimeSpan timeSpan = new(7, 0, 0);

    public static string ToDateGMTSEAsia(this DateTime date) =>  new DateTimeOffset(TimeZoneInfo.ConvertTime(date , SEAsiaTimeZone), timeSpan).ToString("yyyy-MM-ddTHH:mm:sszzz");

    public static string ToDateGMTSEAsia(this DateTimeOffset date)
    {
        var time = date.UtcDateTime;
        return new DateTimeOffset(TimeZoneInfo.ConvertTime(time, SEAsiaTimeZone), timeSpan).ToString("yyyy-MM-ddTHH:mm:sszzz");
    }


}