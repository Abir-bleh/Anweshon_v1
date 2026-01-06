using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Anweshon.Api.Migrations
{
    /// <inheritdoc />
    public partial class memberships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Memberships_ClubId",
                table: "Memberships");

            migrationBuilder.CreateIndex(
                name: "IX_Memberships_ClubId_UserId",
                table: "Memberships",
                columns: new[] { "ClubId", "UserId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Memberships_ClubId_UserId",
                table: "Memberships");

            migrationBuilder.CreateIndex(
                name: "IX_Memberships_ClubId",
                table: "Memberships",
                column: "ClubId");
        }
    }
}
