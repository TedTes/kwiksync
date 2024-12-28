import { DataSource } from "typeorm";
import { getDbConfig } from "./database.config";

const MigrationDataSource = new DataSource(getDbConfig(true));

// For TypeORM CLI
module.exports = MigrationDataSource;
