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
  - Integração com GitHub Models (GPT-5)
  - Rate limiting para proteção
  - Tratamento de erros detalhado

## Demonstração da aplicação

Aqui está uma visão geral de como será a aplicação:

![Demonstração da aplicação](../../resources/images/demo.gif)

## 🛠️ Tecnologias utilizadas

**1. Next.js 15 com App Router**
  - **O que é:** Framework React de produção da Vercel
  - **Por que usar:** 
    - Server Components para melhor performance
    - App Router mais intuitivo pra o Pages Router
    - Otimizações automáticas (imagens, fontes, etc)
    - API Routes integradas
    - Deploy fácil na Vercel. Mas, também suporta outros provedores de nuvem como, AWS, Azure e Google Cloud.

**2. GitHub Models**
  - **O que é:** Acesso gratuito a modelos de IA através do GitHub
  - **Por que usar:**
    - Acesso ao inúmeros modelos de IA de última geração, incluso o modelo GPT-5 sem custo.
    - Integração facilitada para projetos pessoais e aprendizado (em estágio de PoCs ou MVPs)
    - Sem necessidade de cartão de crédito (em estágio de PoCs ou MVPs)

**3. TypeScript**
  - **O que é:** JavaScript com tipagem estática
  - **Por que usar:**
    - Detecta erros em tempo de desenvolvimento
    - Melhor IntelliSense no Visual Studio Code
    - Documentação automática do código
    - Refatoração mais segura

**4. Tailwind CSS**
  - **O que é:** Framework CSS utility-first
  - **Por que usar:**
    - Desenvolvimento rápido de UI
    - Design consistente
    - Responsividade fácil
    - Tamanho otimizado em produção

**5. React Hooks**
  - **O que é:** Funções para gerenciar estado e efeitos
  - **Por que usar:**
    - Código mais limpo e reutilizável
    - Padrão moderno do React
    - Melhor performance
    - Facilita testes

## 📋 Funcionalidades detalhadas

### 1. ✍️ Geração com 3 Tons de Voz

- Technical (Técnico)

  - Linguagem precisa e profissional
  - Dados e estatísticas
  - Terminologia específica da área
  - Exemplo: _"Implementamos uma solução baseada em microserviços que reduziu a latência em 47%..."_

- Casual (Casual)

  - Tom conversacional e amigável
  - Linguagem do dia a dia
  - Emojis e expressões informais
  - Exemplo: _"Cara, você não vai acreditar no que descobri hoje! 🤯"_

- Motivational (Motivacional)

  - Linguagem inspiradora
  - Foco em ação e crescimento
  - Calls-to-action poderosos
  - Exemplo: _"Hoje é o dia perfeito para transformar suas ideias em realidade! 💪"_

### **2. 🏷️ Sugestão de Hashtags Otimizadas**

Uma das maiores dificuldades de quem produz conteúdo é escolher hashtags realmente relevantes para ampliar o alcance do post. Neste projeto, ao gerar o microblog, a IA faz uma análise automática do texto, identifica os principais temas e sugere de 5 a 7 hashtags otimizadas para potencializar o engajamento. 

O algoritmo mistura hashtags populares — aquelas que têm grande alcance — com hashtags de nicho, mais específicas, que ajudam a atingir públicos segmentados. Toda sugestão já vem formatada com o símbolo #, pronta para ser copiada e usada no LinkedIn, Twitter ou Instagram.

**Como isso funciona na prática?**
Sempre que você gerar um microblog, as hashtags aparecerão separadas, facilitando a escolha ou a cópia de todas ao mesmo tempo.

### **3. 💡 Insights Estratégicos**

Mais do que apenas gerar texto, a aplicação também entrega dicas práticas para melhorar sua presença nas redes sociais. A cada microblog, a IA analisa o potencial de engajamento do conteúdo e sugere:

* Melhores horários para publicar (baseado em tendências gerais)
* Dicas para aumentar o alcance da postagem
* Estratégias para engajar mais seguidores
* Indicação de tendências relacionadas ao seu tema

Esses insights aparecem junto ao conteúdo gerado, ajudando você a não só postar, mas postar **melhor**, no momento certo e com maior chance de viralizar.

### **4. 📋 Sistema Copy-to-Clipboard**

A experiência do usuário também é prioridade. Por isso, você pode copiar rapidamente apenas o texto do microblog, apenas as hashtags, ou tudo junto (texto + hashtags) com apenas um clique. Sempre que clicar para copiar, um feedback visual é exibido, confirmando que o conteúdo já está disponível para colar em qualquer rede social, email ou documento. 

Todo o sistema é compatível com navegadores modernos e plataformas sociais, tornando o processo de compartilhar seu microblog rápido, fácil e sem erros.

### **5. 🛡️ Rate Limiting e Validação**

Para garantir que o serviço permaneça rápido e estável para todos, o backend da aplicação limita o número de requisições que cada usuário pode fazer: são permitidas até 10 gerações de microblogs por minuto. Se esse limite for atingido, uma mensagem de erro amigável é mostrada, orientando a aguardar antes de tentar de novo.

Além disso, todos os campos do formulário passam por validação em tempo real. Isso significa que você será avisado imediatamente se esquecer de preencher algum campo obrigatório ou se ultrapassar o limite de caracteres do microblog, evitando frustrações desnecessárias. Essas medidas também protegem o sistema contra spam e uso abusivo.

### **6. 🎨 Interface Responsiva**

A interface do projeto foi pensada para funcionar perfeitamente tanto em computadores quanto em celulares. O design mobile-first garante que todos os botões, formulários e áreas de visualização sejam fáceis de usar em qualquer tela.

Pequenas animações suaves deixam a experiência mais agradável, transmitindo uma sensação de modernidade e profissionalismo.

Por fim, a aplicação segue boas práticas de acessibilidade, com uso de ARIA labels e estrutura semântica adequada, tornando o uso acessível também para pessoas que utilizam leitores de tela ou têm outras necessidades específicas.

## 📚 Pré-requisitos detalhados

Para aproveitar ao máximo este workshop, é importante que você tenha alguns conhecimentos prévios. Aqui estão os principais pré-requisitos:

- Instalação do Node.js
- Conhecimento básico de Git
- Conhecimento básico de React
  - O que são componentes
  - Como usar props e state
  - Conceito de hooks (useState, useEffect)
  - JSX básico
- Conta no GitHub
  - Necessária para acessar GitHub Models
  - Crie gratuitamente em [github.com](https://github.com/)
  - Verifique seu email após criar
- Visual Studio Code
  - Recomendado para desenvolvimento
  - Baixe em: [code.visualstudio.com](https://code.visualstudio.com/)
- Extensões recomendadas
  - [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradgashler.tailwindcss-intellisense)
  - [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
  - [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

## 💡 Dicas antes de começar

Antes de iniciar, vale a pena preparar seu ambiente para garantir uma experiência mais tranquila e produtiva. Feche aplicativos que você não vai usar, mantenha o terminal aberto e já deixe o VS Code pronto para codar. Recomendo também criar uma pasta específica para o projeto e deixar este tutorial à mão para consultas rápidas, além de ir fazendo suas próprias anotações conforme avança.

Durante o processo, lembre-se de que erros são parte do caminho e fazem parte do aprendizado. Não hesite em usar o Google para pesquisar soluções e, sempre que pintar uma dúvida, pergunte—ninguém nasce sabendo tudo! Ah, e não se esqueça de comemorar cada pequena conquista ao longo do workshop.

## Pronto para começar?

No próximo módulo, já vamos configurar nosso ambiente de desenvolvimento e obter acesso ao GitHub Models e entender o que é!

Vamos começar a desenvolver algo incrível aqui juntos! 🚀

---

> **Nota**: este workshop será atualizado regularmente. Fique atento às novas sessões e materiais que serão adicionados! Última atualização: Junho de 2025

**[⬅️ Back: Introdução](./00-initial.md) | **[Next: Configuração do Ambiente de Desenvolvimento & GitHub Models ➡️](./02-configure-environment-gh-models.md)****