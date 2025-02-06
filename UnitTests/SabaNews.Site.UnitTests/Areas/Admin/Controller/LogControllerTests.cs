namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Models;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using System.IO;
using Xunit;

public class LogControllerTests : AdminController
{
    private IPathService pathService;
        
    [Fact]
    public void TrackingSP_WhenHaveFile_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var enviroment = System.Environment.CurrentDirectory;
        var projectDirectory = Directory.GetParent(enviroment).Parent.Parent.FullName;
        var path = "FilesTest//TrackingSP.txt";
        var filePath =  Path.Combine(projectDirectory, path);
            
        pathService.MapPathContentRoot(Arg.Do<string>(x => x = path)).Returns(filePath);
        //Act
        var actual = controller.TrackingSP();

        // Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        Assert.IsType<LogViewModel>(viewResult.Model);
    }

    [Fact]
    public void TrackingSP_WhenNotExitstFile_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var path = "LogFiles//TrackingSP.txt";
        pathService.MapPathContentRoot(Arg.Do<string>(x => x = path)).Returns(path);
        //Act
        var actual = controller.TrackingSP();

        // Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        Assert.Null(jsonResult.Value);
    }
    #region Helpers
    private LogController GetController()
    {
            
        pathService = Substitute.For<IPathService>();
        var controller = new LogController(pathService);

        return controller;
    }
    #endregion Helpers
}