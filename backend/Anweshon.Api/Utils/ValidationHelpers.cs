using System.Text.RegularExpressions;

namespace Anweshon.Api.Utils
{
    public static class ValidationHelpers
    {
        private static readonly Regex EmailRegex =
            new(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled);

        private static readonly Regex BdPhoneRegex =
            new(@"^01\d{9}$", RegexOptions.Compiled); // 11 digits, starts with 01

        private static readonly Regex StudentIdRegex =
            new(@"^\d{7}$", RegexOptions.Compiled); // 7 digits

        public static bool IsValidEmail(string? email) =>
            !string.IsNullOrWhiteSpace(email) && EmailRegex.IsMatch(email);

        public static bool IsValidBdPhone(string? phone) =>
            !string.IsNullOrWhiteSpace(phone) && BdPhoneRegex.IsMatch(phone);

        public static bool IsValidStudentId(string? studentId) =>
            !string.IsNullOrWhiteSpace(studentId) && StudentIdRegex.IsMatch(studentId);
    }
}
