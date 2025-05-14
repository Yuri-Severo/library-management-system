# 📚 Sistema de Gestão de Biblioteca - CESUPA

Este projeto foi desenvolvido como parte da disciplina de **Engenharia de Software** e tem como objetivo modernizar o controle da biblioteca do CESUPA. Atualmente, os processos são manuais e baseados em planilhas, o que causa perda de dados e lentidão no atendimento. Nosso sistema oferece uma solução robusta com backend, frontend e testes automatizados para garantir eficiência, escalabilidade e confiabilidade.

## 🚀 Tecnologias Utilizadas

- **Next.js** – Interface web e integração com backend
- **Express** – Backend em Node.js com rotas e controllers
- **TypeScript** – Tipagem estática para maior robustez do código
- **Zod** – Validação de dados de entrada
- **Jest** – Testes unitários e de integração
- **Git + Git Flow** – Organização e versionamento do código

---

## 🧩 Funcionalidades Implementadas (Casos de Uso)

1. **Cadastrar Novo Usuário**  
2. **Consultar Dados de Usuário**  
3. **Atualizar Dados de Usuário**  
4. **Inativar Cadastro de Usuário**  
5. **Registro de Empréstimo**  

Cada caso de uso inclui:
- Validações com Zod
- Regras de negócio aplicadas
- Testes unitários com Jest
- Pelo menos 1 teste de integração com banco de dados por caso de uso

---

## 🧪 Testes

A cobertura de testes abrange:
- ✅ Testes unitários de cada funcionalidade
- 🔄 Testes de integração conectando as rotas com o banco de dados
- 💡 Validações com Zod garantem segurança de entrada antes do processamento

Para executar os testes:

```bash
pnpm run test
```

---

## 🌱 Tutorial de Desenvolvimento com Git Flow

Para garantir a organização e estabilidade do código em equipe, utilizamos o modelo **Git Flow**, um fluxo de trabalho eficiente para projetos colaborativos.

### 🔧 Branches principais

| Branch | Função |
|--------|--------|
| `master` | Código estável em produção |
| `develop` | Integração contínua de funcionalidades para o próximo release |

### 🌿 Branches de suporte

| Tipo       | Criada a partir de | Mergida em | Convenção |
|------------|--------------------|------------|-----------|
| `feature/*` | `develop`           | `develop`  | feature/login-form |
| `release/*` | `develop`           | `master` e `develop` | release/1.0.0 |
| `hotfix/*`  | `master`            | `master` e `develop` | hotfix/user-crash |

---

### 🛠️ Comandos úteis

#### 1. Criar nova feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature
```

#### 2. Finalizar uma feature
```bash
git checkout develop
git merge feature/nome-da-feature
git push origin develop
```

#### 3. Criar nova release
```bash
git checkout develop
git checkout -b release/1.0.0
```

Após ajustes finais:
```bash
git checkout master
git merge release/1.0.0
git tag -a v1.0.0 -m "Primeira versão estável"
git push origin master --tags

git checkout develop
git merge release/1.0.0
```

#### 4. Criar hotfix (ex: erro em produção)
```bash
git checkout master
git checkout -b hotfix/corrige-bug
```

Após corrigir:
```bash
git checkout master
git merge hotfix/corrige-bug
git tag -a v1.0.1 -m "Correção urgente"
git push origin master --tags

git checkout develop
git merge hotfix/corrige-bug
```

---

## 🗂️ Organização do Projeto

```
📁 src
 ┣ 📁 controllers
 ┣ 📁 routes
 ┣ 📁 services
 ┣ 📁 schemas         # Zod schemas
 ┣ 📁 tests
 ┣ 📁 database
 ┗ 📁 utils
```

---

## 🛠️ Instalação e Execução

```bash
git clone https://github.com/Yuri-Severo/library-management-system.git
cd library-management-system
pnpm install
pnpm run dev
```

Acesse via navegador: `http://localhost:3000`

---

## 📆 Apresentação

🗓️ **Data:** 30/05/2025  
🏫 **Local:** Sala de aula do CESUPA  
📊 **Avaliação:** Até **5 pontos** + **1 ponto extra** (testes de integração adicionais)

---

## 👨‍💻 Equipe

- Adler Castro
- Elissandra Abdon
- Renan Abreu
- Luiz Neto
- Yuri Severo

---

> Projeto acadêmico desenvolvido com fins educacionais – CESUPA 2025.