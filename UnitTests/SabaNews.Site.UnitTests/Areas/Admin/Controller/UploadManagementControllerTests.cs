namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using System.IO;
using Xunit;

public class UploadManagementControllerTests : AdminController
{
    private IPathService pathService;
    private IConfiguration configuration;

    [Fact]
    public void FileBrowse_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var enviroment = System.Environment.CurrentDirectory;
        var projectDirectory = Directory.GetParent(enviroment).Parent.Parent.FullName;
        var path = "FilesTest";
        var filePath = Path.Combine(projectDirectory, path);

        pathService.MapAbsoluteRootPath(Arg.Do<string>(x => x = path)).Returns(filePath);
        //Act
        var actual = controller.FileBrowse();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        Assert.Equal("FileBrowse", viewResult.ViewName);
    }

    [Fact]
    public void ListBanner_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var enviroment = System.Environment.CurrentDirectory;
        var projectDirectory = Directory.GetParent(enviroment).Parent.Parent.FullName;
        var path = "FilesTest";
        var filePath = Path.Combine(projectDirectory, path);

        pathService.MapAbsoluteRootPath(Arg.Do<string>(x => x = path)).Returns(filePath);
        //Act
        var actual = controller.ListBanner();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        Assert.Equal("_ListBanner", viewResult.ViewName);
    }

    #region Helpers
    private UploadManagementController GetController()
    {
        pathService = Substitute.For<IPathService>();
        configuration = Substitute.For<IConfiguration>();
           
        var controller = new UploadManagementController(pathService, configuration);

        return controller;
    }
       
    #endregion Helpers
}