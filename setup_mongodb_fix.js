// Seleciona o banco de dados
db = db.getSiblingDB('sistema_entregas');

// Cria a coleção e insere documentos
db.entregas.insertMany([
  {
    "cliente_id": "CLI987654",
    "status": "em_transito",
    "origem": "São Paulo",
    "destino": "Rio de Janeiro",
    "datas": {
      "pedido": "2025-06-01",
      "saida": "2025-06-02",
      "previsao_entrega": "2025-06-05"
    }
  },
  {
    "cliente_id": "CLI123456",
    "status": "entregue",
    "origem": "Belo Horizonte",
    "destino": "Brasília",
    "datas": {
      "pedido": "2025-05-28",
      "saida": "2025-05-29",
      "entrega": "2025-06-01"
    }
  },
  {
    "cliente_id": "CLI987654",
    "status": "aguardando",
    "origem": "Curitiba",
    "destino": "Florianópolis",
    "datas": {
      "pedido": "2025-06-03"
    }
  }
]);

// Cria índices para melhorar a performance das consultas
db.entregas.createIndex({ "cliente_id": 1 });
db.entregas.createIndex({ "status": 1 });
db.entregas.createIndex({ "cliente_id": 1, "status": 1 });