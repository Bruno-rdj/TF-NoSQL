// Consultas para testar o projeto

// Usar o banco de dados
db = db.getSiblingDB('sistema_entregas');

// 1. Consulta para buscar entregas em trânsito de um cliente específico
var resultado = db.entregas.find(
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
);

print("\n=== ENTREGAS EM TRÂNSITO DO CLIENTE CLI987654 ===");
while (resultado.hasNext()) {
  printjson(resultado.next());
}

// 2. Analisar a performance da consulta com explain()
print("\n=== ANÁLISE DE PERFORMANCE DA CONSULTA ===");
var explain = db.entregas.find(
  { 
    "cliente_id": "CLI987654", 
    "status": "em_transito" 
  }
).explain("executionStats");
printjson(explain);

// 3. Verificar os índices criados
print("\n=== ÍNDICES DA COLEÇÃO ===");
var indices = db.entregas.getIndexes();
printjson(indices);