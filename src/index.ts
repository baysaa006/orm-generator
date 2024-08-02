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
      fs.writeFile(filePath, entityCode, (err) => {
        if (err) {
          return console.error(`Error creating file: ${err}`);
        }
        console.log(`File ${filePath} created successfully!`);
      });
      console.log(`Generated ${filePath}`);
    });
  }
}

const converter = new SQLToORMConverter();

const sqlFilePath = path.join(__dirname, "input.text");

fs.readFile(sqlFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the SQL file:", err);
    return;
  }
  converter.convert(
    data,
    "typeorm",
    `output/${new Date().getMilliseconds()}/typeorm`
  );
});
