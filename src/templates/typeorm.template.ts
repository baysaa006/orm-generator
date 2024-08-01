import { capitalize, mapSQLTypeToTypeScript } from "../converter";

export function generateTypeORMEntity(table: any): string {
  const columns = table.columns
    .map((column: any) => {
      let decorators = `@Column()`;
      if (column.primaryKey) decorators = `@PrimaryGeneratedColumn()`;
      if (column.unique) decorators += `\n    @Column({ unique: true })`;
      if (column.notNull) decorators += `\n    @Column({ nullable: false })`;
      if (column.references)
        decorators += `\n    @ManyToOne(() => ${capitalize(
          column.references
        )}, ${column.references.toLowerCase()} => ${column.references.toLowerCase()}.posts)`;

      return `
    ${decorators}
    ${column.name}: ${mapSQLTypeToTypeScript(column.type)};
        `.trim();
    })
    .join("\n");

  return `
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class ${capitalize(table.name)} {
${columns}
}
    `.trim();
}
