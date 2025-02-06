namespace SabaNews.Services;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SabaNews.Core.Models;
using SabaNews.Core.Services;
using SabaNews.Criteria.Category;
using SabaNews.Models.Categories;
using SabaNews.Services.Interfaces;

public class CategoryService(IBaseService baseService) : ICategoryService
{
    public async Task<IList<CateLivescore>> GetCateLivescoreAsync()
    {
        var result =  await baseService.GetDataAsync<CateLivescore>(new GetCateLivescoreCriteria());
        return result.ToList();
    }

    public async Task<CommandResult> UpdateCateLivescoreAsync(UpdateCateLivescoreCommand cmd)
    {
        return await baseService.ExecuteNonQueryAsync(cmd);
    }
}