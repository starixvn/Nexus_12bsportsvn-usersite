namespace SabaNews.Core.Models;

using System;
using System.Collections.Generic;
using Newtonsoft.Json;

public class UserSession
{
    public int Id { get; set; }

    public string Email { get; set; }

    public string Name { get; set; }

    public string Password { get; set; }

    public string Phone { get; set; }

    public string Gender { get; set; }

    public string Photo { get; set; }

    public bool EmailConfirmed { get; set; }

    public string LoginType { get; set; }

    public string SavedPosts { get; set; }

    public string Metadata { get; set; }

    public string YearOfBirth { get; set;}

    public DateTime RegisterDate { get; set; }

    public string Role => Metadata != null && Metadata.Contains(Core.Constants.Role.Administrator) ? Core.Constants.Role.Administrator : Core.Constants.Role.Customer;

    public bool ErrorConnectWrongEmail { get; set; }

    public int IsSubscribe { get; set; } = 1;

    private List<SavePost> ListSavedPosts { get; set; }

    public List<SavePost> HandleSavePosts
    {
        get
        {
            var arrSavedPosts = new List<SavePost>();
            if (SavedPosts == null)
            {
                return arrSavedPosts;
            }
            arrSavedPosts = JsonConvert.DeserializeObject<List<SavePost>>(SavedPosts);
            return arrSavedPosts;
        }
        set => ListSavedPosts = value;
    }
}