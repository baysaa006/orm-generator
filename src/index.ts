import * as fs from "fs";
import * as path from "path";
import { parseSQL, capitalize } from "./converter";
import { generateTypeORMEntity } from "./templates/typeorm.template";
import { generateDrizzleORMEntity } from "./templates/drizzle.template";
import { generatePrismaEntity } from "./templates/prisma.template";

class SQLToORMConverter {
  convert(
    sql: string,
    orm: "typeorm" | "drizzle" | "prisma",
    outputDir: string
  ): void {
    const tables = parseSQL(sql);

    console.log("tables+", tables);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    tables.forEach((table) => {
      let entityCode = "";
      let filename = `${capitalize(table.name)}.ts`;

      switch (orm) {
        case "typeorm":
          entityCode = generateTypeORMEntity(table);
          console.log(`Generated ${filename}`);
          break;
        case "drizzle":
          entityCode = generateDrizzleORMEntity(table);
          break;
        case "prisma":
          entityCode = generatePrismaEntity(table);
          filename = `${table.name}.prisma`;
          break;
        default:
          throw new Error("Unsupported ORM");
      }

      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, entityCode);
      console.log(`Generated ${filePath}`);
    });
  }
}

// Usage example
const converter = new SQLToORMConverter();
const sql = `
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    userId INTEGER REFERENCES users(id)
);
`;

// Convert and write TypeORM entities to 'output/typeorm' folder
converter.convert(sql, "typeorm", "output/typeorm");
