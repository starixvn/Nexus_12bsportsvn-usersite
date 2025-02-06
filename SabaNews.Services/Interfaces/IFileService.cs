namespace SabaNews.Services.Interfaces;

using Microsoft.AspNetCore.Http;
using SabaNews.Core.Models;
using System.Threading.Tasks;

public interface IFileService
{
    Task<UploadResult> UploadFileAsync(IFormFile file, string dirFolder);
    UploadResult DeleteFile(string url, string dirFolder);
}