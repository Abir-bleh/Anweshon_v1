namespace Anweshon.Api.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
        Task SendOtpEmailAsync(string toEmail, string otp);
        Task SendPasswordResetEmailAsync(string toEmail, string resetToken);
    }
}