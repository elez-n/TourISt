using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdditionalServices_Objects_ObjectId",
                table: "AdditionalServices");

            migrationBuilder.DropForeignKey(
                name: "FK_Photographs_Objects_ObjectId",
                table: "Photographs");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Objects_ObjectId",
                table: "Reviews");

            migrationBuilder.DropTable(
                name: "Objects");

            migrationBuilder.DropIndex(
                name: "IX_Photographs_ObjectId",
                table: "Photographs");

            migrationBuilder.DropIndex(
                name: "IX_AdditionalServices_ObjectId",
                table: "AdditionalServices");

            migrationBuilder.DropColumn(
                name: "ObjectId",
                table: "Photographs");

            migrationBuilder.DropColumn(
                name: "ObjectId",
                table: "AdditionalServices");

            migrationBuilder.RenameColumn(
                name: "ObjectId",
                table: "Reviews",
                newName: "TouristObjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_ObjectId",
                table: "Reviews",
                newName: "IX_Reviews_TouristObjectId");

            migrationBuilder.AddColumn<int>(
                name: "TouristObjectId",
                table: "Photographs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TouristObjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ObjectTypeId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Coordinate1 = table.Column<double>(type: "float", nullable: false),
                    Coordinate2 = table.Column<double>(type: "float", nullable: false),
                    ContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumberOfUnits = table.Column<int>(type: "int", nullable: false),
                    NumberOfBeds = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Owner = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Featured = table.Column<bool>(type: "bit", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    MunicipalityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TouristObjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TouristObjects_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TouristObjects_Municipalities_MunicipalityId",
                        column: x => x.MunicipalityId,
                        principalTable: "Municipalities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TouristObjects_ObjectType_ObjectTypeId",
                        column: x => x.ObjectTypeId,
                        principalTable: "ObjectType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AdditionalServiceTouristObject",
                columns: table => new
                {
                    AdditionalServicesId = table.Column<int>(type: "int", nullable: false),
                    TouristObjectsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdditionalServiceTouristObject", x => new { x.AdditionalServicesId, x.TouristObjectsId });
                    table.ForeignKey(
                        name: "FK_AdditionalServiceTouristObject_AdditionalServices_AdditionalServicesId",
                        column: x => x.AdditionalServicesId,
                        principalTable: "AdditionalServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdditionalServiceTouristObject_TouristObjects_TouristObjectsId",
                        column: x => x.TouristObjectsId,
                        principalTable: "TouristObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Photographs_TouristObjectId",
                table: "Photographs",
                column: "TouristObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AdditionalServiceTouristObject_TouristObjectsId",
                table: "AdditionalServiceTouristObject",
                column: "TouristObjectsId");

            migrationBuilder.CreateIndex(
                name: "IX_TouristObjects_CategoryId",
                table: "TouristObjects",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TouristObjects_MunicipalityId",
                table: "TouristObjects",
                column: "MunicipalityId");

            migrationBuilder.CreateIndex(
                name: "IX_TouristObjects_ObjectTypeId",
                table: "TouristObjects",
                column: "ObjectTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photographs_TouristObjects_TouristObjectId",
                table: "Photographs",
                column: "TouristObjectId",
                principalTable: "TouristObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_TouristObjects_TouristObjectId",
                table: "Reviews",
                column: "TouristObjectId",
                principalTable: "TouristObjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photographs_TouristObjects_TouristObjectId",
                table: "Photographs");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_TouristObjects_TouristObjectId",
                table: "Reviews");

            migrationBuilder.DropTable(
                name: "AdditionalServiceTouristObject");

            migrationBuilder.DropTable(
                name: "TouristObjects");

            migrationBuilder.DropIndex(
                name: "IX_Photographs_TouristObjectId",
                table: "Photographs");

            migrationBuilder.DropColumn(
                name: "TouristObjectId",
                table: "Photographs");

            migrationBuilder.RenameColumn(
                name: "TouristObjectId",
                table: "Reviews",
                newName: "ObjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_TouristObjectId",
                table: "Reviews",
                newName: "IX_Reviews_ObjectId");

            migrationBuilder.AddColumn<int>(
                name: "ObjectId",
                table: "Photographs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ObjectId",
                table: "AdditionalServices",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Objects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    MunicipalityId = table.Column<int>(type: "int", nullable: false),
                    ObjectTypeId = table.Column<int>(type: "int", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Coordinate1 = table.Column<double>(type: "float", nullable: false),
                    Coordinate2 = table.Column<double>(type: "float", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Featured = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumberOfBeds = table.Column<int>(type: "int", nullable: false),
                    NumberOfUnits = table.Column<int>(type: "int", nullable: false),
                    Owner = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Objects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Objects_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Objects_Municipalities_MunicipalityId",
                        column: x => x.MunicipalityId,
                        principalTable: "Municipalities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Objects_ObjectType_ObjectTypeId",
                        column: x => x.ObjectTypeId,
                        principalTable: "ObjectType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Photographs_ObjectId",
                table: "Photographs",
                column: "ObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AdditionalServices_ObjectId",
                table: "AdditionalServices",
                column: "ObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Objects_CategoryId",
                table: "Objects",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Objects_MunicipalityId",
                table: "Objects",
                column: "MunicipalityId");

            migrationBuilder.CreateIndex(
                name: "IX_Objects_ObjectTypeId",
                table: "Objects",
                column: "ObjectTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdditionalServices_Objects_ObjectId",
                table: "AdditionalServices",
                column: "ObjectId",
                principalTable: "Objects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Photographs_Objects_ObjectId",
                table: "Photographs",
                column: "ObjectId",
                principalTable: "Objects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Objects_ObjectId",
                table: "Reviews",
                column: "ObjectId",
                principalTable: "Objects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
