# Loja Veloz – Cloud DevOps

MVP acadêmico de uma plataforma de pedidos em microsserviços, desenvolvido para a disciplina de Análise e Desenvolvimento de Sistemas – UniFECAF.

## Arquitetura

```text
Cliente
   |
API Gateway :3000
   |
   +--> Pedidos :3001 ----> PostgreSQL :5432
   |
   +--> Pagamentos :3002
   |
   +--> Estoque :3003
```

Em produção, os serviços são implantados no Kubernetes com Deployments, Services, ConfigMap, Secret, probes, HPA e Rolling Update.

## Requisitos

- Docker Desktop com Docker Compose
- Git
- Para Kubernetes local: Docker Desktop Kubernetes, Minikube ou Kind
- kubectl
- Node.js 22+ (opcional para desenvolvimento fora do Docker)

## Execução local

```bash
docker compose up --build
```

Teste:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/products
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer":"Carlos","items":[{"sku":"SKU-001","quantity":2}]}'
```

O endpoint de pedidos grava os dados no PostgreSQL. Os serviços de pagamentos e estoque são simulados para o MVP.

Parar:

```bash
docker compose down
```

Apagar também o volume do banco:

```bash
docker compose down -v
```

## Imagens e versionamento

A convenção adotada é:

```text
ghcr.io/<GITHUB_USER>/loja-veloz-<servico>:1.0.0
```

A tag `1.0.0` representa a primeira versão funcional do MVP. Em CI/CD também é possível usar o SHA do commit como tag imutável.

## Kubernetes

Edite os nomes das imagens em `kubernetes/kustomization.yaml` ou substitua `<GITHUB_USER>` pelos dados do seu GitHub.

```bash
kubectl apply -k kubernetes/
kubectl get pods
kubectl get services
kubectl get hpa
```

Para acessar o gateway localmente:

```bash
kubectl port-forward service/gateway 3000:3000
```

Depois:

```bash
curl http://localhost:3000/health
```

## CI/CD

O workflow `.github/workflows/ci-cd.yml`:

1. instala dependências;
2. executa testes;
3. constrói as imagens;
4. publica no GitHub Container Registry (GHCR).

O workflow usa `GITHUB_TOKEN` e permissão `packages: write`; não há senha escrita no código.

## Observabilidade

- Logs estruturados em JSON.
- `X-Trace-Id` é criado no Gateway e propagado entre serviços.
- `/metrics` expõe métricas simples de requisições.
- A estratégia de tracing distribuído pode ser evoluída para OpenTelemetry Collector + backend de traces.

## Deploy e escala

- Estratégia: Rolling Update.
- HPA: Pedidos e Gateway, com CPU como métrica inicial.
- Probes: readiness e liveness.
- Segurança: containers não-root, `allowPrivilegeEscalation: false`, filesystem read-only quando aplicável e Pod Security Admission `restricted`.

## Terraform

`terraform/` contém um esqueleto de IaC para representar o cluster e seus parâmetros. A implementação de um cluster gerenciado depende do provedor cloud escolhido; por isso o MVP mantém essa camada parametrizada.

## Evidências

Durante a execução do projeto, adicionar ao relatório:
- `docker compose ps`
- resposta do `/health`
- criação de pedido
- `kubectl get pods`
- `kubectl get hpa`
- execução do GitHub Actions
- imagens publicadas no GHCR
- exemplo de logs com `trace_id`

## Vídeo

Link do YouTube (não listado):
`A PREENCHER APÓS A GRAVAÇÃO`
