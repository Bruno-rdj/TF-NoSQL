# Comandos MongoDB para Sistema de Entregas

## Conectar ao MongoDB
```bash
docker exec -it mongodb-nosql-projeto mongosh
```

## Configurar o Banco de Dados
```javascript
// Selecionar o banco de dados
use sistema_entregas

// Inserir documentos de exemplo
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
])

// Criar índices para otimização
db.entregas.createIndex({ "cliente_id": 1 })
db.entregas.createIndex({ "status": 1 })
db.entregas.createIndex({ "cliente_id": 1, "status": 1 })
```

## Consultas Úteis

### 1. Encontrar entregas em trânsito para um cliente específico
```javascript
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
).pretty()
```

### 2. Analisar desempenho da consulta
```javascript
db.entregas.find(
  {
    "cliente_id": "CLI987654", 
    "status": "em_transito" 
  }
).explain("executionStats")
```

### 3. Listar todas as entregas de um cliente
```javascript
db.entregas.find(
  { 
    "cliente_id": "CLI987654"
  }
).pretty()
```

### 4. Verificar índices existentes
```javascript
db.entregas.getIndexes()
```

### 5. Atualizar status de uma entrega
```javascript
db.entregas.updateOne(
  { 
    "cliente_id": "CLI987654",
    "status": "aguardando"
  },
  {
    $set: { 
      "status": "em_transito",
      "datas.saida": "2025-06-04"
    }
  }
)
```

### 6. Contar entregas por status
```javascript
db.entregas.aggregate([
  {
    $group: {
      _id: "$status",
      total: { $sum: 1 }
    }
  }
])
```