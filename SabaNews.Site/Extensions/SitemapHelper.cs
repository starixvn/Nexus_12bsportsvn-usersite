namespace SabaNews.Site.Extensions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Match;
using SabaNews.Models;
using SabaNews.Models.Posts;

public static class SitemapHelper
{
    private static readonly XNamespace xmlns = "http://www.sitemaps.org/schemas/sitemap/0.9";
    private static readonly XNamespace xmlns_news = "http://www.google.com/schemas/sitemap-news/0.9";
    private const int lastHoursOfDay = 23;
    private const int lastMinute = 59;
    private const int lastSecond = 59;
    private const int firstYear = 2020;
    private const string urlset = "urlset";
    private const string sitemapIndex = "sitemapindex";

    public static string GetSitemapForDayAndYear(string domain)
    {
        XElement root = new(xmlns + sitemapIndex);
        var currentDate = DateTimeUtilize.Now();
        var firstDateOfYear = DateTimeUtilize.DateTime(currentDate.Year, 1, 1);

        var urlElement = RenderPostSitemap("sitemap/categories.xml", DateTimeUtilize.UtcNow(), domain);
        root.Add(urlElement);
        urlElement = RenderPostSitemap("sitemap/tag.xml", DateTimeUtilize.UtcNow(), domain);
        root.Add(urlElement);
        urlElement = RenderPostSitemap("sitemap-news.xml", DateTimeUtilize.UtcNow(), domain);
        root.Add(urlElement);
        urlElement = RenderPostSitemap("sitemap/match.xml", DateTimeUtilize.UtcNow(), domain);
        root.Add(urlElement);
        urlElement = RenderPostSitemap("sitemap/league.xml", DateTimeUtilize.UtcNow(), domain);
        root.Add(urlElement);
        while (currentDate >= firstDateOfYear)
        {
            urlElement = RenderPostSitemap($"sitemap/article-day-{currentDate:yyyy-MM-dd}.xml", currentDate, domain);
            root.Add(urlElement);
            currentDate = currentDate.AddDays(-1);
            currentDate = DateTimeUtilize.DateTime(currentDate.Year, currentDate.Month, currentDate.Day, lastHoursOfDay, lastMinute, lastSecond);
        }
        var currentYear = DateTimeUtilize.Now().AddYears(-1).Year;
        while (currentYear >= firstYear)
        {
            urlElement = RenderPostSitemap($"sitemap/article-year-{currentYear}.xml", currentDate, domain);
            root.Add(urlElement);
            currentYear--;
        }

        XDocument document = new(root);
        return document.ToString();
    }

    public static string GetSitemapForYear(int year, string domain)
    {
        XElement root = new(xmlns + sitemapIndex);
        var currentDate = DateTimeUtilize.DateTime(year, 12, 31, 23, 59, 59);
        var firstDateOfYear = DateTimeUtilize.DateTime(year, 1, 1);
        while (currentDate >= firstDateOfYear)
        {
            var urlElement = RenderPostSitemap($"sitemap/article-day-{currentDate:yyyy-MM-dd}.xml", currentDate, domain);
            root.Add(urlElement);
            currentDate = currentDate.AddDays(-1);
            currentDate = DateTimeUtilize.DateTime(currentDate.Year, currentDate.Month, currentDate.Day, lastHoursOfDay, lastMinute, lastSecond);
        }

        XDocument document = new(root);
        return document.ToString();
    }

    public static string GetSitemapDocument(IList<Post> sitemapNodes, string domain)
    {
        XElement root = new(xmlns + urlset);

        foreach (var sitemapNode in sitemapNodes)
        {
            var urlElement = RenderPostSitemap(sitemapNode.Uri, sitemapNode.PostDate, domain, false);
            root.Add(urlElement);
        }

        XDocument document = new(root);
        return document.ToString();
    }

    public static string GetSitemapCategories(IEnumerable<Menu> menus, string domain)
    {
        XElement root = new(xmlns + urlset);
        var urlElement = RenderCategorySitemap("", domain);
        root.Add(urlElement);
        foreach (var menu in menus.Where(item => !string.IsNullOrEmpty(item.CateSlug)))
        {
            urlElement = RenderCategorySitemap($"{menu.CateSlug}{CategoryKey.Suffix}", domain);
            root.Add(urlElement);
        }

        XDocument document = new(root);
        return document.ToString();
    }

    public static string GetSitemapTags(IList<Category> tags, string domain)
    {
        XElement root = new(xmlns + urlset);
        foreach (var tag in tags)
        {
            var urlElement = RenderCategorySitemap($"tag/{tag.Slug}", domain);
            root.Add(urlElement);
        }

        XDocument document = new(root);
        return document.ToString();
    }

    public static string GetSitemapNews(IEnumerable<NewsSitemapModel> sitemapNodes, string domain)
    {
        XElement root = new(xmlns + urlset,
            new XAttribute(XNamespace.Xmlns + "news", xmlns_news));

        foreach (var sitemapNode in sitemapNodes)
        {
            XElement publicationElement = new(
                xmlns_news + "publication",
                new XElement(xmlns_news + "name", Constants.SiteName),
                new XElement(xmlns_news + "language", "vi"));
            XElement newsElement = new(
                xmlns_news + "news",
                publicationElement,
                new XElement(xmlns_news + "publication_date",
                    DateTimeExtensions.ToDateGMTSEAsia(sitemapNode.ModifiedDate.Value)),
                new XElement(xmlns_news + "title", sitemapNode.Title),
                new XElement(xmlns_news + "keywords", sitemapNode.Tags));
            XElement urlE = new(
                xmlns + "url",
                new XElement(xmlns + "loc", Uri.EscapeUriString($"{domain}{sitemapNode.Uri}")),
                newsElement);
            root.Add(urlE);
        }

        XDocument document = new(root);
        return document.ToString();
    }

    public static string GetSitemapLeague(IList<League> leagues, string domain)
    {
        XElement root = new(xmlns + urlset);
        foreach (var league in leagues)
        {
            var leagueName = LivescoreHelper.GetLeagueName(league);
            leagueName = GetSlug(leagueName);
            var url = $"lich-thi-dau/bong-da/{leagueName}/{league.LeagueId}/tong-hop";
            var urlElement = RenderLivescoreSitemap(url, domain);
            root.Add(urlElement);
        }

        XDocument document = new(root);
        return document.ToString();
    }

    public static string GetSitemapMatch(IList<MatchSitemap> matches, string domain)
    {
        XElement root = new(xmlns + urlset);
        foreach (var match in matches)
        {
            var leagueName = LivescoreHelper.GetGeneralName(match.LeagueNameEN, match.LeagueFullNameEN, match.LeagueNameVN);
            var homeName = LivescoreHelper.GetGeneralName(match.HomeTeamNameEN, match.HomeTeamFullNameEN, match.HomeTeamNameVN);
            var awayName = LivescoreHelper.GetGeneralName(match.AwayTeamNameEN, match.AwayTeamFullNameEN, match.AwayTeamNameVN);
            var matchName = $"{homeName} vs {awayName}";
            leagueName = GetSlug(leagueName);
            var url = $"lich-thi-dau/bong-da/{GetSlug(leagueName)}/{GetSlug(matchName)}/{match.MatchId}";
            var urlElement = RenderLivescoreSitemap(url, domain);
            root.Add(urlElement);
        }

        XDocument document = new(root);
        return document.ToString();
    }

    private static XElement RenderPostSitemap(string url, DateTimeOffset datetime, string domain, bool isSitemap = true)
    {
        var root = isSitemap ? "sitemap" : "url";
        XElement urlElement = new(
            xmlns + root,
            new XElement(xmlns + "loc", Uri.EscapeUriString($"{domain}{url}")),
            new XElement(
                xmlns + "lastmod",
                DateTimeExtensions.ToDateGMTSEAsia(datetime)));
        return urlElement;
    }

    private static XElement RenderCategorySitemap(string url, string domain)
    {
        XElement urlElement = new(
            xmlns + "url",
            new XElement(xmlns + "loc", Uri.EscapeUriString($"{domain}{url}")),
            new XElement(xmlns + "lastmod", DateTimeExtensions.ToDateGMTSEAsia(DateTimeUtilize.UtcNow())),
            new XElement(xmlns + "changefreq", "daily"),
            new XElement(xmlns + "priority", 0.1));
        return urlElement;
    }

    private static XElement RenderLivescoreSitemap(string url, string domain)
    {
        XElement urlElement = new(
            xmlns + "url",
            new XElement(xmlns + "loc", Uri.EscapeUriString($"{domain}{url}")),
            new XElement(xmlns + "changefreq", "daily"),
            new XElement(xmlns + "priority", 0.8));
        return urlElement;
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