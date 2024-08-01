import { capitalize } from "../converter";

export function generatePrismaEntity(table: any): string {
  const columns = table.columns
    .map((column: any) => {
      let columnDefinition = `    ${column.name} `;
      switch (column.type.toUpperCase()) {
        case "SERIAL":
        case "INTEGER":
        case "INT":
          columnDefinition += `Int @id @default(autoincrement())`;
          break;
        case "VARCHAR":
          columnDefinition += `String`;
          break;
        case "TEXT":
          columnDefinition += `String?`;
          break;
        default:
          columnDefinition += `String`;
      }
      if (column.unique) columnDefinition += ` @unique`;
      if (column.notNull) columnDefinition += ``;
      if (column.references)
        columnDefinition += ` @relation(fields: [${column.name}], references: [id])`;

      return columnDefinition + "";
    })
    .join("\n");

  return `
model ${capitalize(table.name)} {
${columns}
}
    `.trim();
}
