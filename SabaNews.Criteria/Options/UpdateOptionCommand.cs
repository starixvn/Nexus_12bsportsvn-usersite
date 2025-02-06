namespace SabaNews.Criteria.Options;

public class UpdateOptionCommand : BaseNonQueryCommand
{
    public string OptionKey { get; set; }

    public string OptionValue { get; set; }

    public long ActorId { get; set;}

    public override string GetSettingKey() => "Options_UpdateKey";

    public override bool IsValid() => !string.IsNullOrEmpty(OptionKey) ;
}