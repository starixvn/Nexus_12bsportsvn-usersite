namespace SabaNews.Models.ViewModel.Euro2020;

using System;
using Microsoft.AspNetCore.Http;

public class CreatTeamModel
{
    public long TeamId { get; set; }
    public string PlayerName { get; set; }
    public string PlayerFullName { get; set; }
    public DateTime Birthday { get; set; }
    public string ShirtNumber { get; set; }
    public string Club { get; set; }
    public int Position { get; set; }
    public IFormFile Icon { get; set; }
}