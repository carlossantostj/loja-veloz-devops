# Esqueleto de IaC do projeto.
# A criação do cluster gerenciado depende do provedor cloud escolhido.
# Em uma implantação real, este módulo seria complementado pelo provider
# específico (AWS/Azure/GCP) e por módulos de rede e cluster.

provider "kubernetes" {
  host = var.kubernetes_host
  insecure = true
}

resource "kubernetes_namespace" "loja_veloz" {
  metadata {
    name = "loja-veloz"
  }
}
