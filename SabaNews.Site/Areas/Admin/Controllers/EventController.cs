namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Criteria.User;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using System;
using System.Threading.Tasks;

public class EventController(IUserService userSerive, IExportExcelService excelService) : AdminController
{
    public ActionResult MembershipEvent()
    {
        return View();
    }

    public async Task<ActionResult> GetMembershipEventData(UserFilterMembershipEventModel model)
    {
        var criteria = new GetMembershipEventDataCriteria
        {
            Start = (model.Page - 1) * model.PageSize,
            End = model.PageSize,
            ToDate = DateTimeUtilize.DateTime(2022, 2, 28).ConvertToGMT()
        };
        var users = await userSerive.GetUserMembershipEventDataAsync(criteria);
        var viewModel = new MembershipEventGridViewModel
        {
            Users = users,
            Paging = new PagingModel
            {
                CurrentPage = model.Page,
                PageSize = model.PageSize,
                TotalPages = (int)Math.Ceiling(criteria.TotalItems / (double)model.PageSize)
            }
        };

        return PartialView("_MembershipEventDataGrid", viewModel);
    }

    public async Task<ActionResult> MembershipEventResult(int resultNumber)
    {
        var criteria = new GetMembershipEventResultCriteria
        {
            Start = Constants.FromFirstItem,
            End = Constants.GetFiveItems,
            ResultNumber = resultNumber,
            ToDate = DateTimeUtilize.DateTime(2022, 2, 28).ConvertToGMT()
        };
        var users = await userSerive.GetMembershipEventResultAsync(criteria);
        ViewBag.ResultNumber = resultNumber;
        return View(users);
    }

    public async Task<ActionResult> ExportExcel()
    {
        var criteria = new GetMembershipEventDataCriteria
        {
            Start = Constants.FromFirstItem,
            End = Constants.Total,
            ToDate =DateTimeUtilize.DateTime(2022, 2, 28).ConvertToGMT()
        };
        var users = await userSerive.GetUserMembershipEventDataAsync(criteria);
        var bytes = excelService.ExportMembershipEvent(users);
        return File(bytes, "application/xlsx", "event.xlsx");
    }
}