using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Anweshon.Api.Dtos;
using Anweshon.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Anweshon.Api.Utils;
using Anweshon.Api.Services;
using Microsoft.EntityFrameworkCore;
using Anweshon.Api.Data;

namespace Anweshon.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        private readonly IEmailService _emailService;
private readonly ApplicationDbContext _context;

        

        public AuthController(
    UserManager<ApplicationUser> userManager,
    RoleManager<IdentityRole> roleManager,
    IConfiguration configuration,
    IEmailService emailService,
    ApplicationDbContext context)
{
    _userManager = userManager;
    _roleManager = roleManager;
    _configuration = configuration;
    _emailService = emailService;
    _context = context;
}

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var errors = new Dictionary<string, string>();

    if (string.IsNullOrWhiteSpace(dto.FullName) || dto.FullName.Length < 3)
        errors["fullName"] = "Full name must be at least 3 characters.";

    if (!ValidationHelpers.IsValidEmail(dto.Email))
        errors["email"] = "Enter a valid email address.";

    if (!ValidationHelpers.IsValidBdPhone(dto.Phone))
        errors["phone"] = "Enter an 11-digit BD phone number starting with 01.";

    if (!ValidationHelpers.IsValidStudentId(dto.StudentId))
        errors["studentId"] = "Student ID must be exactly 7 digits.";

    if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 8)
        errors["password"] = "Password must be at least 8 characters.";

    if (errors.Count > 0)
        return BadRequest(new { errors });
            var existing = await _userManager.FindByEmailAsync(dto.Email);
            if (existing != null)
                return BadRequest("Email already in use.");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                StudentId = dto.StudentId,
                Department = dto.Department,
                PhoneNumber = dto.Phone
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Ensure role exists then assign
            if (!await _roleManager.RoleExistsAsync(dto.Role))
            {
                await _roleManager.CreateAsync(new IdentityRole(dto.Role));
            }

            await _userManager.AddToRoleAsync(user, dto.Role);

            return Ok("Registration successful.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized("Invalid credentials.");

            if (!await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Invalid credentials.");

            var roles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim("fullName", user.FullName ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var authSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                expires: DateTime.UtcNow.AddHours(6),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                userId = user.Id,
                roles
            });
        }

        // Add this field at the top of the class with other dependencies


// Update constructor to include these:


// NEW: Send OTP for registration
[HttpPost("send-registration-otp")]
public async Task<IActionResult> SendRegistrationOtp([FromBody] SendOtpDto dto)
{
    if (!ValidationHelpers.IsValidEmail(dto.Email))
        return BadRequest("Invalid email address.");

    var existing = await _userManager.FindByEmailAsync(dto.Email);
    if (existing != null)
        return BadRequest("Email already in use.");

    // Generate 6-digit OTP
    var otp = new Random().Next(100000, 999999).ToString();

    // Save OTP to database
    var otpRecord = new OtpVerification
    {
        Email = dto.Email,
        Otp = otp,
        ExpiresAt = DateTime.UtcNow.AddMinutes(10),
        Purpose = "Registration"
    };

    _context.OtpVerifications.Add(otpRecord);
    await _context.SaveChangesAsync();

    // Send email
    await _emailService.SendOtpEmailAsync(dto.Email, otp);

    return Ok(new { message = "OTP sent to your email" });
}

// NEW: Verify OTP
[HttpPost("verify-otp")]
public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
{
    var otpRecord = await _context.OtpVerifications
        .Where(o => o.Email == dto.Email && 
                   o.Otp == dto.Otp && 
                   o.Purpose == dto.Purpose &&
                   !o.IsUsed &&
                   o.ExpiresAt > DateTime.UtcNow)
        .FirstOrDefaultAsync();

    if (otpRecord == null)
        return BadRequest("Invalid or expired OTP");

    otpRecord.IsUsed = true;
    await _context.SaveChangesAsync();

    return Ok(new { message = "OTP verified successfully" });
}

// NEW: Register with OTP (after OTP verification)
[HttpPost("register-with-otp")]
public async Task<IActionResult> RegisterWithOtp(RegisterDto dto)
{
    // Verify OTP was used for this email
    var validOtp = await _context.OtpVerifications
        .Where(o => o.Email == dto.Email && 
                   o.Purpose == "Registration" &&
                   o.IsUsed &&
                   o.CreatedAt > DateTime.UtcNow.AddMinutes(-15)) // Within last 15 min
        .AnyAsync();

    if (!validOtp)
        return BadRequest("Please verify your email with OTP first");

    // Rest of registration logic (same as original Register method)
    var errors = new Dictionary<string, string>();

    if (string.IsNullOrWhiteSpace(dto.FullName) || dto.FullName.Length < 3)
        errors["fullName"] = "Full name must be at least 3 characters.";

    if (!ValidationHelpers.IsValidEmail(dto.Email))
        errors["email"] = "Enter a valid email address.";

    if (!ValidationHelpers.IsValidBdPhone(dto.Phone))
        errors["phone"] = "Enter an 11-digit BD phone number starting with 01.";

    if (!ValidationHelpers.IsValidStudentId(dto.StudentId))
        errors["studentId"] = "Student ID must be exactly 7 digits.";

    if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 8)
        errors["password"] = "Password must be at least 8 characters.";

    if (errors.Count > 0)
        return BadRequest(new { errors });

    var existing = await _userManager.FindByEmailAsync(dto.Email);
    if (existing != null)
        return BadRequest("Email already in use.");

    var user = new ApplicationUser
    {
        UserName = dto.Email,
        Email = dto.Email,
        FullName = dto.FullName,
        StudentId = dto.StudentId,
        Department = dto.Department,
        PhoneNumber = dto.Phone
    };

    var result = await _userManager.CreateAsync(user, dto.Password);
    if (!result.Succeeded)
        return BadRequest(result.Errors);

    if (!await _roleManager.RoleExistsAsync(dto.Role))
    {
        await _roleManager.CreateAsync(new IdentityRole(dto.Role));
    }

    await _userManager.AddToRoleAsync(user, dto.Role);

    return Ok("Registration successful.");
}

// NEW: Forgot Password - Send OTP
[HttpPost("forgot-password")]
public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
{
    var user = await _userManager.FindByEmailAsync(dto.Email);
    if (user == null)
        return Ok(new { message = "If the email exists, a reset code has been sent" }); // Don't reveal if email exists

    var otp = new Random().Next(100000, 999999).ToString();

    var otpRecord = new OtpVerification
    {
        Email = dto.Email,
        Otp = otp,
        ExpiresAt = DateTime.UtcNow.AddMinutes(30),
        Purpose = "PasswordReset"
    };

    _context.OtpVerifications.Add(otpRecord);
    await _context.SaveChangesAsync();

    await _emailService.SendPasswordResetEmailAsync(dto.Email, otp);

    return Ok(new { message = "If the email exists, a reset code has been sent" });
}

// NEW: Reset Password with OTP
[HttpPost("reset-password")]
public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
{
    var otpRecord = await _context.OtpVerifications
        .Where(o => o.Email == dto.Email && 
                   o.Otp == dto.Otp && 
                   o.Purpose == "PasswordReset" &&
                   !o.IsUsed &&
                   o.ExpiresAt > DateTime.UtcNow)
        .FirstOrDefaultAsync();

    if (otpRecord == null)
        return BadRequest("Invalid or expired reset code");

    var user = await _userManager.FindByEmailAsync(dto.Email);
    if (user == null)
        return BadRequest("User not found");

    otpRecord.IsUsed = true;
    await _context.SaveChangesAsync();

    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
    var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);

    if (!result.Succeeded)
        return BadRequest(result.Errors);

    return Ok(new { message = "Password reset successfully" });
}
    }
}
