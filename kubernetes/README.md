# Kubernetes

Antes de aplicar:

1. Substitua `<GITHUB_USER>` nas imagens por seu usuário do GitHub.
2. Edite `secret.yaml` e altere `CHANGE_ME`.
3. Publique as imagens no GHCR pelo workflow.

Aplicação:

```bash
kubectl apply -k .
kubectl get pods -n loja-veloz
kubectl get svc -n loja-veloz
kubectl get hpa -n loja-veloz
kubectl port-forward -n loja-veloz service/gateway 3000:3000
```

> O PostgreSQL está com `emptyDir` neste MVP para manter o manifesto reproduzível localmente. Em produção, deve ser substituído por PersistentVolume/PersistentVolumeClaim ou por um serviço gerenciado de banco.
