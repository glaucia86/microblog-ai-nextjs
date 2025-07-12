# Estrutura base e Tipagem e Criando os primeiros Componentes Reutilizáveis

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
  topic: string;              // Tópico sobre o qual gerar conteúdo
  toneOfVoice: ToneOfVoice;   // Tom de voz selecionado
  keywords: string;           // Palavras-chave opcionais
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

## Próximos Passos

Vamos continuar avançando no desenvolvimento da nossa aplicação, criando mais componentes reutilizáveis e integrando a lógica de geração de conteúdo com IA.

**[⬅️ Back: Criando o Projeto Base do Microblog A.I com Next.js](./03-initial-project-nextjs.md) | [Next: Sessão 05 ➡️](./05-session.md)**
