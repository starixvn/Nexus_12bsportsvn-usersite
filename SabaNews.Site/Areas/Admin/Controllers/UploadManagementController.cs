namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Models.Email;
using SabaNews.Services.Interfaces;
using System;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

public class UploadManagementController(
    IPathService pathService,
    IConfiguration configuration)
    : AdminController
{
    private readonly string baseUrl = configuration.GetValue<string>("BaseUrl");

    [HttpPost]
    public async Task<ActionResult> UploadImageSendMail(IFormFile upload)
    {
        var filename = ContentDispositionHeaderValue.Parse(upload.ContentDisposition).FileName.Trim('"');
        filename = pathService.EnsureCorrectFilename(filename);
        filename = DateTimeUtilize.Now().Millisecond + filename;
        var error = "";
        try
        {
            await using var output = System.IO.File.Create(pathService.MapAbsoluteRootPath(Constants.UploadFolder + filename));
            await upload.CopyToAsync(output);
        }
        catch (Exception ex)
        {
            error = ex.ToString();
        }
        var linkPhoto = Constants.UploadFolder + filename;
        var url = string.Concat(baseUrl, linkPhoto);
        return new JsonResult(new { path = url, error });
    }



    [HttpGet]
    public IActionResult FileBrowse()
    {
        var dir = new DirectoryInfo(pathService.MapAbsoluteRootPath(Constants.UploadFolder));
        var model = new FileBrowseViewModel
        {
            FileInfos = dir.GetFiles().OrderByDescending(p => p.CreationTime).ToArray(),
            BaseUrl = baseUrl
        };
        ViewBag.fileInfos = dir.GetFiles();
        return View("FileBrowse", model);
    }


    [HttpPost]
    public ActionResult ListBanner()
    {
        var dir = new DirectoryInfo(pathService.MapAbsoluteRootPath("/" + Constants.BannerUploadFolder));
        var model = new FileBrowseViewModel
        {
            FileInfos = dir.GetFiles().OrderByDescending(p => p.CreationTime).ToArray(),
            BaseUrl = baseUrl + Constants.BannerUploadFolder
        };
        ViewBag.fileInfos = dir.GetFiles();
        return View("_ListBanner", model);
    }
}