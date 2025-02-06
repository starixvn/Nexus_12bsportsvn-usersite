namespace SabaNews.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SabaNews.Core.Services;
using SabaNews.Criteria.Posts;
using SabaNews.Models.Posts;
using SabaNews.Services.Interfaces;

public class StatisticService(IBaseService baseService) : IStatisticService
{
    public async Task<IEnumerable<PostStatisticInfo>> GetPostViewStatistic(DateTime fromDate, DateTime toDate)
    {
        var criteria = new GetPostViewStatiscticCriteria
        {
            FromDate = fromDate,
            ToDate = toDate
        };

        var postStatistics = await baseService.GetDataAsync<PostStatisticInfo>(criteria);

        var results = FillBlankDateStatistic(fromDate, toDate, postStatistics);
        return results;
    }

    private static IEnumerable<PostStatisticInfo> FillBlankDateStatistic(DateTime fromDate, DateTime toDate, IEnumerable<PostStatisticInfo> postStatistics)
    {
        var result = new List<PostStatisticInfo>();
        var totalDays = (toDate - fromDate).TotalDays + 1;
        for (double i = 0; i < totalDays; i++)
        {
            if (postStatistics.Any(s => s.PostDate.Date == fromDate.Date))
            {
                var item = postStatistics.FirstOrDefault(info => info.PostDate.Date == fromDate.Date);
                result.Add(item);
            }
            else
            {
                var filledItem = new PostStatisticInfo
                {
                    PostDate = fromDate
                };
                result.Add(filledItem);
            }
            fromDate = fromDate.AddDays(1);
        }

        return result.OrderBy(x => x.PostDate);
    }

    public async Task<ValueTuple<IEnumerable<ViewDetails>, int, int>> GetPostViewDetails(DateTime createdDate,
        bool isVideo,
        int pageIndex,
        int pageSize,
        string viewSortType,
        string authorSortType)
    {
        var criteria = new GetViewDetailOnDateCriteria
        {
            CreatedDate = createdDate,
            IsVideo = isVideo,
            ViewSortType = viewSortType,
            PageIndex = pageIndex,
            PageSize = pageSize,
            AuthorSortType = authorSortType
        };

        var details = await baseService.GetDataAsync<ViewDetails>(criteria);

        return (details, criteria.TotalItems, criteria.TotalViews);
    }
}