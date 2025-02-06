namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Services;
using SabaNews.Services.Interfaces;
using System.Threading.Tasks;

public class BannerManagementController(
    IBannerService bannerService,
    IOptionService optionService,
    ISessionService sessionService,
    IFileService fileService)
    : AdminController
{
    public async Task<IActionResult> Desktop()
    {
        var banner = await bannerService.GetBannerInfoAsync();

        return View("~/Areas/Admin/Views/BannerManagement/desktop.cshtml", banner);
    }

    public async Task<IActionResult> Mobile()
    {
        var banner = await bannerService.GetBannerInfoAsync();

        return View("~/Areas/Admin/Views/BannerManagement/mobile.cshtml", banner);
    }


    public async Task<IActionResult> Post()
    {
        var banner = await bannerService.GetBannerInfoAsync();

        return View("~/Areas/Admin/Views/BannerManagement/post.cshtml", banner);
    }

    [HttpPost]
    public async Task<IActionResult> UpdateInfo(string value, string type)
    {
        value ??= "";
        var result = await optionService.UpdateOptionAsync(type, value, sessionService.User.Id);
        return Json(result);
    }

    [HttpPost]
    public async Task<IActionResult> UploadBanner(IFormFile file, string type)
    {
        var uploadResult = await fileService.UploadFileAsync(file, UploadDir.BannerUploadFolder);
        if (!uploadResult.IsSuccessful)
        {
            return Json(uploadResult);
        }
        var url = uploadResult.AbsoluteUrl;
        var result = await optionService.UpdateOptionAsync(type, url, sessionService.User.Id);
        return Json(result);
    }

    public async Task<IActionResult> TrackingBannerClick()
    {
        var option = await optionService.GetOptionAsync(OptionKey.BannerClickCount);
        return Json(option?.OptionValue);
    }
}