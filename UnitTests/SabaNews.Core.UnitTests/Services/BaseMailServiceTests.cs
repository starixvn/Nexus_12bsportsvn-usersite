namespace SabaNews.Core.UnitTests.Services;

using System.Collections.Generic;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using Xunit;

public class BaseMailServiceTests
{
    private ILogServiceProvider logService;

    [Theory]
    [InlineData("123")]
    [InlineData("")]
    public async Task SendMailAsync_IsValidEmail_ReturnFailedCommand(string emailAddress)
    {
        //Arrange
        var service = GetBaseMailService();

        var email = new MailModel { ReceiverEmail = emailAddress };

        //Act
        var result = await service.SendMailAsync(email);

        //Assert
        Assert.False(result.IsSuccessful);
    }

    [Fact]
    public async Task SendMailAsync_ValidEmail_ReturnFailedCommand()
    {
        //Arrange
        var service = GetBaseMailService();
        var email = new MailModel { ReceiverEmail = "test@gmail.com", Subject = "Subject", Body = "body" };
        var smtp = Substitute.For<ISmtpClient>();
        smtp.Connect(Arg.Do<string>(x => x = "string"), Arg.Do<int>(x => x = 1), Arg.Do<bool>(x => x = true));
        //Act
        var result = await service.SendMailAsync(email);

        //Assert
        Assert.False(result.IsSuccessful);
    }

    #region Helpers

    private BaseMailService GetBaseMailService()
    {
        //var mailConfig = Substitute.For<IOptionsSnapshot<MailConfigs>>();
        //var config = new MailConfigs
        //{
        //    Enabled = true,
        //    SenderName = "sender name",
        //    SmtpServer = "smtp server",
        //    SmtpPort = 80,
        //    EnableSsl = true,
        //    MailPriority = 0,
        //    Password = "123456",
        //    Username = "username"
        //};

        //mailConfig.Value.Returns(config);
        //mailConfigs = Substitute.For<IOptionsSnapshot<MailConfigs>>();
        var edmSettings = new Dictionary<string, string> {
            {"MailConfigsForBroadcast:Enabled", "true"},
            {"MailConfigsForBroadcast:SenderName", "Saba Sports"},
            {"MailConfigsForBroadcast:SmtpServer", "SmtpServer"},
            {"MailConfigsForBroadcast:SmtpPort", "5"},
            {"MailConfigsForBroadcast:EnableSsl", "false"},
            {"MailConfigsForBroadcast:MailPriority", "0"},
            {"MailConfigsForBroadcast:Username", "Username"},
            {"MailConfigsForBroadcast:Password", "Password"},
            {"MailConfigsForBroadcast:MailFrom", "MailFrom"},
            {"MailConfigsForBroadcast:IsAuthenticate", "true"},

            {"MailConfigsForTransactional:Enabled", "true"},
            {"MailConfigsForTransactional:SenderName", "Saba Sports"},
            {"MailConfigsForTransactional:SmtpServer", "SmtpServer"},
            {"MailConfigsForTransactional:SmtpPort", "5"},
            {"MailConfigsForTransactional:EnableSsl", "false"},
            {"MailConfigsForTransactional:MailPriority", "0"},
            {"MailConfigsForTransactional:Username", "Username"},
            {"MailConfigsForTransactional:Password", "Password"},
            {"MailConfigsForTransactional:MailFrom", "MailFrom"},
            {"MailConfigsForTransactional:IsAuthenticate", "false"}
        };
        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(edmSettings)
            .Build();
        Substitute.For<ILogger<BaseMailService>>();
        logService = Substitute.For<ILogServiceProvider>();

        var service = new BaseMailService(configuration, logService);

        return service;
    }

    #endregion Helpers
}