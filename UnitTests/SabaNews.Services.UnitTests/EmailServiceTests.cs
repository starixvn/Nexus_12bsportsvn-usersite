namespace SabaNews.Services.UnitTests;

using AutoFixture;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Email;
using SabaNews.Models.Email;
using SabaNews.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class EmailServiceTests
{
    private IBaseService baseService;
    private IBaseMailService baseMailService;
    private IPathService pathService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task CreateEmailAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<EmailModel>();
        var expected = fixture.Create<CommandResult>();
        var criteria = new CreateEmailCriteria();
        baseService.ExecuteNonQueryAsync(Arg.Do<CreateEmailCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.CreateEmailAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model.EmailTitle, criteria.EmailTitle);
        Assert.Equal(model.EmailContent, criteria.EmailContent);
        Assert.Equal(model.EmbeddedLink, criteria.EmbeddedLink);
        Assert.Equal(model.CreatedBy, criteria.CreatedBy);
        Assert.Equal(model.Status, criteria.Status);
    }

    [Fact]
    public async Task CreateEmailDetailAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<EmailDetailModel>();
        var expected = fixture.Create<CommandResult>();
        var criteria = new CreateEmailDetailCriteria();
        baseService.ExecuteNonQueryAsync(Arg.Do<CreateEmailDetailCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.CreateEmailDetailAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model.EmailTitle, criteria.EmailTitle);
        Assert.Equal(model.EmailContent, criteria.EmailContent);
        Assert.Equal(model.EmailAddress, criteria.EmailAddress);
        Assert.Equal(model.EmailId, criteria.EmailId);
        Assert.Equal(model.Status, criteria.Status);
        Assert.Equal(model.UserId, criteria.UserId);
        Assert.Equal(model.TokenId, criteria.TokenId);
    }

    [Fact]
    public async Task GetEmailByUserAsync_WhenCalled_ReturnExpectedEmailModel()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<GetEmailByUserCriteria>();
        var expected = fixture.Create<IEnumerable<EmailModel>>();
        var criteria = new GetEmailByUserCriteria();
        baseService.GetDataAsync<EmailModel>(Arg.Do<GetEmailByUserCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetEmailByUserAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model, criteria);
    }

    [Fact]
    public async Task GetEmailsAsync_WhenCalled_ReturnExpectedEmailModel()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<GetEmailsCriteria>();
        var expected = fixture.Create< IEnumerable<EmailModel>>();
        var criteria = new GetEmailsCriteria();
        baseService.GetDataAsync<EmailModel>(Arg.Do<GetEmailsCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetEmailsAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model, criteria);
    }

    [Fact]
    public async Task FilterEmailDetailAsync_WhenCalled_ReturnExpectedEmailDetailModel()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<FilterEmailDetailCriteria>();
        var expected = fixture.Create<IEnumerable<EmailDetailModel>>();
        var criteria = new FilterEmailDetailCriteria();
        baseService.GetDataAsync<EmailDetailModel>(Arg.Do<FilterEmailDetailCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.FilterEmailDetailAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model, criteria);
    }

    [Fact]
    public async Task VerifyTokenEmailDetailAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<VerifyTokenEmailDetailCommand>();
        var expected = fixture.Create<CommandResult>();
        var criteria = new VerifyTokenEmailDetailCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<VerifyTokenEmailDetailCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.VerifyTokenEmailDetailAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model, criteria);
    }

    [Fact]
    public async Task UpdateEmailStatusAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<UpdateEmailStatusCommand>();
        var expected = fixture.Create<CommandResult>();
        var criteria = new UpdateEmailStatusCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateEmailStatusCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.UpdateEmailStatusAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model, criteria);
    }

    [Fact]
    public async Task GetEmailDetailAsync_WhenCalled_ReturnExpectedEmailDetailModel()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<GetDetailEmailDetailCriteria>();
        var expected = fixture.Create<EmailDetailModel>();
        var criteria = new GetDetailEmailDetailCriteria();
        baseService.GetDataEntityAsync<EmailDetailModel>(Arg.Do<GetDetailEmailDetailCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetEmailDetailAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model, criteria);
    }

    [Fact]
    public async Task GetEmailByIdAsync_WhenCalled_ReturnExpectedEmailModel()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<GetEmailByIdCriteria>();
        var expected = fixture.Create<EmailModel>();
        var criteria = new GetEmailByIdCriteria();
        baseService.GetDataEntityAsync<EmailModel>(Arg.Do<GetEmailByIdCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetEmailByIdAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model, criteria);
    }

    [Fact]
    public async Task UpdateStatusAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<UpdateStatusCommand>();
        var expected = fixture.Create<CommandResult>();
        var criteria = new UpdateStatusCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateStatusCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.UpdateStatusAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model, criteria);
           
    }

    [Fact]
    public async Task UpdateEmailAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<EmailModel>();
        var expected = fixture.Create<CommandResult>();
        var criteria = new UpdateEmailCommand();
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateEmailCommand>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.UpdateEmailAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model.Id, criteria._EmailId);
        Assert.Equal(model.EmailTitle, criteria.EmailTitle);
        Assert.Equal(model.EmailContent, criteria.EmailContent);
        Assert.Equal(model.EmbeddedLink, criteria.EmbeddedLink);
        Assert.Equal(model.Status, criteria.Status);
        Assert.Equal(model.CreatedBy, criteria.CreatedBy);

    }

    [Fact]
    public async Task UpdateEmailDetailAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var param = fixture.Create<UpdateEmailDetailCommand>();
        var expected = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<UpdateEmailDetailCommand>(x => param = x)).Returns(expected);
        //Act
        var actual = await service.UpdateEmailDetailAsync(param);

        //Assert
        Assert.Equal(expected, actual);

    }

    [Fact]
    public async Task GetEmailForSend_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetEmailService();
        var param = fixture.Create<GetEmailForSendCriteria>();
        var expected = fixture.Create<IEnumerable<EmailSendData>>();
        baseService.GetDataAsync<EmailSendData>(Arg.Do<GetEmailForSendCriteria>(x => param = x)).Returns(expected);
        //Act
        var actual = await service.GetEmailForSend(param);

        //Assert
        Assert.Equal(expected, actual);

    }

    [Fact]
    public async Task RemoveEmailDetailAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var param = fixture.Create<RemoveEmailDetailCommand>();
        var expected = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<RemoveEmailDetailCommand>(x => param = x)).Returns(expected);
        //Act
        var actual = await service.RemoveEmailDetailAsync(param);

        //Assert
        Assert.Equal(expected, actual);

    }



    [Fact]
    public async Task SendMailAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var subject = fixture.Create<string>();
        var body = fixture.Create<string>();
        var email = fixture.Create<string>();
        var model = fixture.Create<MailModel>();
        var expected = fixture.Create<CommandResult>();
        baseMailService.SendMailAsync(Arg.Do<MailModel>(x => model = x)).Returns(expected);
        //Act
        var actual = await service.SendEDMAsync(subject, body, email);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(subject, model.Subject);
        Assert.Equal(body, model.Body);
        Assert.Equal(email, model.ReceiverEmail);
    }

    [Fact]
    public async Task SendMailEDMWithTemplateAsync_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetEmailService();
        var model = fixture.Create<SendEDMModel>();
        var expected = fixture.Create<CommandResult>();
        var param = fixture.Create<MailModel>();
        baseMailService.SendMailAsync(Arg.Do<MailModel>(x => param = x)).Returns(expected);
        //Act
        var actual = await service.SendMailEDMWithTemplateAsync(model);

        //Assert
        Assert.Equal(expected, actual);
        Assert.Equal(model.EmailTitle, param.Subject);
        Assert.Equal(model.EmailAddress, param.ReceiverEmail);
    }


    #region Helpers
    private EmailService GetEmailService()
    {
        baseService = Substitute.For<IBaseService>();
        baseMailService = Substitute.For<IBaseMailService>();
        pathService = Substitute.For<IPathService>();
        var service = new EmailService(baseService, baseMailService, pathService);

        return service;
    }

    #endregion Helpers
}