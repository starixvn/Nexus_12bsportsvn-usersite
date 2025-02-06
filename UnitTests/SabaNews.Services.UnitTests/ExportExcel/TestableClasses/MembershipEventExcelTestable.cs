namespace SabaNews.Services.UnitTests.ExportExcel.TestableClasses;

using OfficeOpenXml;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.ExportExcel;
using System.Collections.Generic;


public class MembershipEventExcelTestable(string templatePath, IEnumerable<MembershipEventModel> users)
    : MembershipEventExcel(templatePath, users)
{
    public void Public_RenderTitle(ExcelWorksheet templateWorksheet, ExcelWorksheet worksheet)
    {
        base.RenderTitle(templateWorksheet, worksheet);
    }



    public void Public_RenderBody(ExcelWorksheet templateWorksheet, ExcelWorksheet worksheet)
    {
        base.RenderBody(templateWorksheet, worksheet);
    }

    public void Public_RenderRow(ExcelWorksheet worksheet, MembershipEventModel user, int index, int rowIndex)
    {
        base.RenderRow(worksheet, user, index, rowIndex);
    }

    public void Public_ProcessUI(ExcelWorksheet worksheet)
    {
        base.ProcessUI(worksheet);
    }
}