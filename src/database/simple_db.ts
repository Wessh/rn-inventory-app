import * as SQLite from 'expo-sqlite';


export interface InventoryItem {
  id: number;
  nome: string;
  marca: string;
  categoria: string;
  quantidade: number;
}

let db: SQLite.SQLiteDatabase;

async function openDatabase() {
  db = await SQLite.openDatabaseAsync('inventory-app');

  await db.execAsync(`
    --DROP TABLE IF EXISTS app_settings;
    --DROP TABLE IF EXISTS inventory;

    PRAGMA journal_mode = WAL; 
    CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY NOT NULL, 
    nome TEXT NOT NULL, 
    marca TEXT, 
    categoria TEXT,
    quantidade INTEGER
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_name TEXT NOT NULL
    );

    INSERT INTO app_settings (app_name) 
    SELECT 'Inventário'
    WHERE NOT EXISTS (
      SELECT 1 FROM app_settings WHERE id = 1
    );
    `);

}
// Exporta a função openDatabase para ser chamada externamente
export { openDatabase };

export async function getAppName() {
  if (!db) {
    await openDatabase();
  }
  const result: any = await db.getFirstAsync('SELECT app_name FROM app_settings');
  return result.app_name;
}

export async function updateAppName(app_name: string) {
  if (!db) {
    await openDatabase();
  }
  await db.runAsync('UPDATE app_settings SET app_name = ? WHERE id = 1', app_name);
}
// Exporta a função insertData para ser chamada externamente
export async function insertData(nome: string, marca: string, categoria: string, quantidade: number) {
  if (!db) {
    await openDatabase(); // Garante que o banco de dados esteja aberto
  }
  try {
    // Verificar se já existe um item com as mesmas características
    const existingItem = await db.getFirstAsync(
      'SELECT * FROM inventory WHERE LOWER(nome) = LOWER(?) AND LOWER(marca) = LOWER(?) AND LOWER(categoria) = LOWER(?)',
      nome,
      marca,
      categoria
    );

    if (existingItem) {
      console.log('Item duplicado encontrado, não será inserido.');
      return existingItem; // Retorna o item existente
    }

    const result = await db.runAsync(
      'INSERT INTO inventory (nome, marca, categoria, quantidade) VALUES (?, ?, ?, ?)',
      nome,
      marca,
      categoria,
      quantidade
    );
    console.log(result.lastInsertRowId, result.changes);
    const firstRow = await db.getFirstAsync('SELECT * FROM inventory');
    console.log(firstRow);
  } catch (e) {
    console.error('Failed to insert data', e);
  }
}

// Exporta a função para fechar o banco de dados
export async function closeDatabase() {
  if (db) {
    await db.closeAsync();
    console.log("Database connection closed.");
  }
}

export async function getAllInventory(): Promise<InventoryItem[]> {
  if (!db) {
    await openDatabase(); // Garante que o banco de dados esteja aberto
  }
  try {
    const result = await db.getAllAsync('SELECT * FROM inventory');
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

export async function updateData(id: number, nome: string, marca: string, categoria: string, quantidade: number): Promise<void> {
  if (!db) {
    await openDatabase(); // Garante que o banco de dados esteja aberto
  }
  try {
    await db.runAsync(
      'UPDATE inventory SET nome = ?, marca = ?, categoria = ?, quantidade = ? WHERE id = ?',
      nome,
      marca,
      categoria,
      quantidade,
      id
    );
    console.log(`Item com ID ${id} atualizado com sucesso.`);
  } catch (e) {
    console.error(`Failed to update data for item with ID ${id}`, e);
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

    let parsedQuantity: number | null = null;
    if (quantidade) {
      parsedQuantity = parseInt(quantidade, 10);
    }

    if (parsedQuantity !== null && !isNaN(parsedQuantity) && parsedQuantity !== 0) {
      if (quantityFilter === 'gte') {
        sql += ' AND quantidade >= ?';
      } else if (quantityFilter === 'lte') {
        sql += ' AND quantidade <= ?';
      } else if (quantityFilter === 'eq') {
        sql += ' AND quantidade = ?';
      }
      params.push(parsedQuantity);
    }

    sql += ' ORDER BY nome'; // Adiciona a ordenação por nome

    const result = await db.getAllAsync(sql, params);
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

export const saveAppName = async (appName: string): Promise<void> => {
  try {
    if (!db) {
      await openDatabase();
    }
    await db.runAsync('UPDATE app_settings SET app_name = ? WHERE id = 1', [appName]);
  } catch (error) {
    console.error('Erro ao salvar o nome do app:', error);
  }
};



