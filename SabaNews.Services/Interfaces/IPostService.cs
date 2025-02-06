namespace SabaNews.Services.Interfaces;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Models.ViewModel.Posts;
using SabaNews.Core.Constants;
using SabaNews.Core.Models;
using SabaNews.Criteria.Posts;
using SabaNews.Models;
using SabaNews.Models.Categories;
using SabaNews.Models.Posts;

public interface IPostService
{
    Task<IEnumerable<Post>> GetPostsBySlugAsync(string slug, int start, int end, string postType = Constants.postType);

    Task<IEnumerable<Post>> GetPostsByCateSlugAsync(GetPostsByCateSlugCriteria criteria);
    Task<IEnumerable<Post>> GetVideoPostsBySlugAsync(GetVideoPostsBySlugCriteria criteria);

    Task<IEnumerable<Post>> GetPostsByCateSlugPagingAsync(GetPostsByCateSlugPagingCriteria criteria);

    Task<IEnumerable<Post>> GetPostsByCateSlugNotContainChidrenAsync(GetPostsByCateSlugNotContainChildrenCriteria criteria);

    Task<IEnumerable<Post>> GetRecentPostsAsync(GetRecentPostsParam postParam);

    Task<IEnumerable<Post>> GetTopPostsByCateSlugAsync(PostParam postParam);

    Task<IEnumerable<Post>> GetMostViewPostsAsync(GetMostViewPostsCriteria criteria);

    Task<Post> GetPostDetailBySlugAsync(string slug, string postType);

    Task<Post> GetPostDetailAsync(long Id);

    Task<IEnumerable<Post>> SearchPostAsync(SearchPostsCriteria criteria);

    Task<IEnumerable<Post>> GetPostByTagAsync(GetPostsByTagCriteria criteria);

    Task<IEnumerable<Post>> GetSavedPostsByUserID(string IDs);

    Task<IEnumerable<Menu>> GetMenuAsync(string MenuName);

    Task<Category> GetCateDetailAsync(string slug);

    Task<Category> GetPageDetailBySlugAsync(string slug);

    Task<bool> CheckTypeCategoryAsync(string parentSlug, int ID);

    Task<IEnumerable<SitemapModel>> GetSitemapDataAsync();

    Task<IEnumerable<NewsSitemapModel>> GetNewsSitemapDataAsync();

    Task<IEnumerable<Post>> GetRSSDataAsync();

    Task<CommandResult> UpdateVideoView(int postId);

    Task<CommandResult> UpdateViewAsync(int postId, bool isVideo);

    Task<IEnumerable<Post>> GetPostsByCateSlugs(GetPostsByCateSlugsCriteria criteria);

    Task<IEnumerable<Post>> GetPostsByCateSlugsPaging(GetPostsByCateSlugsPagingCriteria criteria);
    Task<IList<GetData>> GetPostlist(GetDataViewModel getData);
    Task<ApiPostDetailModel> GetPostDetailContent(GetDataViewModel getData);
    Task<List<long>> GetDeletedList(ApiDeleteListModel param);

    Task<IList<CategoryGeneral>> GetCateParentsAsync(string slug);

    Task<IEnumerable<Post>> GetPostsByAuthor(GetPostsByAuthorCriteria criteria);

    Task<IEnumerable<Post>> GetRSSCategoryBySlugAsync(string slug);

    Task<IEnumerable<Post>> GetRSSRecentBySlugAsync();

    Task<SEOSettingModel> GetSeoSettingAsync();

    Task<IList<Post>> GetSitemapPostsByDateAsync(DateTime date);

    Task<IList<Category>> GetAllTagAsync();
    Task<Post> GetPostDetailSummaryAsync(string slug);

    Task<IList<Post>> GetPostsByIdsAsync(string ids, int limitItems);

    Task<List<int>> GetStickyPostsAsync();

}