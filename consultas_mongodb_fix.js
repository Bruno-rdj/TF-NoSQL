// Seleciona o banco de dados
db = db.getSiblingDB('sistema_entregas');

// Consulta 1: Encontrar entregas em trânsito para um cliente específico
print("Consulta 1: Entregas em trânsito para o cliente CLI987654");
db.entregas.find(
  { 
    "cliente_id": "CLI987654", 
    "status": "em_transito" 
  },
  {
    "_id": 1,
    "origem": 1,
    "destino": 1,
    "datas": 1
  }
).pretty();

// Consulta 2: Explicação da execução da consulta
print("\nConsulta 2: Análise de desempenho da consulta");
db.entregas.find(
  {
    "cliente_id": "CLI987654", 
    "status": "em_transito" 
  }
).explain("executionStats");

// Consulta 3: Todas as entregas do cliente CLI987654
print("\nConsulta 3: Todas as entregas do cliente CLI987654");
db.entregas.find(
  { 
    "cliente_id": "CLI987654"
  }
).pretty();

// Consulta 4: Verificar os índices existentes
print("\nConsulta 4: Índices existentes na coleção");
db.entregas.getIndexes();