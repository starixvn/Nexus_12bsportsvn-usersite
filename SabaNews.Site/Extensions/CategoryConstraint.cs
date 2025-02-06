namespace SabaNews.Site.Extensions;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using SabaNews.Core.Constants;

public class CategoryConstraint : IRouteConstraint
{
    public bool Match(HttpContext httpContext, IRouter route, string routeKey, RouteValueDictionary values,  RouteDirection routeDirection)
    {
        var slug = values[routeKey].ToString();
        return slug.EndsWith(CategoryKey.Suffix);
    }
}