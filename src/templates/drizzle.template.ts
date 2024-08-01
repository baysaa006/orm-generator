export function generateDrizzleORMEntity(table: any): string {
  const columns = table.columns
    .map((column: any) => {
      let columnDefinition = `    ${column.name}: `;
      switch (column.type.toUpperCase()) {
        case "SERIAL":
        case "INTEGER":
        case "INT":
          columnDefinition += `serial('${column.name}')`;
          break;
        case "VARCHAR":
          columnDefinition += `varchar('${column.name}', { length: 255 })`;
          break;
        case "TEXT":
          columnDefinition += `text('${column.name}')`;
          break;
        default:
          columnDefinition += `unknownType('${column.name}')`;
      }
      if (column.primaryKey) columnDefinition += `.primaryKey()`;
      if (column.unique) columnDefinition += `.unique()`;
      if (column.notNull) columnDefinition += `.notNull()`;
      if (column.references)
        columnDefinition += `.references(${column.references})`;

      return columnDefinition + ",";
    })
    .join("\n");

  return `
import { serial, varchar, text, table } from 'drizzle-orm';

export const ${table.name} = table('${table.name}', {
${columns}
});
    `.trim();
}
