# Checklist de evidências para o relatório

1. `docker compose up --build`
2. `docker compose ps`
3. `GET /health`
4. `GET /api/products`
5. `POST /api/orders`
6. `GET /api/orders`
7. GitHub Actions com testes e build
8. Pacotes/imagens no GHCR
9. `kubectl get pods -n loja-veloz`
10. `kubectl get svc -n loja-veloz`
11. `kubectl get hpa -n loja-veloz`
12. `kubectl describe hpa -n loja-veloz`
13. logs contendo `trace_id`
14. `terraform fmt` e `terraform validate`
15. Link do vídeo no README
