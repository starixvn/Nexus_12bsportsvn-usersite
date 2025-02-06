namespace SabaNews.Services.UnitTests;

using AutoFixture;
using NSubstitute;
using SabaNews.Core.Services;
using SabaNews.Criteria.Posts;
using SabaNews.Models.Posts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

public class StatisticServiceTests
{
    private IBaseService baseService;
    private readonly IFixture fixture = new Fixture();

    [Fact]
    public async Task GetPostViewStatistic_WhenCalled_ReturnExpectedPostStatisticInfo()
    {
        //Arrange
        var service = GetStatisticServic();
        var fromDate =  new DateTime(2021, 11, 21);
        var toDate = new DateTime(2021, 11, 22);
        var criteria = fixture.Create<GetPostViewStatiscticCriteria>();
        var expected = GetPostStatisticInfo();
                
        baseService.GetDataAsync<PostStatisticInfo>(Arg.Do<GetPostViewStatiscticCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetPostViewStatistic(fromDate, toDate);

        //Assert
        Assert.Equal(fromDate, actual.First().PostDate);
    }

    [Fact]
    public async Task GetPostViewDetails_WhenCalled_ReturnExpectedData()
    {
        //Arrange
        var service = GetStatisticServic();
        var createdDate = fixture.Create<DateTime>();
        var isVideo = fixture.Create<bool>();
        var pageSize = fixture.Create<int>();
        var pageIndex = fixture.Create<int>();
        var viewSortType = fixture.Create<string>();
        var authorSortType = fixture.Create<string>();
        var criteria = fixture.Create<GetViewDetailOnDateCriteria>();
        var expected = fixture.Create<IEnumerable<ViewDetails>>();

        baseService.GetDataAsync<ViewDetails>(Arg.Do<GetViewDetailOnDateCriteria>(x => criteria = x)).Returns(expected);
        //Act
        var actual = await service.GetPostViewDetails(createdDate, isVideo, pageIndex, pageSize, viewSortType, authorSortType);

        //Assert
        Assert.Equal(expected, actual.Item1);
        Assert.Equal(criteria.TotalItems, actual.Item2);
        Assert.Equal(criteria.TotalViews, actual.Item3);
    }



    private static IEnumerable<PostStatisticInfo> GetPostStatisticInfo()
    {
        var expected = new List<PostStatisticInfo>
        {
            new() { PostDate = new DateTime(2021, 11, 22), PostCount = 1, PostView = 2, VideoCount = 3, VideoView = 4 },
            new() { PostDate = new DateTime(2021, 11, 23), PostCount = 1, PostView = 2, VideoCount = 3, VideoView = 4 }
        };
        return expected.OrderBy(x => x.PostDate);
    }
        
    #region Helpers
    private StatisticService GetStatisticServic()
    {
        baseService = Substitute.For<IBaseService>();
        var service = new StatisticService(baseService);

        return service;
    }
    #endregion Helpers
}