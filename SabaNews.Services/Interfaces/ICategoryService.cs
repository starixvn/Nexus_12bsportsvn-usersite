namespace SabaNews.Services.Interfaces;

using System.Collections.Generic;
using System.Threading.Tasks;
using SabaNews.Core.Models;
using SabaNews.Criteria.Category;
using SabaNews.Models.Categories;

public interface ICategoryService
{
    Task<IList<CateLivescore>> GetCateLivescoreAsync();

    Task<CommandResult> UpdateCateLivescoreAsync(UpdateCateLivescoreCommand cmd);
}