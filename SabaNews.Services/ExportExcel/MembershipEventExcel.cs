namespace SabaNews.Services.ExportExcel;

using OfficeOpenXml;
using OfficeOpenXml.Style;
using SabaNews.Models.ViewModel.User;
using System.Collections.Generic;

public class MembershipEventExcel(string templatePath, IEnumerable<MembershipEventModel> users)
    : ExcelBase(templatePath, 0, "Event")
{
    private const byte RowStartHeader = 2;
    private const byte TotalColumnsHeader = 5;
    private const byte ColIndexLuckynumber = 4;
    private const byte ColIndexCount = 1;
    private const byte ColEmail = 3;
    private const byte DefaultColWidth = 20;
    private const byte EmailColWidth = 35;

    protected internal override void RenderTitle(ExcelWorksheet templateWorksheet, ExcelWorksheet worksheet)
    {
        templateWorksheet.Cells[1, 1, RowStartHeader - 1, TotalColumnsHeader]
            .Copy(worksheet.Cells[1, 1, RowStartHeader - 1, TotalColumnsHeader]);
    }

    protected internal override void RenderBody(ExcelWorksheet templateWorksheet, ExcelWorksheet worksheet)
    {
        var rowIndex = 1;
        var index = 0;
        foreach (var user in users)
        {
            rowIndex++;
            index++;
            RenderRow(worksheet, user, index, rowIndex);
        }
    }

    protected internal virtual void RenderRow(ExcelWorksheet worksheet, MembershipEventModel user, int index, int rowIndex)
    {
        var colIndex = 1;
        worksheet.Cells[rowIndex, colIndex++].Value = index;
        worksheet.Cells[rowIndex, colIndex++].Value = user.Name;
        worksheet.Cells[rowIndex, colIndex++].Value = user.Email;
        worksheet.Cells[rowIndex, colIndex++].Value = user.LuckyNumber;
        worksheet.Cells[rowIndex, colIndex].Value = user.JoinDate.ToString("dd/MM/yyyy HH:mm:ssss");
        worksheet.Cells[rowIndex, ColIndexCount].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        worksheet.Cells[rowIndex, ColIndexLuckynumber].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
    }



    protected internal override void ProcessUI(ExcelWorksheet worksheet)
    {
        worksheet.DefaultColWidth = DefaultColWidth;
        worksheet.Column(ColEmail).Width = EmailColWidth;
    }
}