namespace SabaNews.Services.UnitTests;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using SabaNews.Services.Interfaces;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

public class FileServiceTests
{
    private IPathService pathService;
    private IConfiguration configuration;

    [Fact]
    public async Task UploadFileAsync_WhenCalled_ReturnExpectedData()
    {
        // Arrange
        var service = GetFileService();
        var content = "Hello World from a Fake File";
        var fileName = "test.pdf";
        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        using var headerValue = new MultipartFormDataContent();
        headerValue.Headers.Add("Content-Disposition", "form-data; name=\"json\"");
        writer.Write(content);
        writer.Flush();
        stream.Position = 0;
        var header = new HeaderDictionary { { "Name", new string[] { "Value" } } };
        IFormFile file = new FormFile(stream, 0, stream.Length, "id_from_form", fileName)
        {
            Headers = header,
            ContentType = "application/pdf"
        };
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Headers.Add("Content-Type", "multipart/form-data");
        var enviroment = System.Environment.CurrentDirectory;
        var projectDirectory = Directory.GetParent(enviroment).Parent.FullName;
        var UnitTestDirectory = projectDirectory.Replace("\\bin", "");
        var directorty = "FilesTest";
        var filePath = Path.Combine(UnitTestDirectory, directorty);
        pathService.MapAbsoluteRootPath(Arg.Do<string>(x => x = directorty)).Returns(filePath);
        //Act
        await service.UploadFileAsync(file, directorty);

    }
    #region Helpers
    private FileService GetFileService()
    {
        configuration = Substitute.For<IConfiguration>();
        pathService = Substitute.For<IPathService>();
        var service = new FileService(pathService, configuration);

        return service;
    }
    #endregion Helpers
}