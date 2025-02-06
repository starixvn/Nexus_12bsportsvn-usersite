namespace SabaNews.Site.Extensions;

using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Models.RSS;
using System.Xml.Linq;

public static class RssHelper
{
    private static readonly XNamespace xmlns_atom = "http://www.w3.org/2005/Atom";
    private static readonly XNamespace xmlns_doc = "http://purl.org/dc/elements/1.1";
    public static string GetRSSDocument(RSSCategoryModel RssData, string domain, string atomLink)
    {
        XElement root = new("rss", new XAttribute("version", "2.0"), new XAttribute(XNamespace.Xmlns + "atom", xmlns_atom), new XAttribute(XNamespace.Xmlns + "dc", xmlns_doc));

        var channel = new XElement("channel",
            new XElement("title", RssData.Category.Title),
            new XElement("copyright", Constants.SiteName),
            new XElement("link", $"{domain}{RssData.Category.Url}"),
            new XElement("description", RssData.Category.Description),
            new XElement("language", "vi-vn"),
            new XElement("pubDate", DateTimeExtensions.ToDateGMTSEAsia(DateTimeUtilize.Now())),
            new XElement("lastBuildDate", DateTimeExtensions.ToDateGMTSEAsia(DateTimeUtilize.Now())),
            new XElement("doc", $"{domain}rss.html"),
            new XElement("managingEditor", Constants.SiteMail),
            new XElement("webMaster", Constants.SiteMail),
            new XElement("image",
                new XElement("url", $"{domain}images/sabasports.svg"),
                new XElement("title", RssData.Category.Title),
                new XElement("link", $"{domain}{RssData.Category.Url}")),
            new XElement(xmlns_atom + "link",
                new XAttribute("href", $"{domain}{atomLink}"),
                new XAttribute("rel", "self"), new XAttribute("type","application/rss+xml")));

        foreach(var item in RssData.Posts)
        {
            var image = $"<img src=\"{item.FeatureImage}\" alt=\"{item.PostTitle}\" />";
            var description = new XCData($"<a href=\"{domain}{item.Uri}\">{image}</a>{item.PostExcerpt}");
            var itemElement = new XElement("item",
                new XElement("title", new XCData(item.PostTitle)),
                new XElement("description", description),
                new XElement(xmlns_doc + "creator", item.Author),
                new XElement("link", $"{domain}{item.Uri}"),
                new XElement("pubDate", DateTimeExtensions.ToDateGMTSEAsia(item.PostDateGMT)),
                new XElement("guid", $"{domain}{item.Uri}"),
                new XElement(xmlns_atom + "link",
                    new XAttribute("href", $"{domain}{item.Uri}"),
                    new XAttribute("rel", "self"), new XAttribute("type","application/rss+xml")));
            channel.Add(itemElement);
        }
        root.Add(channel);
        XDocument document = new(root);
        return document.ToString();
    }
}