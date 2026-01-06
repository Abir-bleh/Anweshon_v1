using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Anweshon.Api.Migrations
{
    /// <inheritdoc />
    public partial class MakeExecutiveUserIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClubExecutives_AspNetUsers_UserId",
                table: "ClubExecutives");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "ClubExecutives",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_ClubExecutives_AspNetUsers_UserId",
                table: "ClubExecutives",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClubExecutives_AspNetUsers_UserId",
                table: "ClubExecutives");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "ClubExecutives",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ClubExecutives_AspNetUsers_UserId",
                table: "ClubExecutives",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
