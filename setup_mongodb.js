// Script para configurar o MongoDB

// Criar a coleção
db = db.getSiblingDB('sistema_entregas');
db.createCollection("entregas");

// Criar índices
db.entregas.createIndex({ "cliente_id": 1, "status": 1 });
db.entregas.createIndex({ "origem.coordenadas": "2d" });
db.entregas.createIndex({ "destino.coordenadas": "2d" });
db.entregas.createIndex({ "status": 1 });

// Inserir dados de exemplo
db.entregas.insertMany([
  {
    "_id": "ENT123456",
    "cliente_id": "CLI987654",
    "origem": {
      "endereco": "Av. Paulista, 1000",
      "cidade": "São Paulo",
      "estado": "SP",
      "coordenadas": [23.5505, 46.6333]
    },
    "destino": {
      "endereco": "Av. Atlântica, 500",
      "cidade": "Rio de Janeiro",
      "estado": "RJ",
      "coordenadas": [22.9068, 43.1729]
    },
    "status": "em_transito",
    "datas": {
      "coleta": new Date("2023-11-15T10:30:00Z"),
      "entrega_prevista": new Date("2023-11-16T14:00:00Z"),
      "entrega_efetiva": null
    },
    "historico_status": [
      {
        "status": "registrada",
        "timestamp": new Date("2023-11-14T15:45:00Z")
      },
      {
        "status": "coletada",
        "timestamp": new Date("2023-11-15T10:30:00Z")
      },
      {
        "status": "em_transito",
        "timestamp": new Date("2023-11-15T11:15:00Z")
      }
    ]
  },
  {
    "_id": "ENT123457",
    "cliente_id": "CLI987654",
    "origem": {
      "endereco": "Rua Augusta, 1500",
      "cidade": "São Paulo",
      "estado": "SP",
      "coordenadas": [23.5530, 46.6429]
    },
    "destino": {
      "endereco": "Rua das Laranjeiras, 200",
      "cidade": "Rio de Janeiro",
      "estado": "RJ",
      "coordenadas": [22.9350, 43.1856]
    },
    "status": "em_transito",
    "datas": {
      "coleta": new Date("2023-11-15T11:45:00Z"),
      "entrega_prevista": new Date("2023-11-16T16:30:00Z"),
      "entrega_efetiva": null
    },
    "historico_status": [
      {
        "status": "registrada",
        "timestamp": new Date("2023-11-14T16:30:00Z")
      },
      {
        "status": "coletada",
        "timestamp": new Date("2023-11-15T11:45:00Z")
      },
      {
        "status": "em_transito",
        "timestamp": new Date("2023-11-15T12:30:00Z")
      }
    ]
  },
  {
    "_id": "ENT123459",
    "cliente_id": "CLI987654",
    "origem": {
      "endereco": "Av. Rebouças, 1000",
      "cidade": "São Paulo",
      "estado": "SP",
      "coordenadas": [23.5640, 46.6730]
    },
    "destino": {
      "endereco": "Rua Gonçalo de Carvalho, 500",
      "cidade": "Porto Alegre",
      "estado": "RS",
      "coordenadas": [30.0277, 51.2287]
    },
    "status": "em_transito",
    "datas": {
      "coleta": new Date("2023-11-15T14:00:00Z"),
      "entrega_prevista": new Date("2023-11-17T11:00:00Z"),
      "entrega_efetiva": null
    },
    "historico_status": [
      {
        "status": "registrada",
        "timestamp": new Date("2023-11-14T18:00:00Z")
      },
      {
        "status": "coletada",
        "timestamp": new Date("2023-11-15T14:00:00Z")
      },
      {
        "status": "em_transito",
        "timestamp": new Date("2023-11-15T14:45:00Z")
      }
    ]
  }
]);

print("Banco de dados configurado com sucesso!");