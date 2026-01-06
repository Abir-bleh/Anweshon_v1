namespace Anweshon.Api.Dtos
{
    public class RegisterDto
    {
        public string FullName { get; set; } = null!;
        public string StudentId { get; set; } = null!;
        public string Department { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!; // NEW
        public string Password { get; set; } = null!;
        public string Role { get; set; } = "Student";
    }

    public class LoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
    public class SendOtpDto
{
    public string Email { get; set; } = default!;
}

public class VerifyOtpDto
{
    public string Email { get; set; } = default!;
    public string Otp { get; set; } = default!;
    public string Purpose { get; set; } = "Registration"; // Registration or PasswordReset
}

public class ForgotPasswordDto
{
    public string Email { get; set; } = default!;
}

public class ResetPasswordDto
{
    public string Email { get; set; } = default!;
    public string Otp { get; set; } = default!;
    public string NewPassword { get; set; } = default!;
}

public class UpdateUserProfileDto
{
    public string? FullName { get; set; }
    public string? StudentId { get; set; }
    public string? Department { get; set; }
    public string? PhoneNumber { get; set; }
}

public class ChangePasswordDto
{
    public string CurrentPassword { get; set; } = default!;
    public string NewPassword { get; set; } = default!;
}
}
