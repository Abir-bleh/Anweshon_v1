using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Anweshon.Api.Migrations
{
    /// <inheritdoc />
    public partial class newfunctionalities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_EventRegistrations_EventId",
                table: "EventRegistrations");

            migrationBuilder.AddColumn<string>(
                name: "FacebookUrl",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FoundedYear",
                table: "Clubs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramUrl",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MeetingLocation",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tagline",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ClubExecutives",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClubId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Position = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubExecutives", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClubExecutives_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventRegistrations_EventId_UserId",
                table: "EventRegistrations",
                columns: new[] { "EventId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ClubExecutives_ClubId_Position_Name",
                table: "ClubExecutives",
                columns: new[] { "ClubId", "Position", "Name" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClubExecutives");

            migrationBuilder.DropIndex(
                name: "IX_EventRegistrations_EventId_UserId",
                table: "EventRegistrations");

            migrationBuilder.DropColumn(
                name: "FacebookUrl",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "FoundedYear",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "InstagramUrl",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "MeetingLocation",
                table: "Clubs");

            migrationBuilder.DropColumn(
                name: "Tagline",
                table: "Clubs");

            migrationBuilder.CreateIndex(
                name: "IX_EventRegistrations_EventId",
                table: "EventRegistrations",
                column: "EventId");
        }
    }
}
