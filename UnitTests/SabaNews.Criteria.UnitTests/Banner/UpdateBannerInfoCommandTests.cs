using SabaNews.Criteria.Banner;
using Xunit;

namespace SabaNews.Criteria.UnitTests.Banner;

public class UpdateBannerInfoCommandTests
{
    [Fact]
    public void GetSettingKey_WhenCalled_ReturnExpectedSettingKey()
    {
        // Arrange
        var criteria = new UpdateBannerInfoCommand();
        var expected = "banner_update";

        // Act
        var actual = criteria.GetSettingKey();

        // Assert
        Assert.Equal(expected, actual);
    }

       


    [Fact]
    public void IsValid_WhenCalled_ReturnTrue()
    {
        // Arrange
        var criteria = new UpdateBannerInfoCommand
        {
            DesktopTopNavigationUrl = "url",
            DesktopCenterNavigationUrl = "url",
            DesktopCenterUrl = "url",
            DesktopLeftNavigationUrl = "url",
            DesktopLeftUrl = "url",
            DesktopRightNavigationUrl = "url",
            DesktopRightUrl = "url",
            DesktopTopUrl = "url",
            MobileCenterUrl = "url",
            MobileCenterNavigationUrl = "url",
            MobileTopNavigationUrl = "url",
            MobileTopUrl = "url",
            MobileBottomUrl = "url",
            MobileBottomNavigationUrl = "url",
            ActorId = 1

        };

        // Act
        var actual = criteria.IsValid();

        // Assert
        Assert.True(actual);
    }
}