namespace SabaNews.Criteria.User;

public class UpdateUserInfoCommand : BaseNonQueryCommand
{
    public int UserID { get; set; }
    public string _name { get; set; }
    public string _password { get; set; }
    public string _phone { get; set; }
    public string _gender { get; set; }
    public string _photo { get; set; }
    public string _yearOfBirth { get; set; }
    public int _isSubscribe { get; set; }

    public override string GetSettingKey() => "user_update_info";

    public override bool IsValid() => UserID > 0;
}