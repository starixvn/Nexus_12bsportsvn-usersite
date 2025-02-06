namespace SabaNews.Services.Interfaces;

using SabaNews.Models.Event.WorldCup;
using SabaNews.Models.User;
using SabaNews.Models.ViewModel.User;
using System.Collections.Generic;

public interface IExportExcelService
{
    byte[] ExportMembershipEvent(IEnumerable<MembershipEventModel> users);
    byte[] ExportMinigameWorldCup2022(IEnumerable<UserMinigameModel> miniGames);
    byte[]  ExportUser(IEnumerable<UserReportModel> users);
}