interface ColumnDefinition {
  name: string;
  type: string;
  primaryKey?: boolean;
  unique?: boolean;
  notNull?: boolean;
  references?: string;
}

interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
}

export function parseSQL(sql: string): TableDefinition[] {
  const tables: TableDefinition[] = [];
  const tablePattern = /CREATE TABLE (\w+) \(([^)]+)\);/i;
  const columnPattern =
    /(\w+) (\w+)(\((\d+)\))? (PRIMARY KEY|NOT NULL|UNIQUE|DEFAULT (.+))?/gi;

  let match: RegExpExecArray | null;

  while ((match = tablePattern.exec(sql)) !== null) {
    const tableName = match[1];
    const columnsStr = match[2].trim();
    const columns: ColumnDefinition[] = [];

    columnsStr.split(",").forEach((columnStr) => {
      const columnMatch = columnPattern.exec(columnStr.trim());

      if (columnMatch) {
        const columnName = columnMatch[1];
        const columnType = columnMatch[2];
        columns.push({ name: columnName, type: columnType });
      }
    });

    tables.push({ name: tableName, columns });
  }

  return tables;
}

export function mapSQLTypeToTypeScript(sqlType: string): string {
  switch (sqlType.toUpperCase()) {
    case "SERIAL":
    case "INTEGER":
    case "INT":
      return "number";
    case "VARCHAR":
    case "TEXT":
      return "string";
    default:
      return "any";
  }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
