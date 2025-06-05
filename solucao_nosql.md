# Projeto de Escalabilidade e Otimização em NoSQL

## Parte 1: Modelagem de Dados

### 1. Escolha do banco NoSQL adequado

**Escolha: Banco de Dados Orientado a Documentos (MongoDB)**

**Justificativa:**
- Os dados de entregas possuem uma estrutura hierárquica natural que se adapta bem ao modelo de documentos
- Permite consultas flexíveis e complexas sobre os dados de entrega
- Suporta bem mudanças no esquema, ideal para uma startup em crescimento
- Excelente desempenho para operações de leitura e escrita em tempo real
- Facilidade de escalabilidade horizontal, essencial para o crescimento da aplicação

### 2. Modelagem da coleção

```javascript
// Modelo da coleção "entregas"
{
  "_id": "ENT123456",                     // ID da entrega
  "cliente_id": "CLI987654",              // ID do cliente
  "origem": {
    "endereco": "Rua A, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "coordenadas": [23.5505, 46.6333]    // [latitude, longitude]
  },
  "destino": {
    "endereco": "Rua B, 456",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "coordenadas": [22.9068, 43.1729]    // [latitude, longitude]
  },
  "status": "em_transito",                // registrada, coletada, em_transito, entregue, cancelada
  "datas": {
    "coleta": "2023-11-15T10:30:00Z",
    "entrega_prevista": "2023-11-16T14:00:00Z",
    "entrega_efetiva": null
  },
  "historico_status": [
    {
      "status": "registrada",
      "timestamp": "2023-11-14T15:45:00Z"
    },
    {
      "status": "coletada",
      "timestamp": "2023-11-15T10:30:00Z"
    },
    {
      "status": "em_transito",
      "timestamp": "2023-11-15T11:15:00Z"
    }
  ]
}
```

## Parte 2: Estratégia de Escalabilidade

### 1. Escolha de escalabilidade

**Escolha: Escalabilidade Horizontal**

**Justificativa:**
- Melhor para sistemas com alta demanda de leitura e escrita simultâneas
- Permite adicionar novos servidores conforme a demanda cresce, sem interrupção do serviço
- Distribui a carga entre múltiplos servidores, evitando gargalos
- Mais econômico para grandes volumes de dados, pois permite usar hardware commodity
- Oferece maior resiliência, pois a falha de um nó não compromete todo o sistema

### 2. Estratégia de Sharding

**Tipo de sharding: Sharding Geográfico**

**Chave de partição sugerida:** Coordenadas geográficas (origem.coordenadas)

**Justificativa técnica:**
- Um sistema de entregas tem forte componente geográfico
- Permite que consultas relacionadas a uma região específica sejam direcionadas apenas aos shards relevantes
- Reduz a latência ao posicionar os dados próximos aos usuários que mais os acessam
- Facilita a implementação de consultas geoespaciais eficientes (como "entregas próximas")
- Ajuda a cumprir requisitos de residência de dados (leis que exigem armazenamento de dados em regiões específicas)

## Parte 3: Otimização de Consultas

### 1. Consulta para buscar entregas em trânsito de um cliente

**Consulta em MongoDB:**

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
)
```

### 2. Otimização da consulta

**Índices compostos:**
```javascript
// Criar índice composto para cliente_id e status
db.entregas.createIndex({ "cliente_id": 1, "status": 1 })
```

**Projeção de campos:**
- A consulta já utiliza projeção, retornando apenas os campos necessários (`_id`, `origem`, `destino` e `datas`)
- Isso reduz a quantidade de dados transferidos e processados

**Uso de explain():**
```javascript
db.entregas.find(
  { 
    "cliente_id": "CLI987654", 
    "status": "em_transito" 
  }
).explain("executionStats")
```

**Análise do explain():**
```javascript
// Exemplo de saída do explain()
{
  "queryPlanner": {
    "plannerVersion": 1,
    "namespace": "sistema_entregas.entregas",
    "indexFilterSet": false,
    "parsedQuery": {
      "$and": [
        { "cliente_id": { "$eq": "CLI987654" } },
        { "status": { "$eq": "em_transito" } }
      ]
    },
    "winningPlan": {
      "stage": "FETCH",
      "inputStage": {
        "stage": "IXSCAN",
        "keyPattern": { "cliente_id": 1, "status": 1 },
        "indexName": "cliente_id_1_status_1",
        "isMultiKey": false,
        "direction": "forward",
        "indexBounds": {
          "cliente_id": ["[\"CLI987654\", \"CLI987654\"]"],
          "status": ["[\"em_transito\", \"em_transito\"]"]
        }
      }
    },
    "rejectedPlans": []
  },
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 3,
    "executionTimeMillis": 2,
    "totalKeysExamined": 3,
    "totalDocsExamined": 3
  }
}
```

**Interpretação do explain():**
- O índice composto está sendo utilizado (IXSCAN)
- O número de documentos examinados (3) é igual ao número de documentos retornados (3), indicando eficiência
- Tempo de execução baixo (2ms)
- Não há planos rejeitados, indicando que o otimizador escolheu o melhor plano disponível

## Parte 4: Monitoramento e Métricas

### 1. Métricas críticas para monitoramento

**1. Latência média de consultas:**
- **Por que:** Impacta diretamente a experiência do usuário e a capacidade de rastrear entregas em tempo real
- **Como monitorar:** Usar MongoDB Profiler ou ferramentas como MongoDB Atlas Monitoring
- **Valor de alerta:** > 100ms para consultas críticas

**2. Taxa de operações de leitura/escrita por segundo:**
- **Por que:** Ajuda a entender os padrões de carga e prever necessidades de escalabilidade
- **Como monitorar:** MongoDB serverStatus() ou métricas do MongoDB Atlas
- **Valor de alerta:** > 80% da capacidade máxima projetada

**3. Utilização de memória e CPU por shard:**
- **Por que:** Identifica desequilíbrios na distribuição de dados e carga
- **Como monitorar:** MongoDB db.serverStatus() ou ferramentas de monitoramento como Prometheus + Grafana
- **Valor de alerta:** > 85% de utilização de CPU ou memória

### 2. Rebalanceamento de partições

**Situação para rebalanceamento:**
Quando há um desequilíbrio significativo no volume de dados ou tráfego entre diferentes regiões geográficas. Por exemplo, se a região Sudeste do Brasil passar a concentrar 70% das entregas, enquanto inicialmente era apenas 40%.

**Como seria feito:**

1. **Análise da distribuição atual:**
```javascript
// Verificar a distribuição de chunks entre os shards
sh.status()

// Analisar a distribuição de dados por região
db.entregas.aggregate([
  {
    $group: {
      _id: "$origem.estado",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])
```

2. **Redefinição dos limites geográficos:**
```javascript
// Remover ranges antigos
sh.removeRangeFromZone(
  "sistema_entregas.entregas",
  { "origem.coordenadas": [-23.6, -46.8] },
  { "origem.coordenadas": [-22.8, -45.8] },
  "sudeste"
)

// Adicionar novos ranges com distribuição mais equilibrada
sh.updateZoneKeyRange(
  "sistema_entregas.entregas",
  { "origem.coordenadas": [-23.6, -46.8] },
  { "origem.coordenadas": [-23.2, -46.3] },
  "sudeste_1"
)

sh.updateZoneKeyRange(
  "sistema_entregas.entregas",
  { "origem.coordenadas": [-23.2, -46.3] },
  { "origem.coordenadas": [-22.8, -45.8] },
  "sudeste_2"
)
```

3. **Migração gradual dos dados:**
- Executar durante períodos de baixo tráfego
- Monitorar o processo de migração com `sh.isBalancerRunning()` e `sh.getBalancerState()`
- Ajustar a janela de balanceamento para horários específicos:
```javascript
db.settings.update(
  { _id: "balancer" },
  { $set: { activeWindow: { start: "01:00", stop: "05:00" } } },
  { upsert: true }
)
```

4. **Monitoramento contínuo:**
```javascript
// Verificar o progresso do balanceamento
db.adminCommand({ balancerStatus: 1 })

// Monitorar a distribuição de chunks após o rebalanceamento
sh.status()
```