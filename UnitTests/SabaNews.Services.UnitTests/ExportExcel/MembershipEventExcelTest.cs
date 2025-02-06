namespace SabaNews.Services.UnitTests.ExportExcel;

using NSubstitute;
using SabaNews.Models.ViewModel.User;
using SabaNews.Services.UnitTests.ExportExcel.TestableClasses;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

public class MembershipEventExcelTest 
{
    private readonly FakeExcelPackage excelPackage = new();
    private const byte RowStartHeader = 2;
    private const byte TotalColumnsHeader = 5;
    private const byte ColEmail = 3;
    private IEnumerable<MembershipEventModel> users;


    [Fact]
    public void RenderTitle_WhenCalled_ExpectedCopyRow()
    {
        //Arrange
        var template = excelPackage.Worksheets.Add("template");
        var worksheet = excelPackage.Worksheets.Add("data");
        var service = CreateExcel();

        // Act
        service.Public_RenderTitle(template, worksheet);

        // Assert
        Assert.Equal(template.Cells[1, 1, RowStartHeader - 1, TotalColumnsHeader],
            worksheet.Cells[1, 1, RowStartHeader - 1, TotalColumnsHeader]);
    }

    [Fact]
    public void RenderBody_WhenCalled_CallExpectedMethod()
    {
        //Arrange
        var template = excelPackage.Worksheets.Add("template");
        var worksheet = excelPackage.Worksheets.Add("data");
        var service = CreateExcel();

        // Act
        service.Public_RenderBody(template, worksheet);

        // Assert
        service.Received(2).Protected("RenderRow", worksheet, Arg.Any<MembershipEventModel>(), Arg.Any<int>(), Arg.Any<int>());
    }

    [Fact]
    public void RenderRow_WhenCalled_ExpectedCellValue()
    {
        // Arrange
        var worksheet = excelPackage.Worksheets.Add("data");
        var service = CreateExcel();
        var colIndex = 1;
        var rowIndex = 1;
        var index = 0;
        var user = users.FirstOrDefault();

        // Act
        service.Public_RenderRow(worksheet, user, index, rowIndex);

        // Assert
        Assert.Equal(worksheet.Cells[rowIndex, colIndex++].Value, index);
        Assert.Equal(worksheet.Cells[rowIndex, colIndex++].Value, user.Name);
        Assert.Equal(worksheet.Cells[rowIndex, colIndex++].Value, user.Email);
        Assert.Equal(worksheet.Cells[rowIndex, colIndex++].Value, user.LuckyNumber);
          
    }

    [Fact]
    public void ProcessUI_WhenCalled_CallExpectedMethod()
    {
        //Arrange
        var worksheet = excelPackage.Worksheets.Add("data");
        var service = CreateExcel();

        // Act
        service.Public_ProcessUI(worksheet);

        // Assert
        Assert.Equal(20, worksheet.DefaultColWidth);
        Assert.Equal(35, worksheet.Column(ColEmail).Width);

    }

    #region Helpers

    private MembershipEventExcelTestable CreateExcel()
    {
        users = new List<MembershipEventModel>
        {
            new()
            {
                ID = 1,
                Name = "Jack",
                Email = "jack@gmail.com",
                JoinDate = DateTime.Now,
                LuckyNumber = "132",
                Phone = "123456"
            },
            new()
            {
                ID = 2,
                Name = "Jimmy",
                Email = "jimmy@gmail.com",
                JoinDate = DateTime.Now,
                LuckyNumber = "023",
                Phone = "123456"
            }
        };
        var excel = Substitute.For<MembershipEventExcelTestable>(string.Empty, users);
        return excel;
    }
    #endregion
}