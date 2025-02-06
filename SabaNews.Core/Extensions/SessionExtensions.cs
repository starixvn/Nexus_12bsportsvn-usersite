namespace SabaNews.Core.Extensions;

using System.Text;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

public static class SessionExtensions
{
    public static void SetObject<T>(this ISession session, string key, T value)
    {
        session.Set(key, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(value)));
    }

    public static T Get<T>(this ISession session, string key)
    {
        session.TryGetValue(key, out var value);
        return value == null ? default : JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(value));
    }
}