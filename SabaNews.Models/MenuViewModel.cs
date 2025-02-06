namespace SabaNews.Models;

using System.Collections.Generic;
using SabaNews.Core.Models;
using SabaNews.Models.Banner;
using SabaNews.Models.Categories;
using SabaNews.Models.Posts;

public class MenuViewModel
{
    public IEnumerable<Menu> Menus { get; set; }
    public IEnumerable<Menu> DetailMenu { get; set; }
    public Menu PopularKeyword { get; set; }
    public UserSession User { get; set; }
    public BannerModel Banner { get; set; }
    public string UserUgent { get; set; }
    public bool IsAuthenticated { get; set; }
    public string Page { get; set; }
    public string CategorySlug { get; set; }
    public bool IsAdmin { get; set; }
    public Slugs Slugs { get; set; }
    public MenuItems MenuItems { get; set; }
}