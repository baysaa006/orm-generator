import * as fs from "fs";
import * as path from "path";

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
  const createTableRegex = /CREATE TABLE (\w+) \(([^)]+)\);/g;
  let match;

  while ((match = createTableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const columns = match[2].split(",").map((column) => {
      const parts = column.trim().split(/\s+/);
      const columnDef: ColumnDefinition = { name: parts[0], type: parts[1] };
      if (parts.includes("PRIMARY")) columnDef.primaryKey = true;
      if (parts.includes("UNIQUE")) columnDef.unique = true;
      if (parts.includes("NOT") && parts.includes("NULL"))
        columnDef.notNull = true;
      const referencesMatch = /REFERENCES (\w+)/.exec(column);
      if (referencesMatch) columnDef.references = referencesMatch[1];
      return columnDef;
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
