namespace SabaNews.Services;

using System;
using System.Collections;
using System.Globalization;
using System.Text;

public interface ISerializerService
{
    Hashtable Unserializer(string metadata);

    ArrayList UnserializerToArrayList(string metadata);
}

public class SerializerService : ISerializerService
{
    private int pos;
    private readonly Encoding stringEncoding = new UTF8Encoding();
    private readonly NumberFormatInfo nfi = new()
    {
        NumberGroupSeparator = "",
        NumberDecimalSeparator = "."
    };
    private const short TwoCharacters = 2;
    private const short ThreeCharacters = 3;
    private const short FourCharacters = 4;
    private const short SixCharacters = 6;

    public Hashtable Unserializer(string metadata)
    {
        Hashtable results = null;
        if (string.IsNullOrWhiteSpace(metadata))
        {
            return results;
        }

        try
        {
            pos = 0;
            var decryptedData = DeserializeString(metadata);

            results = (Hashtable)decryptedData;
            return results;
        }
        catch
        {
            return results;
        }
    }

    public ArrayList UnserializerToArrayList(string metadata)
    {
        var results = new ArrayList();
        if (string.IsNullOrWhiteSpace(metadata))
        {
            return results;
        }

        try
        {
            pos = 0;
            var decryptedData = DeserializeString(metadata);

            results = (ArrayList)decryptedData;
            return results;
        }
        catch
        {
            return results;
        }
    }


    public object DeserializeString(string str)
    {
        if (str == null || str.Length <= pos)
        {
            return new object();
        }

        int start;
        int end;
        int length;
        string stLen;
        switch (str[pos])
        {
            case 'N':
                pos += TwoCharacters;
                return null;

            case 'b':
                var chBool = str[pos + TwoCharacters];
                pos += FourCharacters;
                return chBool == '1';

            case 'i':
                start = str.IndexOf(":", pos, StringComparison.OrdinalIgnoreCase) + 1;
                end = str.IndexOf(";", start, StringComparison.OrdinalIgnoreCase);
                var stInt = str.Substring(start, end - start);
                pos += ThreeCharacters + stInt.Length;
                return int.Parse(stInt, nfi);

            case 'd':
                start = str.IndexOf(":", pos, StringComparison.OrdinalIgnoreCase) + 1;
                end = str.IndexOf(";", start, StringComparison.OrdinalIgnoreCase);
                var stDouble = str.Substring(start, end - start);
                pos += ThreeCharacters + stDouble.Length;
                return double.Parse(stDouble, nfi);

            case 's':
                start = str.IndexOf(":", pos, StringComparison.OrdinalIgnoreCase) + 1;
                end = str.IndexOf(":", start, StringComparison.OrdinalIgnoreCase);
                stLen = str[start..end];
                var bytelen = int.Parse(stLen);
                length = bytelen;

                return HandleTypeString(str, stLen, end, length, bytelen);

            case 'a':
                start = str.IndexOf(":", pos, StringComparison.OrdinalIgnoreCase) + 1;
                end = str.IndexOf(":", start, StringComparison.OrdinalIgnoreCase);
                stLen = str.Substring(start, end - start);
                length = int.Parse(stLen);

                return HandleArrayType(str, stLen, length);

            default:
                return string.Empty;
        }
    }

    private string HandleTypeString(string str, string stLen, int end, int length, int bytelen)
    {
        if (end + TwoCharacters + length >= str.Length)
        {
            length = str.Length - TwoCharacters - end;
        }

        var stRet = str.Substring(end + TwoCharacters, length);
        while (stringEncoding.GetByteCount(stRet) > bytelen)
        {
            length--;
            stRet = str.Substring(end + TwoCharacters, length);
        }
        pos += SixCharacters + stLen.Length + length;
        stRet = stRet.Replace("\n", "\r\n");
        return stRet;
    }

    private object HandleArrayType(string str, string stLen, int length)
    {
        var htRet = new Hashtable(length);
        var alRet = new ArrayList(length);
        pos += FourCharacters + stLen.Length;
        for (var i = 0; i < length; i++)
        {
            var key = DeserializeString(str);
            var val = DeserializeString(str);

            if (alRet != null)
            {
                if (key is int key1 && key1 == alRet.Count)
                {
                    alRet.Add(val);
                }
                else
                {
                    alRet = null;
                }
            }
            htRet[key] = val;
        }
        pos++;

        if (pos < str.Length && str[pos] == ';')
        {
            pos++;
        }

        return alRet ?? (object)htRet;
    }
}