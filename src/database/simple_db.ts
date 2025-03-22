import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

async function openDatabase() {
  db = await SQLite.openDatabaseAsync('inventory-app');

  await db.execAsync(`
    PRAGMA journal_mode = WAL; CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY NOT NULL, nome TEXT NOT NULL, marca TEXT, categoria TEXT);`);
}

// Exporta a função openDatabase para ser chamada externamente
export { openDatabase };

// Exporta a função insertData para ser chamada externamente
export async function insertData(nome: string, marca: string, categoria: string) {
  if (!db) {
    await openDatabase(); // Garante que o banco de dados esteja aberto
  }
  try {
    const result = await db.runAsync('INSERT INTO inventory (nome, marca, categoria) VALUES (?, ?, ?)', nome, marca, categoria);
    console.log(result.lastInsertRowId, result.changes);
    const firstRow = await db.getFirstAsync('SELECT * FROM inventory');
    console.log(firstRow);
  } catch (e) {
    console.error("Failed to insert data", e);
  }
}

// Exporta a função para fechar o banco de dados
export async function closeDatabase() {
  if (db) {
    await db.closeAsync();
    console.log("Database connection closed.");
  }
}

// Exporta a função para limpar a tabela usuarios
export async function clearUsuariosTable() {
    if (!db) {
      await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
      await db.execAsync('DELETE FROM inventory');
      console.log('Tabela inventory limpa com sucesso!');
    } catch (e) {
      console.error('Erro ao limpar a tabela inventory:', e);
    }
  }

  export async function getAllUsuarios() {
    if (!db) {
      await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
      const result = await db.getAllAsync('SELECT * FROM inventory');
      console.log(result);
    } catch (e) {
      console.error('Erro ao obter todos os usuários:', e);
    }
  }

  // Exporta a função para remover a tabela usuarios
  export async function dropUsuariosTable() {
    if (!db) {
      await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
      await db.execAsync('DROP TABLE IF EXISTS inventory');
      console.log('Tabela inventory removida com sucesso!');
    } catch (e) {
      console.error('Erro ao remover a tabela inventory:', e);
    }
  }
