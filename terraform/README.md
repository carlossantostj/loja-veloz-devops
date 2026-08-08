# Terraform

Este diretório demonstra a camada de Infrastructure as Code (IaC) exigida no trabalho.

A decisão de manter um esqueleto é intencional: sem um provedor cloud escolhido, criar recursos reais poderia exigir credenciais e gerar custos. Em uma implantação real, devem ser adicionados provider, rede, cluster, node pools e backend remoto de state.

Com um cluster acessível:

```bash
terraform init
terraform fmt
terraform validate
terraform plan
```

Não execute `terraform apply` sem revisar o provider e as credenciais do ambiente.
