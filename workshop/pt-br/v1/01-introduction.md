# Introdução e Objetivos

## 🎯 Por que este workshop?

Neste workshop, vamos explorar o potencial do JavaScript/TypeScript e da Inteligência Artificial (A.I) para criar aplicações inovadoras e inteligentes. O objetivo é capacitar você a desenvolver soluções que utilizam A.I de forma eficaz, desde a criação de uma aplicação do zero até a implementação de funcionalidades avançadas.

## O problema que vamos resolver

No mundo atual das redes sociais, criar conteúdo engajador e otimizado é um desafio constate para:

- **Criadores de conteúdo** que precisam manter consistência
- **Profissionais de marketing** que gerenciam múltiplas contas
- **Empreendedores** que querem aumentar sua presença online
- **Desenvolvedores** que querem aprender IA na prática

Nossa solução? Uma ferramenta inteligente que usa IA para gerar conteúdos em microblogos otimizados com o tom certo e hashtags estratégicos.

## 🚀 O que vamos criar?

## Visão geral da aplicação

Vamos criar o Smart Microblog Generator, uma aplicação web e moderna que:

**1. Página inicial atrativa**
  - Hero section com call-to-action
  - Apresentação das features principais
  - Design moderno e responsivo

**2. Página de geração de conteúdo inteligente**
  - Formulário intuitivo com validação em tempo real
  - Seletor visual de tom de voz
  - Preview instantâneo do conteúdo gerado
  - Sistema de cópia com feedback visual

**3. API robusta**
  - Integração com GitHub Models (GPT-4o)
  - Rate limiting para proteção
  - Tratamento de erros detalhado

## Demonstração da aplicação

Aqui está uma visão geral de como será a aplicação:

![Demonstração da aplicação](../../resources/images/demo.gif)

## 🛠️ Tecnologias utilizadas

**1. Next.js 15 com App Router**
  - O que é: Framework React de produção da Vercel
  - Por que usar: 
    - Server Components para melhor performance
    - App Router mais intuitivo pra o Pages Router
    - Otimizações automáticas (imagens, fontes, etc)
    - API Routes integradas
    - Deploy fácil na Vercel. Mas, também suporta outros provedores de nuvem como, AWS, Azure e Google Cloud.

**2. GitHub Models**
  - O que é: Acesso gratuito a modelos de IA através do GitHub
  - Por que usar:
    - Acesso ao inúmeros modelos de IA de última geração, incluso o modelo GPT-4o sem custo.
    - Integração facilitada para projetos pessoais e aprendizado (em estágio de PoCs ou MVPs)
    - Sem necessidade de cartão de crédito (em estágio de PoCs ou MVPs)

**3. TypeScript**
  - O que é: JavaScript com tipagem estática
  - Por que usar:
    - Detecta erros em tempo de desenvolvimento
    - Melhor IntelliSense no Visual Studio Code
    - Documentação automática do código
    - Refatoração mais segura

**4. Tailwind CSS**
  - O que é: Framework CSS utility-first
  - Por que usar:
    - Desenvolvimento rápido de UI
    - Design consistente
    - Responsividade fácil
    - Tamanho otimizado em produção

**5. React Hooks**
  - O que é: Funções para gerenciar estado e efeitos
  - Por que usar: 
    - Código mais limpo e reutilizável
    - Padrão moderno do React
    - Melhor performance
    - Facilita testes

## 📋 Funcionalidades detalhadas

### 1. ✍️ Geração com 3 Tons de Voz

#### Technical (Técnico)

- Linguagem precisa e profissional
- Dados e estatísticas
- Terminologia específica da área
- Exemplo: _"Implementamos uma solução baseada em microserviços que reduziu a latência em 47%..."_

#### Casual (Casual)

- Tom conversacional e amigável
- Linguagem do dia a dia
- Emojis e expressões informais
- Exemplo: _"Cara, você não vai acreditar no que descobri hoje! 🤯"_

#### Motivational (Motivacional)

- Linguagem inspiradora
- Foco em ação e crescimento
- Calls-to-action poderosos
- Exemplo: _"Hoje é o dia perfeito para transformar suas ideias em realidade! 💪"_

### 2. 🏷️ Sugestão de Hashtags Otimizadas

- Análise do conteúdo para extrair temas principais
- Sugestão de 5-7 hashtags relevantes
- Mix de hashtags populares e de nicho
- Formatação automática com #

### 3. 💡 Insights Estratégicos

- Análise do potencial de engajamento
- Sugestões de melhor horário para postar
- Dicas de como melhorar o alcance
- Identificação de tendências relacionadas

### 4. 📋 Sistema Copy-to-Clipboard

- Copy individual (só texto, só hashtags)
- Copy completo (texto + hashtags)
- Feedback visual instantâneo
- Compatível com todos os navegadores modernos e redes sociais

### 5. 🛡️ Rate Limiting e Validação

- Limite de 10 requisições por minuto
- Validação de campos em tempo real
- Mensagens de erro claras
- Proteção contra spam

### 6. 🎨 Interface Responsiva

- Mobile-first design
- Animações suaves
- Acessibilidade (ARIA labels)

## 📚 Pré-requisitos detalhados

### 1. Node.js 18+ Instalado

Verifique se o Node.js está instalado executando o seguinte comando no terminal:

```bash
node -v
```

Se não estiver instalado, você pode baixá-lo em [nodejs.org](https://nodejs.org/).

### 2. Conhecimento básico de React

Nesse workshop se faz necessário ter um entendimento básico de React, incluindo componentes, props e estado. Assim sendo, você deve saber:

- O que são componentes
- Como usar props e state
- Conceito de hooks (useState, useEffect)
- JSX básico

### 3. Conta no GitHub

- Necessária para acessar GitHub Models
- Crie gratuitamente em [github.com](https://github.com/)
- Verifique seu email após criar

### 4. Visual Studio Code (Recomendado)
Baixe em: [code.visualstudio.com](https://code.visualstudio.com/)

- **Extensões recomendadas:**

  - [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradgashler.tailwindcss-intellisense)
  - [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
  - [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

### 5. Conhecimentos Complementares (Não Obrigatórios)

- Git básico: para versionamento
- Terminal/CMD: comandos básicos
- CSS: conceitos fundamentais
- API REST: conceito de requisições HTTP

## 💡 Dicas antes de começar

Antes de iniciar, vale a pena preparar seu ambiente para garantir uma experiência mais tranquila e produtiva. Feche aplicativos que você não vai usar, mantenha o terminal aberto e já deixe o VS Code pronto para codar. Recomendo também criar uma pasta específica para o projeto e deixar este tutorial à mão para consultas rápidas, além de ir fazendo suas próprias anotações conforme avança.

Durante o processo, lembre-se de que erros são parte do caminho e fazem parte do aprendizado. Não hesite em usar o Google para pesquisar soluções e, sempre que pintar uma dúvida, pergunte—ninguém nasce sabendo tudo! Ah, e não se esqueça de comemorar cada pequena conquista ao longo do workshop.

## Pronto para começar?

No próximo módulo, já vamos configurar nosso ambiente de desenvolvimento e obter acesso ao GitHub Models e entender o que é!

Vamos começar a desenvolver algo incrível aqui juntos! 🚀

---

> **Nota**: este workshop será atualizado regularmente. Fique atento às novas sessões e materiais que serão adicionados! Última atualização: Junho de 2025