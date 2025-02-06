namespace SabaNews.Services.ExportExcel;

using OfficeOpenXml;
using System.IO;

public abstract class ExcelBase(string templatePath, short templateSheetIndex = 0, string sheetName = "Data")
{
    protected internal abstract void RenderTitle(ExcelWorksheet templateWorksheet, ExcelWorksheet worksheet);

    protected internal abstract void RenderBody(ExcelWorksheet templateWorksheet, ExcelWorksheet worksheet);

    protected internal virtual void ProcessUI(ExcelWorksheet worksheet)
    {
    }

    public virtual byte[] Export()
    {
        using var templateExcelPackage = new ExcelPackage(new FileInfo(templatePath));
        using var excelPackage = new ExcelPackage();
        var templateWorksheet = templateExcelPackage.Workbook.Worksheets[templateSheetIndex];
        var worksheet = excelPackage.Workbook.Worksheets.Add(sheetName);

        RenderTitle(templateWorksheet, worksheet);
        RenderBody(templateWorksheet, worksheet);

        ProcessUI(worksheet);

        return excelPackage.GetAsByteArray();
    }
}