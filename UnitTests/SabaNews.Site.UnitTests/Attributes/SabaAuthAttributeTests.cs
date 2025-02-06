namespace SabaNews.Site.UnitTests.Attributes;

using AutoFixture;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using NSubstitute;
using SabaNews.Site.Attributes;
using System;
using System.Collections.Generic;
using Xunit;

public class SabaAuthAttributeTests
{
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public void OnAuthorization_WhenPostIsNull_ReturnExpectedVData()
    {
        // Arrange
        var attr = new SabaAuthAttribute();
        var authService = Substitute.For<IAuthenticationService>();
        var session = Substitute.For<ISession>();
        var serviceProvider = Substitute.For<IServiceProvider>();
        serviceProvider.GetService(typeof(IAuthenticationService)).Returns(authService);
        var httpContext = new DefaultHttpContext
        {
            RequestServices = serviceProvider,
            Session = session
        };
        var context = new AuthorizationFilterContext(
            new ActionContext
            {
                HttpContext = httpContext,
                RouteData = new RouteData(),
                ActionDescriptor = new ActionDescriptor()
            },
            new List<IFilterMetadata>());

        var key = fixture.Create<string>();

        session.TryGetValue(Arg.Do<string>(x => x = key), out _).Returns(true);
            
        //Act
        attr.OnAuthorization(context);

        // Assert
        var redirectResult = Assert.IsAssignableFrom<RedirectResult>(context.Result);
        Assert.Equal("/", redirectResult.Url);
    }
}