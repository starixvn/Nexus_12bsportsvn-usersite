namespace SabaNews.Criteria.Banner;

public class UpdateBannerInfoCommand : BaseNonQueryCommand
{
    public int ActorId { get; set; }

    public string MobileCenterUrl { get; set; }

    public string MobileCenterNavigationUrl { get; set; }

    public string DesktopTopNavigationUrl { get; set; }

    public string DesktopTopUrl { get; set; }

    public string MobileTopUrl { get; set; }

    public string MobileTopNavigationUrl { get; set; }

    public string DesktopCenterUrl { get; set; }

    public string DesktopCenterNavigationUrl { get; set; }

    public string DesktopLeftUrl { get; set; }

    public string DesktopLeftNavigationUrl { get; set; }

    public string DesktopRightUrl { get; set; }

    public string DesktopRightNavigationUrl { get; set; }

    public string MobileBottomUrl { get; set; }

    public string MobileBottomNavigationUrl { get; set; }

    public override string GetSettingKey() => "banner_update";

    public override bool IsValid() => true;
}