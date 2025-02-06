namespace SabaNews.Site.Extensions;

using DeviceDetectorNET;
public static class DeviceHelper
{
    public static bool IsMobile(string userAgent)
    {
        bool isMobile;
        try
        {
            var detector = new DeviceDetector(userAgent);
            detector.Parse();
            isMobile = detector.IsMobile();
        }
        catch (System.Exception)
        {
            isMobile = true;
        }
            
        return isMobile;
    }
}