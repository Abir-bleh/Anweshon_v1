using System.Net;
using System.Net.Mail;

namespace Anweshon.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
                var fromEmail = _configuration["Email:FromEmail"] ?? "noreply@anweshon.com";
                var password = _configuration["Email:Password"] ?? "";

                using var client = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(fromEmail, password)
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, "Anweshon - RUET Clubs"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to {Email}", toEmail);
                throw;
            }
        }

        public async Task SendOtpEmailAsync(string toEmail, string otp)
        {
            var subject = "Your Anweshon Verification Code";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2 style='color: #10b981;'>Welcome to Anweshon!</h2>
                    <p>Your verification code is:</p>
                    <h1 style='color: #10b981; font-size: 32px; letter-spacing: 4px;'>{otp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                </body>
                </html>";

            await SendEmailAsync(toEmail, subject, body);
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken)
        {
            var subject = "Reset Your Anweshon Password";
            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif;'>
                    <h2 style='color: #10b981;'>Password Reset Request</h2>
                    <p>You requested to reset your password. Use this code to reset it:</p>
                    <h1 style='color: #10b981; font-size: 32px; letter-spacing: 4px;'>{resetToken}</h1>
                    <p>This code will expire in 30 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </body>
                </html>";

            await SendEmailAsync(toEmail, subject, body);
        }
    }
}