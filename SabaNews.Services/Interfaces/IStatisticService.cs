namespace SabaNews.Services.Interfaces;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SabaNews.Models.Posts;

public interface IStatisticService
{
    Task<IEnumerable<PostStatisticInfo>> GetPostViewStatistic(DateTime fromDate, DateTime toDate);

    Task<ValueTuple<IEnumerable<ViewDetails>, int, int>> GetPostViewDetails(DateTime createdDate,
        bool isVideo,
        int pageIndex,
        int pageSize,
        string viewSortType,
        string authorSortType);
}