# Pre-commit com Gitleaks

Este projeto está configurado com pre-commit hooks para garantir a qualidade e segurança do código.

## O que está configurado

### 🔒 Gitleaks - Detecção de Segredos

- Detecta automaticamente segredos, chaves de API, tokens e credenciais
- Impede commits que contenham informações sensíveis
- Configurado com regras específicas para AWS, GitHub, Google, Stripe, etc.
- Ignora automaticamente o arquivo `package-lock.json` para evitar falsos positivos

### 🧹 ESLint - Linting

- Verifica e corrige automaticamente problemas de código JavaScript/JSX
- Aplica regras de qualidade e estilo de código

### 🎨 Prettier - Formatação

- Formata automaticamente arquivos JavaScript, JSON, CSS, SCSS, Markdown, YAML
- Mantém consistência visual no código

### ✅ Hooks de Verificação

- Verifica arquivos grandes (máximo 1MB)
- Remove espaços em branco desnecessários
- Corrige terminações de linha
- Verifica conflitos de merge
- Valida arquivos JSON e YAML

## Como usar

### Instalação (já feita)

```bash
# Instalar pre-commit
pipx install pre-commit

# Instalar hooks no repositório
pre-commit install
```

### Execução automática

Os hooks são executados automaticamente a cada commit. Se algum hook falhar, o commit será bloqueado.

### Execução manual

```bash
# Executar todos os hooks em todos os arquivos
pre-commit run --all-files

# Executar apenas o gitleaks
pre-commit run gitleaks --all-files

# Executar em arquivos específicos
pre-commit run --files arquivo1.js arquivo2.js
```

### Atualizar hooks

```bash
# Atualizar para as versões mais recentes
pre-commit autoupdate
```

## Configuração do Gitleaks

### Arquivos de configuração

- `.gitleaks.toml` - Regras de detecção de segredos
- `.gitleaks-allowlist.toml` - Padrões permitidos (exemplos, testes, etc.)

### Tipos de segredos detectados

- Chaves de API (AWS, Google, Stripe, etc.)
- Tokens (GitHub, Slack, Discord, etc.)
- Senhas e credenciais
- Chaves privadas e certificados
- URLs de conexão com banco de dados
- JWT tokens

### Ignorar falsos positivos

Se o gitleaks detectar um falso positivo, você pode:

1. **Adicionar ao allowlist** - Editar `.gitleaks-allowlist.toml`
2. **Usar comentários** - Adicionar `# gitleaks:allow` no final da linha
3. **Configurar exceções** - Adicionar regras específicas no `.gitleaks.toml`

### Configuração do Gitleaks

O gitleaks está configurado para:

- Ignorar o arquivo `package-lock.json` (exclude no pre-commit)
- Detectar segredos em todos os outros arquivos
- Usar regras específicas para diferentes tipos de credenciais

**Regras removidas**: Twitter API Key e PayPal Client ID foram removidas devido a falsos positivos com hashes de integridade do npm.

## Exemplos de uso

### Commit normal

```bash
git add .
git commit -m "feat: adicionar nova funcionalidade"
# Os hooks são executados automaticamente
```

### Se um hook falhar

```bash
git commit -m "feat: adicionar nova funcionalidade"
# ❌ Detect hardcoded secrets.................................................Failed
# O commit é bloqueado até você corrigir o problema
```

### Pular hooks (não recomendado)

```bash
git commit -m "feat: adicionar nova funcionalidade" --no-verify
# ⚠️ Use apenas em emergências
```

## Troubleshooting

### Problema: Hook falha com erro de versão

```bash
# Atualizar hooks
pre-commit autoupdate
```

### Problema: Gitleaks detecta falso positivo

1. Verificar se é realmente um falso positivo
2. Adicionar ao allowlist se necessário
3. Usar comentário `# gitleaks:allow` na linha específica

### Problema: ESLint falha

```bash
# Executar ESLint manualmente para ver erros
npm run lint

# Corrigir automaticamente
npm run lint:fix
```

## Benefícios

- ✅ **Segurança**: Previne vazamento de segredos
- ✅ **Qualidade**: Mantém padrões de código
- ✅ **Consistência**: Formatação automática
- ✅ **Produtividade**: Correções automáticas
- ✅ **Confiabilidade**: Verificações antes de cada commit

## Arquivos relacionados

- `.pre-commit-config.yaml` - Configuração principal do pre-commit
- `.gitleaks.toml` - Regras de detecção de segredos
- `.gitleaks-allowlist.toml` - Padrões permitidos
- `package.json` - Scripts de linting e formatação
