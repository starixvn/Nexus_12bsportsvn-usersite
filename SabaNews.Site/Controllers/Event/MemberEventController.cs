namespace SabaNews.Site.Controllers.Event;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.User;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using System;
using System.Threading.Tasks;

public class MemberEventController(
    ISessionService sessionService,
    IUserService userService,
    IConfiguration configuration)
    : Controller
{
    [Route("/su-kien-ruoc-loc-tan-nien")]
    public async Task<ActionResult> MembershipEvent()
    {
        var isLogin = sessionService.User != null;
        var model = new MembershipEventViewModel
        {
            IsLogin = isLogin,
            IsAdmin = isLogin && sessionService.User.Metadata.Contains(Role.Administrator),
            BaseUrl = configuration.GetValue<string>("BaseUrl")
        };
        if (sessionService.User != null)
        {
            model.User = sessionService.User;
            model.MembershipEventDetail = await userService.GetDetailMembershipEventDataAsync(new GetDetailMembershipEventCriteria { UserId = sessionService.User.Id });

        }
        return View("~/Views/Event/MemberEvent/MembershipEvent.cshtml", model);
    }

    [Route("/su-kien-ruoc-loc-tan-nien/ket-qua")]
    public ActionResult MembershipEventResult()
    {
        var isLogin = sessionService.User != null;
        var model = new MembershipEventViewModel
        {
            IsLogin = isLogin,
            IsAdmin = isLogin && sessionService.User.Metadata.Contains(Role.Administrator)
        };
        if (sessionService.User != null)
        {
            model.User = sessionService.User;

        }
        return View("~/Views/Event/MemberEvent/MembershipEventResult.cshtml", model);
    }


    public async Task<ActionResult> GetMembershipEventData(UserFilterMembershipEventModel model)
    {
        var criteria = new GetMembershipEventDataCriteria
        {
            Start = (model.Page - 1) * model.PageSize,
            End = model.PageSize,
            ToDate = DateTimeUtilize.DateTime(2022, 2, 28).ConvertToGMT()
        };
        var users = await userService.GetUserMembershipEventDataAsync(criteria);
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

        return PartialView("~/Views/Event/MemberEvent/_MembershipEventGridView.cshtml", viewModel);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMembershipEventData(string luckyNumber)
    {
        var result = new CommandResult();
        if (sessionService.User == null)
        {
            result.Message = "Vui lòng đăng nhập để tham gia sự kiện";
            return Json(result);
        }
        var command = new CreateUserMembershipEventDataCommand
        {
            LuckyNumber = luckyNumber,
            UserId = sessionService.User.Id,
            JoinDate = DateTimeUtilize.UtcNow()
        };
        result = await userService.CreateUserMembershipEventDataAsync(command);
        return Json(result);

    }

       
}