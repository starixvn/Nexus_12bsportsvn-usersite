namespace SabaNews.Services.Interfaces;

public interface IPathService
{
    string MapPath(string path);

    string MapPathContentRoot(string path);

    string MapFullPath(string path);

    string MapAbsoluteRootPath(string path);

    string EnsureCorrectFilename(string filename);
}