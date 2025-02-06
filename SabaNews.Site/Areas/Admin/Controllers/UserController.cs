namespace SabaNews.Site.Areas.Admin.Controllers;

using Microsoft.AspNetCore.Mvc;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Criteria.User;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using System;
using System.Threading.Tasks;
using SabaNews.Core.Constants;

public class UserController(IUserService userSerive, IExportExcelService excelService) : AdminController
{
    public ActionResult Index()
    {
        var now = DateTimeUtilize.Now();
        var viewModel = new UserFilterViewModel
        {
            FromDate = DateTimeUtilize.DateTime(now.Year, now.Month, 1),
            ToDate = now
        };
        return View(viewModel);
    }

    [HttpPost]
    public async Task<ActionResult> GetDataUser(UserFilterViewModel param)
    {
        var search = param.Search ??= "";
        var criteria = new GetUserReportCriteria
        {
            FromDate = param.FromDate.DateTime,
            ToDate = param.ToDate.DateTime,
            Search = search,
            SearchType = param.SearchType,
            DateSort = param.DateSort,
            Start = (param.Page - 1) * param.PageSize,
            End = param.PageSize
        };
        var users = await userSerive.GetUserReportAsync(criteria);
        var model = new UserGridViewModel
        {
            Users = users,
            DateSort = param.DateSort,
            TotalItems = criteria.TotalItems,
            Paging = new PagingModel
            {
                CurrentPage = param.Page,
                PageSize = param.PageSize,
                TotalPages = (int)Math.Ceiling(criteria.TotalItems / (double)param.PageSize)
            }
        };
        return PartialView("_UserDataGrid", model);
    }

    [HttpGet]
    public async Task<ActionResult> ExportExcel(UserFilterViewModel param)
    {
        var search = param.Search ??= "";
        var criteria = new GetUserReportCriteria
        {
            FromDate = param.FromDate.DateTime,
            ToDate = param.ToDate.DateTime,
            Search = search,
            SearchType = param.SearchType,
            DateSort = param.DateSort,
            Start = 0,
            End = Constants.Total
        };
        var users = await userSerive.GetUserReportAsync(criteria);
        var bytes = excelService.ExportUser(users);
        return File(bytes, "application/xlsx", "UserReport.xlsx");
    }
}