namespace SabaNews.Core.Models;

using System.Collections.Generic;

public class UMSettings
{
    public const string SettingKey = "UMSettings";
    public bool Enabled { get; set; }
    public bool IsUrgent { get; set; }
    public string From { get; set; }
    public string To { get; set; }
    public List<string> WhiteListUrls { get; set; } = [];
    public List<string> WhiteListIPs { get; set; } = [];
}