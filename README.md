# Projeto de Escalabilidade e Otimização em NoSQL

Este projeto apresenta uma solução para um sistema de gerenciamento de entregas utilizando MongoDB como banco de dados NoSQL.

## Arquivos do Projeto

- `solucao_nosql.md` - Documentação completa do projeto com todas as respostas
- `consultas_mongodb.js` - Consultas para testar o projeto
- `setup_mongodb.js` - Script para configurar o MongoDB
- `docker-compose.yml` - Configuração para executar o projeto com Docker
- `comandos.txt` - Lista de comandos para testar o projeto

## Como Executar o Projeto

1. Inicie os containers:
   ```
   docker-compose up -d
   ```

2. Conecte-se ao MongoDB:
   ```
   docker exec -it mongodb-nosql-projeto mongosh
   ```

3. Configure o banco de dados:
   ```javascript
   load("/setup_mongodb.js")
   ```

4. Execute as consultas:
   ```javascript
   load("/consultas_mongodb.js")
   ```

5. Acesse o MongoDB Express:
   - Abra o navegador e acesse: http://localhost:8081

6. Para parar os containers:
   ```
   docker-compose down
   ```

## Consulta Principal

```javascript
// Consulta para buscar entregas em trânsito de um cliente específico
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