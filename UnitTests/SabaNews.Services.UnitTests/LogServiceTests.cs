namespace SabaNews.Services.UnitTests;

using AutoFixture;
using NSubstitute;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Logs;
using System.Threading.Tasks;
using Xunit;

public class LogServiceTests
{
    private IBaseService baseService;
    private readonly IFixture fixture = new Fixture();
    [Fact]
    public async Task WriteLog_WhenCalled_ReturnExpectedCommandResult()
    {
        //Arrange
        var service = GetLogService();
        var param = fixture.Create<WriteLogCommand>();

        var expected = fixture.Create<CommandResult>();
        baseService.ExecuteNonQueryAsync(Arg.Do<WriteLogCommand>(x => param = x)).Returns(expected);

        //Act
        var actual = await service.WriteLog(param);

        //Assert
        Assert.Equal(expected, actual);
    }

    #region Helpers
    private LogService GetLogService()
    {
        baseService = Substitute.For<IBaseService>();
        var service = new LogService(baseService);

        return service;
    }
    #endregion Helpers
}