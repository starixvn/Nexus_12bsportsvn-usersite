namespace SabaNews.Models.Email;

using System.Collections.Generic;
using System.IO;

public class FileBrowseViewModel
{
    public string BaseUrl { get; set; }

    public IEnumerable<FileInfo> FileInfos { get; set;}
}