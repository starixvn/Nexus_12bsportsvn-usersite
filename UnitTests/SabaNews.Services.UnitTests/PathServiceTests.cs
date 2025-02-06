namespace SabaNews.Services.UnitTests;

using AutoFixture;
using Microsoft.AspNetCore.Hosting;
using NSubstitute;
using System.IO;
using Xunit;

public class PathServiceTests
{
    private IWebHostEnvironment webHostEnvironment;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void MapPath_WhenCalled_ReturnExpectedPath()
    {
        //Arrange
        var service = GetPathService();
        var path = fixture.Create<string>();
        var webRootPath = webHostEnvironment.WebRootPath;
        var expected = Path.Combine(webRootPath, path);

        //Act
        var actual =  service.MapPath(path);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void MapFullPath_WhenCalled_ReturnExpectedPath()
    {
        //Arrange
        var service = GetPathService();
        var path = fixture.Create<string>();
        var webRootPath = webHostEnvironment.ContentRootPath;
        var expected = Path.GetFullPath(webRootPath + path);

        //Act
        var actual = service.MapFullPath(path);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void MapAbsoluteRootPath_WhenCalled_ReturnExpectedPath()
    {
        //Arrange
        var service = GetPathService();
        var path = fixture.Create<string>();
        var webRootPath = webHostEnvironment.WebRootPath;
        var expected = Path.GetFullPath(webRootPath + path);

        //Act
        var actual = service.MapAbsoluteRootPath(path);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void MapPathContentRoot_WhenCalled_ReturnExpectedPath()
    {
        //Arrange
        var service = GetPathService();
        var path = fixture.Create<string>();
        var webRootPath = webHostEnvironment.ContentRootPath;
        var expected = Path.Combine(webRootPath, path);

        //Act
        var actual = service.MapPathContentRoot(path);

        //Assert
        Assert.Equal(expected, actual);
    }

    [Fact]
    public void EnsureCorrectFilename_WhenCalled_ReturnExpectedPath()
    {
        //Arrange
        var service = GetPathService();
        var filePath = "\\ test_1.png";

        //Act
        var actual = service.EnsureCorrectFilename(filePath);

        //Assert
        Assert.Equal("test1.png", actual);
    }

    #region Helpers
    private PathService GetPathService()
    {
        webHostEnvironment = Substitute.For<IWebHostEnvironment>();
        var service = new PathService(webHostEnvironment);

        return service;
    }
    #endregion Helpers
}