namespace SabaNews.Core.Helper;

using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using SabaNews.Core.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

public static class Helper
{
    public static T CheckOriginValue<T>(T origin, T current)
    {
        if (!origin.Equals(current))
        {
            return current;
        }
        return default;
    }

    public static List<T> ParseJsonToList<T>(string data)
    {
        var result = new List<T>();
        if (data == null)
        {
            return result;
        }
        result = JsonConvert.DeserializeObject<List<T>>(data);
        return result;
    }

    public static (string, long) GetCategoryInfo(string slug)
    {
        var list = slug.Split('-');
        var lastword = list[^1];
        var listSLug = list.Take(list.Length - 1);
        var id = lastword[1..];
        var cateSlug = string.Join("-", listSLug);
        return (cateSlug, long.Parse(id));
    }

    public static string ReplaceStringFromVarSeo(string str)
    {
        const string dateFormat = "dd/MM/yyyy";
        var result = Regex.Replace(str, WordpressVariable.SepVar, WordpressVariable.Separate, RegexOptions.IgnoreCase);
        result = Regex.Replace(result, WordpressVariable.SiteNameVar, WordpressVariable.SiteName, RegexOptions.IgnoreCase);
        result = Regex.Replace(result, WordpressVariable.PageVar, WordpressVariable.PageValue, RegexOptions.IgnoreCase);
        result = Regex.Replace(result, WordpressVariable.CurrentDateVar, DateTimeUtilize.FormatDateTime(DateTimeUtilize.UtcNow(), dateFormat), RegexOptions.IgnoreCase);

        return result;
    }

    public static string ReplaceStringFromVarSeo(string str, string title)
    {
        const string dateFormat = "dd/MM/yyyy";
        var result = Regex.Replace(str, WordpressVariable.SepVar, WordpressVariable.Separate, RegexOptions.IgnoreCase);
        result = Regex.Replace(result, WordpressVariable.SiteNameVar, WordpressVariable.SiteName, RegexOptions.IgnoreCase);
        result = Regex.Replace(result, WordpressVariable.PageVar, WordpressVariable.PageValue, RegexOptions.IgnoreCase);
        result = Regex.Replace(result, WordpressVariable.TitleVar, title, RegexOptions.IgnoreCase);
        result = Regex.Replace(result, WordpressVariable.CurrentDateVar, DateTimeUtilize.FormatDateTime(DateTimeUtilize.UtcNow(), dateFormat), RegexOptions.IgnoreCase);

        return result;
    }

    public static string GetClientIP(HttpContext context)
    {
        var clientIP = context.Request.Headers["x-forwarded-for"].ToString();
        clientIP = !string.IsNullOrWhiteSpace(clientIP) ? clientIP.Split(',')[0] : context.Connection.RemoteIpAddress.ToString();
        return clientIP;
    }

    public static string GetSlug(string text)
    {
        if(string.IsNullOrEmpty(text))
        {
            return "";
        }
        var regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
        var slug = text.Normalize(NormalizationForm.FormD).Trim().ToLower();
        slug = regex.Replace(slug, string.Empty)
            .Replace('\u0111', 'd').Replace('\u0110', 'D')
            .Replace(",", "").Replace(".", "").Replace("!", "")
            .Replace("(", "").Replace(")", "").Replace(";", "-")
            .Replace("/", "").Replace("%", "ptram").Replace("&", "va")
            .Replace("?", "").Replace('"', '-').Replace(' ', '-');
        return slug;
    }
}