namespace Anweshon.Api.Models
{
    public class OtpVerification
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Otp { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; } = false;
        public string Purpose { get; set; } = "Registration"; // Registration, PasswordReset
    }
}