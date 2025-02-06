namespace SabaNews.Services;

using Microsoft.AspNetCore.Hosting;
using SabaNews.Services.Interfaces;
using System.IO;

public class PathService(IWebHostEnvironment webHostEnvironment) : IPathService
{
    public string MapPath(string path)
    {
        var webRootPath = webHostEnvironment.WebRootPath;

        return Path.Combine(webRootPath, path);
    }

    public string MapPathContentRoot(string path)
    {
        var contentRootPath = webHostEnvironment.ContentRootPath;

        return Path.Combine(contentRootPath, path);
    }

    public string MapFullPath(string path)
    {
        var contentRootPath = webHostEnvironment.ContentRootPath;

        return Path.GetFullPath(contentRootPath + path);
    }

    public string MapAbsoluteRootPath(string path)
    {
        var webRootPath = webHostEnvironment.WebRootPath;
        return Path.GetFullPath(webRootPath + path);
    }

    public string EnsureCorrectFilename(string filename)
    {
            
        if (filename.Contains("\\"))
        {
            filename = filename.Replace("\\", "");
        }
        if (filename.Contains(" "))
        {
            filename = filename.Replace(" ", "");
        }
        if (filename.Contains("_"))
        {
            filename = filename.Replace("_", "");
        }

        return filename;
    }

}