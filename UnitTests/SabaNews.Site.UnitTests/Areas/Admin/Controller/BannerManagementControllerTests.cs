namespace SabaNews.Site.UnitTests.Areas.Admin.Controller;

using AutoFixture;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Models.Banner;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Areas.Admin.Controllers;
using System.IO;
using System.Threading.Tasks;
using Xunit;

public class BannerManagementControllerTests : AdminController
{
    private IBannerService bannerService;
    private IOptionService optionService;
    private IFileService fileService;
    private ISessionService sessionService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task UpdateInfo_WhenValueIsNotNull_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var user = fixture.Create<UserSession>();
        var value = fixture.Create<string>();
        var type = fixture.Create<string>();
        var expectedCommand = fixture.Create<CommandResult>();
        sessionService.User.Returns(user);
        optionService.UpdateOptionAsync(Arg.Do<string>(x => x = type), Arg.Do<string>(x => x = value), user.Id).Returns(expectedCommand);

        //Act
        var actual = await controller.UpdateInfo(value, type);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, result);
    }

    [Fact]
    public async Task UpdateInfo_WhenValueIsNull_ReturnExpectedData()
    {
        // Arrange
        var controller = GetController();
        var user = fixture.Create<UserSession>();
        string value = null;
        var type = fixture.Create<string>();
        var expectedCommand = fixture.Create<CommandResult>();
        sessionService.User.Returns(user);
        optionService.UpdateOptionAsync(Arg.Do<string>(x => x = type), Arg.Do<string>(x => x = value), user.Id).Returns(expectedCommand);

        //Act
        var actual = await controller.UpdateInfo(value, type);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, result);
    }


    [Fact]
    public async Task Desktop_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<BannerModel>();
        fixture.Create<CommandResult>();
        bannerService.GetBannerInfoAsync().Returns(expected);
        //Act
        var actual = await controller.Desktop();

        //Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<BannerModel>(viewResult.Model);
        Assert.Equal(expected, viewModel);
    }

    [Fact]
    public async Task Mobile_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<BannerModel>();
        fixture.Create<CommandResult>();
        bannerService.GetBannerInfoAsync().Returns(expected);
        //Act
        var actual = await controller.Mobile();

        //Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<BannerModel>(viewResult.Model);
        Assert.Equal(expected, viewModel);
    }

    [Fact]
    public async Task Post_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var expected = fixture.Create<BannerModel>();
        fixture.Create<CommandResult>();
        bannerService.GetBannerInfoAsync().Returns(expected);
        //Act
        var actual = await controller.Post();

        //Assert
        var viewResult = Assert.IsType<ViewResult>(actual);
        var viewModel = Assert.IsType<BannerModel>(viewResult.Model);
        Assert.Equal(expected, viewModel);
    }

    [Fact]
    public async Task UploadBanner_WhenCalled_ReturnExpectedViewResult()
    {
        // Arrange
        var controller = GetController();
        var type = fixture.Create<string>();
        var expectedUploadResult = new UploadResult { Code = Constants.SuccessCode, Message = "url" };
        var stream = new MemoryStream();
        var header = new HeaderDictionary { { "Name", new string[] { "Value" } } };
        var file = new FormFile(new MemoryStream(), 0, stream.Length, "id_from_form", "test.png")
        {
            Headers = header,
            ContentType = "application/pdf"
        };
        var user = fixture.Create<UserSession>();
        var expectedCommand = fixture.Create<CommandResult>();
        sessionService.User.Returns(user);

        fileService.UploadFileAsync(Arg.Do<IFormFile>(x => x = file), Arg.Do<string>(x => x = UploadDir.BannerUploadFolder)).Returns(expectedUploadResult);
        optionService.UpdateOptionAsync(Arg.Do<string>(x => x = type), Arg.Do<string>(x => x = "value"), user.Id).Returns(expectedCommand);
        //Act
        var actual = await controller.UploadBanner(file, type);

        //Assert
        var jsonResult = Assert.IsType<JsonResult>(actual);
        var result = Assert.IsAssignableFrom<CommandResult>(jsonResult.Value);
        Assert.Equal(expectedCommand, result);
    }


    #region Helpers
    private BannerManagementController GetController()
    {
        bannerService = Substitute.For<IBannerService>();
        optionService = Substitute.For<IOptionService>();
        fileService = Substitute.For<IFileService>();
        sessionService = Substitute.For<ISessionService>();
        var controller = new BannerManagementController(bannerService, optionService, sessionService, fileService);

        return controller;
    }

    #endregion Helpers
}