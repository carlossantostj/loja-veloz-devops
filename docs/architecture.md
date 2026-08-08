# Arquitetura

## Fluxo principal

Cliente → Gateway → Pedidos → PostgreSQL

O Gateway também encaminha requisições para Pagamentos e Estoque. O `X-Trace-Id` é criado no Gateway e propagado para os serviços, permitindo correlacionar logs de uma mesma requisição.

## Decisões

- Docker Compose: ambiente local reproduzível.
- Kubernetes: produção e orquestração.
- PostgreSQL: persistência relacional.
- GHCR: registry integrado ao GitHub.
- GitHub Actions: CI/CD.
- Rolling Update: substituição gradual de Pods.
- HPA: escala horizontal por CPU.
- Pod Security Admission: namespace com `restricted`.
- OpenTelemetry: evolução planejada para tracing completo.
