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

export interface InventoryItem {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  quantidade: number;
}

export async function getAllInventory(): Promise<InventoryItem[]> {
  if (!db) {
    await openDatabase(); // Garante que o banco de dados esteja aberto
  }
  try {
    const result = await db.getAllAsync('SELECT * FROM inventory');
    console.log(result);
    return result as InventoryItem[]; // Retorna o resultado como um array de InventoryItem
  } catch (e) {
    console.error('Erro ao obter todos os itens do inventário:', e);
    return []; // Em caso de erro, retorna um array vazio
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

export async function updateData(id: number, nome: string, marca: string, categoria: string, quantidade: number) {
  if (!db) {
    await openDatabase(); // Garante que o banco de dados esteja aberto
  }
  try {
    const result = await db.runAsync('UPDATE inventory SET nome = ?, marca = ?, categoria = ?, quantidade = ? WHERE id = ?', nome, marca, categoria, quantidade, id);
    console.log(`Item com id ${id} atualizado com sucesso!`);
  } catch (e) {
    console.error(`Failed to update data for item with id ${id}`, e);
  }
}

export async function deleteData(id: number) {
  if (!db) {
    await openDatabase(); // Garante que o banco de dados esteja aberto
  }
  try {
    const result = await db.runAsync('DELETE FROM inventory WHERE id = ?', id);
    console.log(`Item com id ${id} deletado com sucesso!`);
  } catch (e) {
    console.error(`Failed to delete data for item with id ${id}`, e);
  }
}

export const getInventoryByFilters = async (
  category: string,
  marca: string,
  quantidade: string,
  quantityFilter: string
): Promise<InventoryItem[]> => {
  if (!db) {
    await openDatabase();
  }
  try {
    let sql = 'SELECT * FROM inventory WHERE 1=1';
    const params: any[] = [];

    if (category) {
      sql += ' AND categoria = ?';
      params.push(category);
    }
    if (marca) {
      sql += ' AND marca = ?';
      params.push(marca);
    }
    if (quantidade) {
      if (quantityFilter === 'gt') {
        sql += ' AND quantidade > ?';
      } else if (quantityFilter === 'lt') {
        sql += ' AND quantidade < ?';
      } else {
        sql += ' AND quantidade = ?';
      }
      params.push(quantidade);
    }

    const result = await db.getAllAsync(sql, ...params);
    return result as InventoryItem[];
  } catch (error) {
    console.error('Erro ao obter o inventário com filtros:', error);
    return [];
  }
};

export async function getAvailableCategories(): Promise<string[]> {
  if (!db) {
    await openDatabase();
  }
  try {
    const result = await db.getAllAsync('SELECT DISTINCT categoria FROM inventory');
    const categories = result.map((item: any) => item.categoria) as string[];
    console.log("Categorias disponíveis:", categories);
    return categories;
  } catch (e) {
    console.error('Erro ao obter categorias disponíveis:', e);
    return [];
  }
}

export async function getAvailableMarcas(): Promise<string[]> {
  if (!db) {
    await openDatabase();
  }
  try {
    const result = await db.getAllAsync('SELECT DISTINCT marca FROM inventory');
    const marcas = result.map((item: any) => item.marca) as string[];
    console.log("Marcas disponíveis:", marcas);
    return marcas;
  } catch (e) {
    console.error('Erro ao obter marcas disponíveis:', e);
    return [];
  }
}



