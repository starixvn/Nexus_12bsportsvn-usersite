namespace SabaNews.Services;

using Microsoft.Extensions.Configuration;
using SabaNews.Core.Constants;
using SabaNews.Core.Helper;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria;
using SabaNews.Criteria.Category;
using SabaNews.Criteria.Posts;
using SabaNews.Models;
using SabaNews.Models.Categories;
using SabaNews.Models.Posts;
using System;
using System.Collections.Generic;
using SabaNews.Models.ViewModel.Posts;
using SabaNews.Resources;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Collections;
using SabaNews.Services.Interfaces;

public class PostService(
    IBaseService baseService,
    ISerializerService serializerService,
    IConfiguration configuration,
    IOptionService optionService)
    : IPostService
{
    public async Task<IEnumerable<Post>> GetPostsBySlugAsync(string slug, int start, int end, string postType = Constants.postType)
    {
        var criteria = new GetPostsBySlugCriteria
        {
            CategorySlug = slug?.Trim(),
            Start = start,
            End = end,
            PostType = postType
        };
        var posts = await baseService.GetDataAsync<Post>(criteria);
        return FormatData(posts).ToList();
    }

    public async Task<IEnumerable<Post>> GetPostsByCateSlugAsync(GetPostsByCateSlugCriteria criteria)
    {
        var posts = await baseService.GetDataAsync<Post>(criteria);
        return FormatData(posts).ToList();
    }

    public async Task<IEnumerable<Post>> GetVideoPostsBySlugAsync(GetVideoPostsBySlugCriteria criteria)
    {
        var posts = await baseService.GetDataAsync<Post>(criteria);
        return FormatData(posts).ToList();
    }

    public async Task<IEnumerable<Post>> GetPostsByCateSlugPagingAsync(GetPostsByCateSlugPagingCriteria criteria)
    {
        var posts = await baseService.GetDataAsync<Post>(criteria);
        return FormatData(posts).ToList();
    }

    public async Task<IEnumerable<Post>> GetPostsByCateSlugNotContainChidrenAsync(GetPostsByCateSlugNotContainChildrenCriteria criteria)
    {
        var posts = await baseService.GetDataAsync<Post>(criteria);
        return FormatData(posts).ToList();
    }

    public async Task<IEnumerable<Post>> GetRecentPostsAsync(GetRecentPostsParam postParam)
    {
        var criteria = new GetRecentPostsCriteria
        {
            Start = postParam.Start,
            End = postParam.End
        };
        var posts = await baseService.GetDataAsync<Post>(criteria);
        postParam.TotalIItems = criteria.TotalItems;
        return FormatData(posts).ToList();
    }

    public async Task<IEnumerable<Post>> GetTopPostsByCateSlugAsync(PostParam postParam)
    {
        var criteria = new GetTopPostsByCateSlugCriteria
        {
            CateSlug = postParam.Slug.Trim(),
            Start = postParam.Start,
            End = postParam.End,
            PostId = postParam.PostID
        };
        var posts = await baseService.GetDataAsync<Post>(criteria);

        return FormatData(posts).ToList();
    }

    public async Task<IEnumerable<Post>> GetMostViewPostsAsync(GetMostViewPostsCriteria criteria)
    {
        var posts = await baseService.GetDataAsync<Post>(criteria);

        return posts.ToList();
    }

    public async Task<Post> GetPostDetailBySlugAsync(string slug, string postType)
    {
        var criteria = new GetPostDetailBySlugCriteria
        {
            Slug = slug,
            PostType = postType
        };
        var post = await baseService.GetDataEntityAsync<Post>(criteria);
        if (post != null)  
        {
            if (string.IsNullOrEmpty(post.PostExcerpt))
            {
                var excerpt = Regex.Replace(post.PostContent, @"<[^>]+>|&nbsp;", "").Trim();
                var subTitle = excerpt.IndexOf("\n", StringComparison.OrdinalIgnoreCase);
                post.PostExcerpt = subTitle != -1 ? excerpt[..subTitle] : excerpt;
            }
            var metadata = serializerService.Unserializer(post.Metadata);
            post.Images = GetListImageFromMetadata(metadata, post.FeatureImage);
            post.CategoriesSlug ??= "";
            post.CatesName ??= "";
        }
        return post;
    }

    public async Task<Post> GetPostDetailAsync(long Id)
    {
        var criteria = new GetPostDetailByIdCriteria
        {
            PostId = Id
        };
        var post = await baseService.GetDataEntityAsync<Post>(criteria);
        return post;
    }

    public async Task<IEnumerable<Post>> SearchPostAsync(SearchPostsCriteria criteria)
    {
        if (string.IsNullOrEmpty(criteria._Keyword))
        {
            return null;
        }
        var posts = await baseService.GetDataAsync<Post>(criteria);

        return FormatData(posts).ToArray();
    }

    public async Task<IEnumerable<Post>> GetPostByTagAsync(GetPostsByTagCriteria criteria)
    {
        var posts = await baseService.GetDataAsync<Post>(criteria);
        return FormatData(posts).ToArray();
    }

    public async Task<IEnumerable<Post>> GetSavedPostsByUserID(string IDs)
    {
        var criteria = new GetPostsByIDsCriteria
        {
            IDs = IDs
        };
        var posts = await baseService.GetDataAsync<Post>(criteria);

        return FormatData(posts).ToArray();
    }

    public async Task<Category> GetCateDetailAsync(string slug)
    {
        var criteria = new GetCateDetailCriteria
        {
            Slug = slug
        };
        var cate = await baseService.GetDataEntityAsync<Category>(criteria);
        return ReplaceStringFromVarSeo(cate);
    }


    public async Task<Category> GetPageDetailBySlugAsync(string slug)
    {
        var criteria = new GetPageDetailBySlugCriteria
        {
            Slug = slug
        };
        var cate = await baseService.GetDataEntityAsync<Category>(criteria);
        return ReplaceStringFromVarSeo(cate);
    }

    public async Task<bool> CheckTypeCategoryAsync(string parentSlug, int ID)
    {
        var criteria = new CheckTypeCategoryCriteria
        {
            _Parent = parentSlug,
            _ID = ID
        };
        var cate = await baseService.GetDataEntityAsync<Category>(criteria);
        return cate != null;
    }

    public async Task<IEnumerable<Menu>> GetMenuAsync(string MenuName)
    {
        var criteria = new GetMenuCriteria
        {
            _Menu_name = MenuName
        };
        return await baseService.GetDataAsync<Menu>(criteria);
    }

    public async Task<IEnumerable<Post>> GetPostsByCateSlugs(GetPostsByCateSlugsCriteria criteria)
    {
        var result = await baseService.GetDataAsync<Post>(criteria);
        return FormatData(result).ToList();
    }

    public async Task<IEnumerable<Post>> GetPostsByCateSlugsPaging(GetPostsByCateSlugsPagingCriteria criteria)
    {
        var result = await baseService.GetDataAsync<Post>(criteria);
        return FormatData(result).ToList();
    }

    public async Task<IList<CategoryGeneral>> GetCateParentsAsync(string slug)
    {
        var result = await baseService.GetDataAsync<CategoryGeneral>(new GetCateParentsCriteria { Slug = slug });
        var cates = result.Reverse();
        return cates.ToList();
    }

    public async Task<IList<GetData>> GetPostlist(GetDataViewModel getData)
    {
        var dateTime = DateTimeOffset.UnixEpoch.DateTime;
        dateTime = dateTime.AddSeconds(getData.LastTimestamp).ToLocalTime();
        var criteria = new GetPostlistCriteria
        {
            _fromDate = dateTime,
            _Category = getData.Category,
            _Subject = getData.Subject,
            _startItem = getData.StartItem,
            _rowLimit = getData.RowLimit
        };
        var result = await baseService.GetDataAsync<GetData>(criteria);
        result.ToList().ForEach(x => x.FormatDate());
        return result.ToList();
    }

    public async Task<ApiPostDetailModel> GetPostDetailContent(GetDataViewModel getData)
    {
        var post = await baseService.GetDataEntityAsync<Post>(new GetPostDetailContentCriteria { _postId = getData.PostId });
        if(post == null)
        {
            return null;
        }
        var isVideo = CheckVideo(post.CategoriesSlug);
        var result = new ApiPostDetailModel
        {
            PostId = post.ID,
            Title = post.PostTitle,
            PublishDate = post.PostDateGMT.AddHours(8).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
            Subjects = post.CategoriesSlug != null ? HandleSubjects(post.CategoriesSlug) : null,
            Content = isVideo ? null : post.PostContent,
            SabaVideoContent = isVideo ? post.PostContent : null,
            EditorId = post.EditorId,
            Tags = post.Tags != null ? HandleTags(post.Tags) : null,
            Category = isVideo ? Constants.ApiVideoCategory : Constants.ApiArticleCategory,
            UrlSlug = $"{configuration.GetValue<string>("BaseUrl")}{post.PostName}-{post.ID}.html"
        };
        return result;
    }

    public async Task<List<long>> GetDeletedList(ApiDeleteListModel param)
    {
        var dateTime = DateTimeOffset.UnixEpoch.DateTime;
        dateTime = dateTime.AddSeconds(param.LastTimestamp).ToLocalTime();
        var criteria = new GetPostDeletedListCriteria
        {
            FromDate = dateTime
        };
        var result = await baseService.GetDataAsync<long>(criteria);
        return result.ToList();
    }

    public async Task<IEnumerable<Post>> GetPostsByAuthor(GetPostsByAuthorCriteria criteria)
    {
        var result = await baseService.GetDataAsync<Post>(criteria);
        return FormatData(result).ToList();
    }

    public async Task<Post> GetPostDetailSummaryAsync(string slug)
    {
        var criteria = new GetPostDetailSummaryCriteria { Slug = slug };
        return await baseService.GetDataEntityAsync<Post>(criteria);
    }

    public static IList<Subjects> HandleSubjects(string categoriesSlug)
    {
        var subjects = new List<Subjects>();
        var categories = categoriesSlug.Split([","], StringSplitOptions.None);
        foreach(var item in categories)
        {
            if(item == Constants.BasketballSlug || 
               item == Constants.BasketballVideoSlug)
            {
                subjects.Add(new Subjects { Id = Constants.IdBasketballEN, Name = ViewResources.BasketballEN });
            }
            if (item == Constants.TennisSlug ||
                item == Constants.TennisVideoSlug)
            {
                subjects.Add(new Subjects { Id = Constants.IdTennisEN, Name = ViewResources.TennisEN });
            }
            if (CheckSoccer(item))
            {
                subjects.Add(new Subjects { Id = Constants.IdSoccerEN, Name = ViewResources.SoccerEN });
            }
        }
        if(subjects.Count > 1)
        {
            subjects = [new Subjects { Id = Constants.IdAll, Name = ViewResources.All }];
        }
        return subjects;
    }

    public static bool CheckSoccer(string category)
    {
        const string search = Constants.FootballSlug + Constants.VideoFootballSlug +
                              Constants.Euro2020VideoSlug + Constants.VideoWorldCup2022Slug +
                              Constants.VideoGuessWorldCup2022Slug + Constants.VideoHighlightWorldCup2022Slug;
        if (search.Contains(category))
        {
            return true;
        }
        return false;
    }

    public static bool CheckVideo(string categoriesSlug)
    {
        var categories = categoriesSlug.Split([","], StringSplitOptions.None);
        foreach (var unused in categories.Where(cate => cate.Contains(Constants.VideoSlug)))
        {
            return true;
        }
        return false;
    }

    public static IList<string> HandleTags(string tags)
    {
        var result = new List<string>();
        var tagsList = tags.Split([", "], StringSplitOptions.None);
        tagsList.ToList().ForEach(x => result.Add(x));
        return result;
    }

    private IEnumerable<Post> FormatData(IEnumerable<Post> posts)
    {
        foreach (var post in posts.Where(item => string.IsNullOrEmpty(item.PostExcerpt)))
        {
            var excerpt = Regex.Replace(post.PostContent, @"<[^>]+>|&nbsp;", "").Trim();
            var subTitle = excerpt.IndexOf("\n", StringComparison.OrdinalIgnoreCase);
            post.PostExcerpt = subTitle != -1 ? excerpt[..subTitle] : excerpt;
        }
        return posts;
    }


    public async Task<IEnumerable<SitemapModel>> GetSitemapDataAsync()
    {
        var sitemap = await baseService.GetDataAsync<SitemapModel>(new GetSitemapDataCriteria());
        var posts = sitemap.Where(item => item.PostType != "category").ToList();
        var categories = sitemap.Where(item => item.PostType == "category").ToList();

        foreach (var item in posts)
        {
            item.Url = item.Slug;
        }
        posts.AddRange(SiteMap.Pages.Select(item => new SitemapModel { Url = item }));
        var cates = GetCategoriesSiteMap(categories);

        var newSiteMap = posts.Concat(cates);

        return newSiteMap;
    }

    public async Task<IEnumerable<NewsSitemapModel>> GetNewsSitemapDataAsync()
    {
        return await baseService.GetDataAsync<NewsSitemapModel>(new GetNewsSitemapCriteria());
    }

    public async Task<IEnumerable<Post>> GetRSSDataAsync()
    {
        var posts = await baseService.GetDataAsync<Post>(new GetRSSCriteria());
        return FormatData(posts);
    }

    public async Task<IEnumerable<Post>> GetRSSCategoryBySlugAsync(string slug)
    {
        return await baseService.GetDataAsync<Post>(new GetRSSCategoryCriteria { Slug = slug });
    }

    public async Task<IEnumerable<Post>> GetRSSRecentBySlugAsync()
    {
        return await baseService.GetDataAsync<Post>(new GetRSSRecentCriteria());
    }

    public async Task<CommandResult> UpdateVideoView(int postId)
    {
        var command = new UpdateVideoViewCommand
        {
            PostId = postId
        };

        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<CommandResult> UpdateViewAsync(int postId, bool isVideo)
    {
        var command = new UpdateViewCommand
        {
            PostId = postId,
            IsVideoPost = isVideo
        };

        return await baseService.ExecuteNonQueryAsync(command);
    }

    public async Task<SEOSettingModel> GetSeoSettingAsync()
    {
        var setting =  await optionService.GetOptionAsync(OptionKey.YoastSEOSetting);
        var hashObject = serializerService.Unserializer(setting?.OptionValue);
        var seoSetting = new SEOSettingModel
        {
            TagTitle =  hashObject == null ? "" : Helper.ReplaceStringFromVarSeo(hashObject["title-tax-post_tag"].ToString()),
            TagDescription =  hashObject == null ? "" : Helper.ReplaceStringFromVarSeo(hashObject["metadesc-tax-post_tag"].ToString())
        };
        return seoSetting;
    }

    public async Task<IList<Post>> GetSitemapPostsByDateAsync(DateTime date)
    {
        var result = await baseService.GetDataAsync<Post>(new GetSitemapPostsByDateCriteria { Date = date });
        return result.ToList();
    }

    public async Task<IList<Category>> GetAllTagAsync()
    {
        var result = await baseService.GetDataAsync<Category>(new GetAllTagsCriteria());
        return result.ToList();
    }

    public async Task<IList<Post>> GetPostsByIdsAsync(string ids, int limitItems)
    {
        var criteria = new GetPostsByJsonIdsCriteria
        {
            Ids = ids,
            LimitItem = limitItems
        };
        var posts = await baseService.GetDataAsync<Post>(criteria);

        return posts.ToList();
    }

    public async Task<List<int>> GetStickyPostsAsync()
    {
        var setting =  await optionService.GetOptionAsync(OptionKey.StickyPost);
        var hashObject = serializerService.UnserializerToArrayList(setting?.OptionValue);
        var ids = hashObject.Cast<int>().ToList();
        return ids;
    }

    private static List<SitemapModel> GetCategoriesSiteMap(IList<SitemapModel> categories)
    {
        var cateList = new List<SitemapModel>();
        foreach (var cate in categories)
        {
            cate.Url = cate.Slug + CategoryKey.Suffix;
            cateList.Add(cate);
        }
        return cateList.ToList();
    }

    private static IEnumerable<ImageInfo> GetListImageFromMetadata(Hashtable hashTable, string featuredImage)
    {
        var results = new List<ImageInfo>();
        try
        {
            if (hashTable.Contains("sizes"))
            {
                var sizes = hashTable["sizes"];
                var sizeHash = (Hashtable)sizes;
                var imageBaseUrl = string.Join("/", featuredImage.Split('/').SkipLast(1).ToArray());
                results = MappingHashTableToListImgInfo(imageBaseUrl, sizeHash);
            }
        }
        catch
        {
            return results;
        }
        return results;
    }

    private static List<ImageInfo> MappingHashTableToListImgInfo(string imageBaseUrl, Hashtable sizeHash)
    {
        var images = new List<ImageInfo>();
        if (sizeHash != null)
        {
#pragma warning disable S3267
            foreach (Hashtable item in sizeHash.Values)
            {
                if (IsValidKeys(item))
                {
                    images.Add(new ImageInfo
                    {
                        Width = int.Parse(item["width"].ToString()),
                        Height = int.Parse(item["height"].ToString()),
                        ImageType = item.ContainsKey("mime-type") ? (string)item["mime-type"] : string.Empty,
                        ImageUrl = $"{imageBaseUrl}/{(string)item["file"]}"
                    });
                }
            }
#pragma warning restore S3267
        }
        return images;
    }

    private static bool IsValidKeys(Hashtable item)
    {
        return item.ContainsKey("width") && item.ContainsKey("height") && item.ContainsKey("file");
    }

    private static Category ReplaceStringFromVarSeo(Category cate)
    {
        var now = DateTimeUtilize.UtcNow();
        const string dateFormat = "dd/MM/yyyy";
        if (cate == null)
        {
            return cate;
        }
        if (cate.SEOTitle != null)
        {
            var result = Regex.Replace(cate.SEOTitle, Constants.SepVar, Constants.Separate, RegexOptions.IgnoreCase);
            result =  Regex.Replace(result, Constants.SiteNameVar, Constants.SiteName, RegexOptions.IgnoreCase);
            cate.SEOTitle = Regex.Replace(result, Constants.CurrentDateVar, DateTimeUtilize.FormatDateTime(now, dateFormat), RegexOptions.IgnoreCase);
        }
        if (cate.Description != null)
        {
            var result = Regex.Replace(cate.Description, Constants.SepVar, Constants.Separate, RegexOptions.IgnoreCase);
            result = Regex.Replace(result, Constants.SiteNameVar, Constants.SiteName, RegexOptions.IgnoreCase);
            cate.Description = Regex.Replace(result, Constants.CurrentDateVar, DateTimeUtilize.FormatDateTime(now, dateFormat), RegexOptions.IgnoreCase);
        }
        if (cate.OgDescription != null)
        {
            var result = Regex.Replace(cate.OgDescription, Constants.SepVar, Constants.Separate, RegexOptions.IgnoreCase);
            result = Regex.Replace(result, Constants.SiteNameVar, Constants.SiteName, RegexOptions.IgnoreCase);
            cate.OgDescription = Regex.Replace(result, Constants.CurrentDateVar, DateTimeUtilize.FormatDateTime(now, dateFormat), RegexOptions.IgnoreCase);
        }
        if (cate.OgTitle != null)
        {
            var result = Regex.Replace(cate.OgTitle, Constants.SepVar, Constants.Separate, RegexOptions.IgnoreCase);
            result = Regex.Replace(result, Constants.SiteNameVar, Constants.SiteName, RegexOptions.IgnoreCase);
            cate.OgTitle = Regex.Replace(result, Constants.CurrentDateVar, DateTimeUtilize.FormatDateTime(now, dateFormat), RegexOptions.IgnoreCase);
        }

        return cate;
    }
}