import { join } from 'path';

/**
 * ? I could have used something like LowDB or Sqlite3. I chose to stick close to the given instructions and just use a simple JSON file for handling the CRUD operations
 */

export const PROJECT_ROOT_DIR = process.cwd();

export const DATA_FILE_PATH = join(process.cwd(), `data.json`);
