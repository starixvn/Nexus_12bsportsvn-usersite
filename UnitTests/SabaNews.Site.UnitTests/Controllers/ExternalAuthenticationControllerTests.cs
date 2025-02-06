namespace SabaNews.Site.UnitTests.Controllers;

using AutoFixture;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using SabaNews.Core.Services;
using SabaNews.Services.Interfaces;
using SabaNews.Site.Controllers;
using Xunit;

public class ExternalAuthenticationControllerTests : Controller
{
    private readonly IFixture fixture = new Fixture();
    private IExternalAuthService externalAuthService;
    private ISessionService sessionService;
    private IUserService userService;

    [Fact]
    public void Login_WhenCalled_RunExpected()
    {
        // Arrange
        var controller = GetController();
        //Act
        controller.Login();
    }
    
    #region Helpers
    private ExternalAuthenticationController GetController()
    {
        externalAuthService = Substitute.For<IExternalAuthService>();
        sessionService = Substitute.For<ISessionService>();
        userService = Substitute.For<IUserService>();
        var controller = new ExternalAuthenticationController(externalAuthService, sessionService, userService);
        controller.Url = Substitute.For<IUrlHelper>();
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        controller.ControllerContext.HttpContext.Request.Scheme = fixture.Create<string>();
        return controller;
    }

    #endregion Helpers
}