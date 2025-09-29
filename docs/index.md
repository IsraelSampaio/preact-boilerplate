# 📚 Documentação da Aplicação Pokémon

Bem-vindo à documentação completa da aplicação Pokémon! Esta aplicação é construída com **Preact**, **Redux Toolkit**, **Material-UI** e segue uma **arquitetura baseada em features**.

## 🎯 Visão Geral do Projeto

Esta é uma aplicação moderna de Pokédex que demonstra padrões avançados de desenvolvimento frontend.

## 📖 Documentação Principal

### 🏗️ **[Arquitetura Geral](arquitetura-geral.md)**
Visão geral da arquitetura Feature-Based, stack tecnológica e princípios implementados.

### 🎨 **[Padrões de Componentes](padroes-componentes.md)**
Container/Presentation Pattern e boas práticas para criação de componentes.

### 🔄 **[Gerenciamento de Estado](gerenciamento-estado.md)**
Redux Toolkit com custom hooks organizados por features.

### 📦 **[Padrões de DTOs](padroes-dto.md)**
Data Transfer Objects organizados por features com Factory Pattern.

### 🔧 **[Camada de Serviços](camada-servicos.md)**
Services organizados por features para comunicação com APIs.

### 🧪 **[Estratégias de Teste](estrategias-teste.md)**
Configuração e padrões para testes unitários e de integração.

## 🚀 Quick Start

### Para Desenvolvedores
1. [Arquitetura Geral](arquitetura-geral.md) - Entenda a estrutura
2. [Padrões de Componentes](padroes-componentes.md) - Crie componentes
3. [Gerenciamento de Estado](gerenciamento-estado.md) - Gerencie dados

### Para Novos Contribuidores
1. [Stack Tecnológica](arquitetura-geral.md#stack-tecnológica)
2. [Padrões de DTOs](padroes-dto.md)
3. [Camada de Serviços](camada-servicos.md)

## 🛠️ Stack Tecnológica

- **Preact** - Framework JavaScript leve
- **Redux Toolkit** - Gerenciamento de estado
- **Material-UI** - Biblioteca de componentes
- **SCSS** - Pré-processador CSS
- **Vitest** - Framework de testes

## 📊 Estrutura do Projeto (Feature-Based)

```
src/
├── components/           # Componentes globais reutilizáveis
├── features/            # Features organizadas por domínio
│   ├── auth/           # Feature de autenticação
│   ├── pokemon/        # Feature principal Pokémon
│   ├── i18n/           # Internacionalização
│   └── shared/         # Recursos compartilhados
├── store/               # Configuração principal Redux
├── theme/               # Configuração tema MUI
└── index.js            # Barrel exports principal
```

---

*Documentação mantida pela equipe de desenvolvimento e atualizada regularmente.*