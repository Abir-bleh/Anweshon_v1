using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Anweshon.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClubCustomizations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AttendanceStatus",
                table: "EventRegistrations",
                newName: "Status");

            migrationBuilder.AddColumn<string>(
                name: "BannerUrl",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryColor",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryColor",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WebsiteUrl",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BannerUrl",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "PrimaryColor",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "SecondaryColor",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "WebsiteUrl",
                table: "Clubs");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "EventRegistrations",
                newName: "AttendanceStatus");
        }
    }
}
