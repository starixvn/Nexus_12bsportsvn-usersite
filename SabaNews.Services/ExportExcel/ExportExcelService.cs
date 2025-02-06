namespace SabaNews.Services.ExportExcel;

using SabaNews.Models.Event.WorldCup;
using SabaNews.Models.User;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;

public class ExportExcelService(IPathService pathService) : IExportExcelService
{
    public byte[] ExportMembershipEvent(IEnumerable<MembershipEventModel> users)
    {
        const string ExcelTemplatePath = "ExcelTemplates/Event.xlsx";
        var templatePath = pathService.MapPathContentRoot(ExcelTemplatePath);
        var excel = new MembershipEventExcel(templatePath, users);
        return excel.Export();
    }

    public byte[] ExportMinigameWorldCup2022(IEnumerable<UserMinigameModel> miniGames)
    {
        const string ExcelTemplatePath = "ExcelTemplates/MiniGameWorldCup2022.xlsx";
        var templatePath = pathService.MapPathContentRoot(ExcelTemplatePath);
        var excel = new MinigameWorldCup2022Excel(templatePath, miniGames);
        return excel.Export();
    }

    public byte[] ExportUser(IEnumerable<UserReportModel> users)
    {
        const string ExcelTemplatePath = "ExcelTemplates/UserReport.xlsx";
        var templatePath = pathService.MapPathContentRoot(ExcelTemplatePath);
        var excel = new UserReportExcel(templatePath, users);
        return excel.Export();
    }
}