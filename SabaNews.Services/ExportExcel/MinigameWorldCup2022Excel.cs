namespace SabaNews.Services.ExportExcel;

using OfficeOpenXml;
using OfficeOpenXml.Style;
using SabaNews.Models.Event.WorldCup;
using System.Collections.Generic;

public class MinigameWorldCup2022Excel(string templatePath, IEnumerable<UserMinigameModel> miniGames)
    : ExcelBase(templatePath, 0, "MiniGame WorldCup 2022")
{
    private const byte RowStartHeader = 2;
    private const byte TotalColumnsHeader = 6;
    private const byte ColIndexPoint = 4;
    private const byte ColIndexCount = 1;
    private const byte ColEmail = 3;
    private const byte ColNumber = 1;
    private const byte ColUsername = 2;
    private const byte ColJoinDate = 5;
    private const byte DefaultColWidth = 10;
    private const byte SmallColWidth = 5;
    private const byte EmailColWidth = 35;
    private const byte UserNameColWidth = 45;
    private const byte JoinDateColWidth = 25;

    protected internal override void RenderTitle(ExcelWorksheet templateWorksheet, ExcelWorksheet worksheet)
    {
        templateWorksheet.Cells[1, 1, RowStartHeader - 1, TotalColumnsHeader]
            .Copy(worksheet.Cells[1, 1, RowStartHeader - 1, TotalColumnsHeader]);
    }

    protected internal override void RenderBody(ExcelWorksheet templateWorksheet, ExcelWorksheet worksheet)
    {
        var rowIndex = 1;
        var index = 0;
        foreach (var user in miniGames)
        {
            rowIndex++;
            index++;
            RenderRow(worksheet, user, index, rowIndex);
        }
    }

    protected internal virtual void RenderRow(ExcelWorksheet worksheet, UserMinigameModel user, int index, int rowIndex)
    {
        var colIndex = 1;
        worksheet.Cells[rowIndex, colIndex++].Value = index;
        worksheet.Cells[rowIndex, colIndex++].Value = user.UserName;
        worksheet.Cells[rowIndex, colIndex++].Value = user.Email;
        worksheet.Cells[rowIndex, colIndex++].Value = user.Point;
        worksheet.Cells[rowIndex, colIndex].Value = user.UpdatedDate.ToString("dd/MM/yyyy HH:mm:ssss");
        worksheet.Cells[rowIndex, ColIndexCount].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        worksheet.Cells[rowIndex, ColUsername].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        worksheet.Cells[rowIndex, ColEmail].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        worksheet.Cells[rowIndex, ColIndexPoint].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        worksheet.Cells[rowIndex, ColJoinDate].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
    }

    protected internal override void ProcessUI(ExcelWorksheet worksheet)
    {
        worksheet.DefaultColWidth = DefaultColWidth;
        worksheet.Column(ColNumber).Width = SmallColWidth;
        worksheet.Column(ColEmail).Width = EmailColWidth;
        worksheet.Column(ColUsername).Width = UserNameColWidth;
        worksheet.Column(ColJoinDate).Width = JoinDateColWidth;
    }
}