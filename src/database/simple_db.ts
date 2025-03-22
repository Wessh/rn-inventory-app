import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

async function openDatabase() {
  db = await SQLite.openDatabaseAsync('inventory-app');

  await db.execAsync(`
    PRAGMA journal_mode = WAL; 
    CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY NOT NULL, 
    nome TEXT NOT NULL, 
    marca TEXT, 
    categoria TEXT,
    quantidade INTEGER
    );`);
}
// Exporta a função openDatabase para ser chamada externamente
export { openDatabase };
// Exporta a função insertData para ser chamada externamente
export async function insertData(nome: string, marca: string, categoria: string, quantidade: number) {
  if (!db) {
    await openDatabase(); // Garante que o banco de dados esteja aberto
  }
  try {
    const result = await db.runAsync('INSERT INTO inventory (nome, marca, categoria, quantidade) VALUES (?, ?, ?, ?)', nome, marca, categoria, quantidade);
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

export async function clearInventoryTable() {
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

export async function getAllInventory() {
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

export async function dropInventoryTable() {
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

export async function getInventoryById(id: number) {
    if (!db) {
        await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
        const result = await db.getAllAsync('SELECT * FROM inventory WHERE id = ?', id);
        console.log(result);
    } catch (e) {
        console.error('Erro ao obter o inventário pelo ID:', e);
    }
}

export async function getInventoryByNome(nome: string) {
    if (!db) {
        await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
        const result = await db.getAllAsync('SELECT * FROM inventory WHERE nome = ?', nome);
        console.log(result);
    } catch (e) {
        console.error('Erro ao obter o inventário pelo nome:', e);
    }
}

export async function getInventoryByMarca(marca: string) {
    if (!db) {
        await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
        const result = await db.getAllAsync('SELECT * FROM inventory WHERE marca = ?', marca);
        console.log(result);
    } catch (e) {
        console.error('Erro ao obter o inventário pela marca:', e);
    }
}

export async function getInventoryByCategoria(categoria: string) {
    if (!db) {
        await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
        const result = await db.getAllAsync('SELECT * FROM inventory WHERE categoria = ?', categoria);
        console.log(result);
    } catch (e) {
        console.error('Erro ao obter o inventário pela categoria:', e);
    }
}

export async function updateInventory(id: number, nome: string, marca: string, categoria: string, quantidade: number) {
    if (!db) {
        await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
        const result = await db.runAsync('UPDATE inventory SET nome = ?, marca = ?, categoria = ?, quantidade = ? WHERE id = ?', nome, marca, categoria, quantidade , id);
        console.log(result.lastInsertRowId, result.changes);
    } catch (e) {
        console.error('Erro ao atualizar o inventário:', e);
    }
}

export async function deleteInventory(id: number) {
    if (!db) {
        await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
        const result = await db.runAsync('DELETE FROM inventory WHERE id = ?', id);
        console.log(result.lastInsertRowId, result.changes);
    } catch (e) {
        console.error('Erro ao deletar o inventário:', e);
    }
}

export async function getInventoryByQuantidade(quantidade: number) {
    if (!db) {
        await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
        const result = await db.getAllAsync('SELECT * FROM inventory WHERE quantidade = ?', quantidade);
        console.log(result);
    } catch (e) {
        console.error('Erro ao obter o inventário pela quantidade:', e);
    }
}

export async function getInventoryByQuantidadeMaiorQue(quantidade: number) {
    if (!db) {
        await openDatabase(); // Garante que o banco de dados esteja aberto
    }
    try {
        const result = await db.getAllAsync('SELECT * FROM inventory WHERE quantidade > ?', quantidade);
        console.log(result);
    } catch (e) {
        console.error('Erro ao obter o inventário pela quantidade maior que:', e);
    }
}



