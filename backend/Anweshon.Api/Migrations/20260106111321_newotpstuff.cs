using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Anweshon.Api.Migrations
{
    /// <inheritdoc />
    public partial class newotpstuff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "ClubExecutives",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ClubCollaborations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromClubId = table.Column<int>(type: "int", nullable: false),
                    ToClubId = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EventDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EventDetails = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RespondedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Response = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubCollaborations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubCollaborations_Clubs_FromClubId",
                        column: x => x.FromClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClubCollaborations_Clubs_ToClubId",
                        column: x => x.ToClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ClubMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClubId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsReadByAdmin = table.Column<bool>(type: "bit", nullable: false),
                    AdminResponse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RespondedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubMessages_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClubMessages_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OtpVerifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Otp = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false),
                    Purpose = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OtpVerifications", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ClubExecutives_UserId",
                table: "ClubExecutives",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubCollaborations_FromClubId",
                table: "ClubCollaborations",
                column: "FromClubId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubCollaborations_ToClubId",
                table: "ClubCollaborations",
                column: "ToClubId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubMessages_ClubId",
                table: "ClubMessages",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_ClubMessages_UserId",
                table: "ClubMessages",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClubExecutives_AspNetUsers_UserId",
                table: "ClubExecutives",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClubExecutives_AspNetUsers_UserId",
                table: "ClubExecutives");

            migrationBuilder.DropTable(
                name: "ClubCollaborations");

            migrationBuilder.DropTable(
                name: "ClubMessages");

            migrationBuilder.DropTable(
                name: "OtpVerifications");

            migrationBuilder.DropIndex(
                name: "IX_ClubExecutives_UserId",
                table: "ClubExecutives");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ClubExecutives");
        }
    }
}
