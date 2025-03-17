# Projeto Next.js com Supabase

Este é um projeto Next.js que utiliza Supabase como backend e várias bibliotecas modernas para uma experiência de desenvolvimento robusta.

## 🚀 Requisitos

- Node.js 18.x ou superior
- PNPM (gerenciador de pacotes)
- Uma conta no Supabase

## 📦 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd [NOME_DO_DIRETÓRIO]
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

## 🎮 Comandos Disponíveis

- Iniciar o servidor de desenvolvimento:
```bash
pnpm dev
```

- Construir o projeto para produção:
```bash
pnpm build
```

- Iniciar o servidor de produção:
```bash
pnpm start
```

- Executar o linter:
```bash
pnpm lint
```

## 🛠️ Tecnologias Principais

- Next.js 15.1.0
- React 19
- Supabase
- TailwindCSS
- TypeScript
- Radix UI (componentes de interface)
- React Hook Form
- Zod (validação)

## 📝 Estrutura do Projeto

```
├── app/           # Páginas e rotas da aplicação
├── components/    # Componentes reutilizáveis
├── hooks/         # Custom hooks
├── lib/          # Utilitários e configurações
├── public/       # Arquivos estáticos
├── styles/       # Estilos globais
└── scripts/      # Scripts utilitários
```

## 🌐 Acesso Local

Após iniciar o servidor de desenvolvimento, o projeto estará disponível em:

```
http://localhost:3000
```

## 📚 Documentação Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs) 