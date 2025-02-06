namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Models;
using SabaNews.Services.Interfaces;
using System.IO;

public class LogController(IPathService pathService) : AdminController
{
    public IActionResult TrackingSP()
    {
        var filePath = pathService.MapPathContentRoot("LogFiles//TrackingSP.txt");
        if (System.IO.File.Exists(filePath))
        {
            using var sr = new StreamReader(filePath);
            var model = new LogViewModel
            {
                Log = sr.ReadToEnd().Replace("\r\n", "<br>")
            };
            return View(model);
        }
        return Json(null);
    }
}