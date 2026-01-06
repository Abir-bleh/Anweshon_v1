using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Anweshon.Api.Migrations
{
    /// <inheritdoc />
    public partial class EnhancedFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BannerUrl",
                table: "Events",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "Events",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowInPastEvents",
                table: "Events",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "AchievementType",
                table: "Achievements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Achievements",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Achievements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MemberName",
                table: "Achievements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Achievements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SubmittedById",
                table: "Achievements",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubmittedByUserId",
                table: "Achievements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ClubPosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClubId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PostType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedById = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubPosts_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ClubPosts_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ClubPostImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClubPostId = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Caption = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubPostImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubPostImages_ClubPosts_ClubPostId",
                        column: x => x.ClubPostId,
                        principalTable: "ClubPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Achievements_SubmittedById",
                table: "Achievements",
                column: "SubmittedById");

            migrationBuilder.CreateIndex(
                name: "IX_ClubPostImages_ClubPostId",
                table: "ClubPostImages",
                column: "ClubPostId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubPosts_ClubId",
                table: "ClubPosts",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubPosts_CreatedById",
                table: "ClubPosts",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Achievements_AspNetUsers_SubmittedById",
                table: "Achievements",
                column: "SubmittedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Achievements_AspNetUsers_SubmittedById",
                table: "Achievements");

            migrationBuilder.DropTable(
                name: "ClubPostImages");

            migrationBuilder.DropTable(
                name: "ClubPosts");

            migrationBuilder.DropIndex(
                name: "IX_Achievements_SubmittedById",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "BannerUrl",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "ShowInPastEvents",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "AchievementType",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "MemberName",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "SubmittedById",
                table: "Achievements");

            migrationBuilder.DropColumn(
                name: "SubmittedByUserId",
                table: "Achievements");
        }
    }
}
