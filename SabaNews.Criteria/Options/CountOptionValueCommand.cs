namespace SabaNews.Criteria.Options;

public class CountOptionValueCommand : BaseNonQueryCommand
{
    public string OptionKey { get; set; }

    public override string GetSettingKey() => "Options_CountValueKey";

    public override bool IsValid() => !string.IsNullOrEmpty(OptionKey);
}