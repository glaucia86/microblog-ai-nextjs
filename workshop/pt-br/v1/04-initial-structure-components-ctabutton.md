# Estrutura base com Tipagem e Criando os primeiros Componentes Reutilizáveis

Nessa sessão, vamos estabelecer a estrutura fundamental da nossa aplicação **Smart Microblog Generator**. Começaremos definindo os tipos TypeScript que garantirão a consistência dos dados, configuraremos o layout principal da aplicação e criaremos nosso primeiro componente reutilizável. Isso nos permitirá construir uma base sólida para a aplicação, facilitando a adição de novas funcionalidades no futuro.

E, também criaremos o nosso primeiro componente reutilizável, o `CTAButton`, que será usado em várias partes da aplicação. Esse componente demonstrará como criar botões estilizados e interativos com Tailwind CSS.

Vamos nessa?! 

## Definindo a tipagem TypeScript

TypeScript nos ajuda a capturar erros antes mesmo de executar o código, além de fornecer autocomplete inteligente e documentação viva do nosso código. Para uma aplicação que integra IA, ter tipos bem definidos é muito importante, pois garante que os dados que estamos manipulando estejam sempre no formato esperado.


### Criando o arquivo de tipos

Primeiro, vamos criar o arquivo `src/types/index.ts` que centralizará todas as definições de tipos da nossa aplicação.

<details><summary><b>src/app/globals.css</b></summary>
<br/>

```typescript
export interface GeneratedContent {
  mainContent: string;    // O texto principal do microblog
  hashtags: string[];     // Array de hashtags sugeridas
  insights: string[];     // Insights e dicas relacionadas ao conteúdo
}

// Interface para o estado do formulário de geração
export interface FormState {
  topic: string;                        // Tópico sobre o qual gerar conteúdo
  toneOfVoice: ToneOfVoice | string;    // Tom de voz selecionado
  keywords: string;                     // Palavras-chave opcionais
}

// Interface genérica para respostas da API
export interface ApiResponse<T> {
  success: boolean;    // Indica se a operação foi bem-sucedida
  data?: T;           // Dados retornados (quando success = true)
  error?: string;     // Mensagem de erro (quando success = false)
}

// Interface específica para requisições de geração
export interface GenerateApiRequest {
  topic: string;       // Tópico obrigatório
  tone: string;        // Tom de voz
  keywords?: string;   // Palavras-chave opcionais
}

// Interface específica para respostas de geração
export interface GenerateApiResponse {
  success: boolean;
  content?: GeneratedContent;  // Conteúdo gerado pela IA
  error?: string;
}

```

</details>
<br/>

### 💡 Explicação Detalhada

#### 1. `ToneOfVoice` Type Union

```typescript
export type ToneOfVoice = "friendly" | "professional" | "casual" | "inspirational";
```

- Usamos um _union type_ para limitar as opções de tom de voz
- Isso previne erros de digitação e garante consistência
- O TypeScript irá sugerir apenas essas três opções no autocomplete

#### 2. `GeneratedContent` Interface

```typescript
export interface GeneratedContent {
  mainContent: string;    // O texto principal do microblog
  hashtags: string[];     // Array de hashtags sugeridas
  insights: string[];     // Insights e dicas relacionadas ao conteúdo
}
```

- Define exatamente o que esperamos receber da IA
- `hashtags` e `insights` são arrays, facilitando iteração na UI
- Todos os campos são obrigatórios (sem `?`)

#### 3. Padrão `ApiResponse` Genérico

```typescript
export interface ApiResponse<T> {
  success: boolean;    // Indica se a operação foi bem-sucedida
  data?: T;           // Dados retornados (quando success = true)
  error?: string;     // Mensagem de erro (quando success = false)
}
```

- Interface genérica que pode ser reutilizada para qualquer resposta de API
- Uso do generic `<T>` permite tipagem flexível
- Campos opcionais `(?)` para data e error baseados no contexto

## Configurando o Layout Principal

### Entendendo o Layout no Next.js

O arquivo `layout.tsx` é especial no Next.js desde a versão 13+. Pois, ele define a estrutura base que envolve todas as páginas da aplicação, incluindo metadados SEO, fontes e estilos globais.

### Implementando o Root Layout

Vamos criar o arquivo `src/app/layout.tsx` que servirá como o layout principal da nossa aplicação. Este layout incluirá a fonte personalizada e os estilos globais.

<details><summary><b>src/app/layout.tsx</b></summary>
<br/>

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configuração da fonte Inter do Google Fonts
const inter = Inter({ 
  subsets: ["latin"],           // Subconjunto de caracteres
  variable: "--font-inter",     // Variável CSS customizada
});

// Metadados da aplicação para SEO
export const metadata: Metadata = {
  title: "Smart Microblog Generator | Create Impactful Contents with AI",
  description: "Transform your ideas into engaging microblogs with AI. Generate optimized social media content with different tones of voice and trend-based insights.",
  
  // Palavras-chave para otimização de busca
  keywords: [
    "microblogging",
    "AI content generation", 
    "social media",
    "content creation",
    "smart microblog",
    "AI writing assistant",
    "content optimization",
    "engaging content",
    "social media strategy",
  ],
  
  // Informações sobre o autor
  authors: [{ 
    name: "Glaucia Lemos", 
    url: "https://www.youtube.com/@GlauciaLemos" 
  }],
  
  // Metadados para redes sociais (Open Graph)
  openGraph: {
    title: "Smart Microblog Generator",
    description: "Transform your ideas into engaging microblogs with AI.",
    type: "website",
  },
};

// Componente de layout principal
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
```

</details>
<br/>

### 🔍 Análise Detalhada do Layout

#### 1. Configuração de Fonte

```tsx
const inter = Inter({ 
  subsets: ["latin"],           // Subconjunto de caracteres
  variable: "--font-inter",     // Variável CSS customizada
});
```

- `Inter` é uma fonte moderna e legível, ideal para aplicações web
- `subsets: ["latin"]` otimiza o carregamento incluindo apenas caracteres necessários
- `variable: "--font-inter"` cria uma variável CSS que pode ser usada no Tailwind

#### 2. Metadados SEO:

```tsx
export const metadata: Metadata = {
  title: "Smart Microblog Generator | Create Impactful Contents with AI",
  // ...
};
```

- O `title` aparece na aba do navegador e resultados de busca
- `description` é crucial para SEO e aparece em resultados de busca
- `keywords` ajudam motores de busca a entender o conteúdo
- `openGraph` otimiza compartilhamento em redes sociais

#### 3. Estrutura HTML

```tsx
return (
  <html lang="en" className={inter.variable}>
    <body className="antialiased">
      {children}
    </body>
  </html>
);
```

- `lang="en"` define o idioma para acessibilidade
- `className={inter.variable}` aplica nossa fonte customizada
- `antialiased` suaviza o texto para melhor legibilidade
- `{children}` é onde as páginas serão renderizadas

## Criando o componente `CTAButton`

### Conceitos de Design System

Um bom design system começa com componentes base reutilizáveis. Nosso `CTAButton` demonstra como criar componentes flexíveis com variações de estilo.

### Implementando o `CTAButton`

Crie o arquivo `src/app/components/CTAButton.tsx` e adicione o seguinte código:

<details><summary><b>src/app/components/CTAButton.tsx</b></summary>
<br/>

```tsx
import Link from "next/link";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
}: CTAButtonProps) {
  const baseClasses = 'inline-flex items-center px-8 py-4 text-lg font-medium rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group';

  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    secondary: 'text-gray-700 bg-gray-200 hover:bg-gray-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
  }

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <span>{children}</span>
      <svg
        className='w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M13 7l5 5m0 0l-5 5m5-5H6'
      />
      </svg>
    </Link>
  );
}
```

</details>
<br/>

### 🎨 Detalhamento do Design do Componente

#### 1. Interface TypeScript

```tsx
interface CTAButtonProps {
  href: string;                // URL para onde o botão deve redirecionar
  children: React.ReactNode;   // Conteúdo do botão (texto ou ícones)
  variant?: 'primary' | 'secondary'; // Tipo de botão, padrão é 'primary'
}
```

- `href`: é obrigatório para navegação
- `children`: permite conteúdo flexível (texto, ícones, etc.)
- `variant`: é opcional com valor padrão

#### 2. Sistema de Classes CSS

```tsx
const baseClasses = `
  inline-flex items-center px-8 py-4 text-lg font-medium 
  rounded-full shadow-lg transition-all duration-300 
  transform hover:-translate-y-0.5 group
`;
```

- `inline-flex items-center`: alinha conteúdo horizontalmente
- `px-8 py-4`: define padding adequado para toque/clique
- `rounded-full`: cria bordas totalmente arredondadas
- `transform hover:-translate-y-0.5`: adiciona efeito lift ao hover
- `group`: permite animações coordenadas entre elementos filho

#### 3. Variações de Estilo

```tsx
const variantClasses = {
  primary: "text-white bg-blue-600 hover:bg-blue-700...",
  secondary: "text-gray-700 bg-gray-200 hover:bg-gray-300..."
};
```

- Cada variação tem seu próprio conjunto de cores
- Estados de hover são pré-definidos
- Estados de focus incluem rings para acessibilidade

#### 4. Animação da Seta

```tsx
<svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200">
```

- `group-hover:translate-x-1`: move a seta quando o botão recebe hover
- `transition-transform duration-200`: suaviza a animação
- O ícone é SVG inline para máximo controle

## Criando a página Principal (Home Page)

### Conceitos de Landing Page Eficaz

Uma landing page bem construída é fundamental para converter visitantes em usuários. Nossa homepage seguirá a estrutura clássica: **Hero Section** (impacto inicial), **Features Section** (demonstração de valor) e **CTA Final** (chamada para ação).

### Implementando a Home Page

Agora vamos criar nossa página principal em `src/app/page.tsx`. Este arquivo será automaticamente servido como a rota raiz (/) da nossa aplicação:

<details><summary><b>src/app/page.tsx</b></summary>
<br/>

```tsx
import { SparklesIcon } from "@heroicons/react/16/solid";
import { 
  ChatBubbleBottomCenterTextIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";
import CTAButton from "./components/CTAButton";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

const features: Feature[] = [
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: "Smart Insights",
    description: "Trend analysis and optimized hashtag suggestions to maximize your reach and engagement.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: <ChatBubbleBottomCenterTextIcon className='w-6 h-6' />,
    title: 'Adaptive Tone of Voice',
    description: 'Choose between technical, casual, or motivational tones to effectively reach your target audience.',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    icon: <ArrowsRightLeftIcon className='w-6 h-6' />,
    title: 'Multiple Variations',
    description: 'Generate different versions of your content to find the perfect approach for your message.',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
];

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300'>
      {/* Hero Section */}
      <section className='px-4 pt-24 pb-20 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='max-w-3xl mx-auto text-center space-y-8'>
          <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl'>
            <span className='block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200'>
              Smart Microblog
            </span>
            <span className='block text-blue-600 dark:text-blue-500'>
              Generator & Insights
            </span>
          </h1>
          <p className='mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-300'>
            Transform your ideas into impactful social media content. Maximize
            your reach with AI-optimized posts powered by GitHub Models.
          </p>
          <div className='mt-8'>
            <CTAButton href='/generate'>Get Started</CTAButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white dark:bg-gray-800 transition-colors duration-300'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
              Powerful Features
            </h2>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3 mt-16'>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.bgColor} rounded-2xl p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className={`rounded-lg bg-white dark:bg-gray-800 p-3 ${feature.iconColor}`}>
                    {feature.icon}
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                    {feature.title}
                  </h3>
                </div>
                <p className='text-gray-600 dark:text-gray-300'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white mb-8'>
            Ready to create impactful content?
          </h2>
          <CTAButton href='/generate'>Start For Free</CTAButton>
        </div>
      </section>
    </div>
  );
}
```

</details>
<br/>

### 🎨 Análise Detalhada da Implementação

#### 1. 1. Sistema de Ícones com `Heroicons`

```tsx
import { SparklesIcon } from "@heroicons/react/16/solid";
import { 
  ChatBubbleBottomCenterTextIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";
```

- **Por que Heroicons?**
  - **Consistência visual:** Todos os ícones seguem o mesmo estilo de design
  - **Duas variações:** solid (preenchidos) e outline (contorno)
  - **Tamanhos otimizados:** 16px para ícones pequenos, 24px para médios
  - **SVG nativo:** Escaláveis e performáticos
  - **Desenvolvido pela Tailwind:** Integração perfeita com as classes CSS

#### 2. Interface Feature e Tipagem Estruturada

```tsx
interface Feature {
  icon: React.ReactNode;    
  title: string;           
  description: string;     
  bgColor: string;         
  iconColor: string;       
}
```

- **Benefícios desta estrutura:**
  - **Reutilização:** Facilita a adição de novas funcionalidades
  - **Consistência:** Garante que todos os cards tenham a mesma estrutura
  - **Manutenibilidade:** Centralizamos os dados em um local
  - **Type Safety:** TypeScript previne erros de propriedades


#### 3. Array de Features com Design System

```tsx
const features: Feature[] = [
  {
    icon: <SparklesIcon className="w-6 h-6" />,
    title: "Smart Insights",
    description: "Trend analysis and optimized hashtag suggestions...",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  // ...
];
```

- **Padrão de Cores Sistemático:**

  - Feature 1 (Insights): Azul - associado à inteligência e tecnologia
  - Feature 2 (Tom de Voz): Roxo - associado à criatividade e comunicação
  - Feature 3 (Variações): Verde - associado ao crescimento e sucesso

- **Suporte ao Dark Mode:**

  - Cada cor tem variação para tema escuro (dark:)
  - Opacidade reduzida (/20) para fundos sutis no dark mode
  - Cores mais claras para ícones no dark mode

#### 4. Estratégias de Design

- **Padding responsivo:** px-4 sm:px-6 lg:px-8 adapta espaçamento por tela
- **Espaçamento vertical:** pt-24 pb-20 cria respiração adequada
- **Largura máxima:** max-w-7xl previne linhas muito longas em telas grandes
- **Centralização:** mx-auto text-center foca atenção no conteúdo

Agora abre o terminal e execute o comando:

```bash
npm run dev
```

Abra o navegador e acesse `http://localhost:3000` para ver a página inicial em ação.

![Home Page](../../resources/images/home-page.png)

Legal, não é mesmo? Temos uma página inicial funcional com um layout responsivo e estilizado, além de um componente reutilizável `CTAButton` que pode ser usado em várias partes da aplicação.

Vamos agora fazer alguns exercícios?

## 🧪 Exercícios Práticos Avançados

### 1. **Adicione Animações de Entrada**

Implemente animações staggered para os cards de features:

```tsx
// Dica: Use transition delays baseados no index
className={`... transition-all duration-300 delay-${index * 100}`}
```

### 2. Crie uma Quarta Feature

Adicione uma nova funcionalidade ao array:

```tsx
{
  icon: </* Escolha um ícone apropriado */>,
  title: "Analytics Dashboard",
  description: "Track performance metrics...",
  bgColor: "bg-orange-50 dark:bg-orange-900/20",
  iconColor: "text-orange-600 dark:text-orange-400",
}
```

### 3. Implemente Scroll Smooth

Adicione navegação suave entre seções:

```tsx
// Adicione IDs nas seções e modifique os CTAButtons
<section id="features" className="...">
<CTAButton href="#features">Learn More</CTAButton>
```

### 4. Adicione Métricas Visuais

Inclua uma seção com números impressionantes:

```tsx
const stats = [
  { number: "10K+", label: "Posts Generated" },
  { number: "95%", label: "Engagement Increase" },
  { number: "500+", label: "Happy Users" }
];
```

> **💡 Dica Pro:** Sempre teste sua landing page em dispositivos reais e diferentes condições de rede para garantir uma experiência consistente!


## Próximos Passos

Na **Sessão 05 - Integração com a Inteligência Artificial e GitHub Models**, mergulharemos no coração da nossa aplicação. Você aprenderá a:

- **Integrar o GitHub Models** em sua aplicação Next.js, aproveitando modelos de IA de última geração gratuitamente
- **Criar um serviço robusto de IA** com padrões profissionais de retry logic e tratamento de erros
- **Desenvolver prompts eficazes** para diferentes tons de voz (técnico, casual, motivacional)
- **Implementar validação multicamadas** para garantir qualidade e consistência das respostas
- **Aplicar o padrão Singleton**

**[⬅️ Back: Criando o Projeto Base do Microblog A.I com Next.js](./03-initial-project-nextjs.md) | [Next: Sessão 05 ➡️](./05-integration-with-ai.md)**
