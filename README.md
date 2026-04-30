InstaClone - Frontend

Este é o frontend do projeto InstaClone, uma Single Page Application (SPA) desenvolvida em Vue.js 3
que simula as funcionalidades principais do Instagram. O projeto utiliza **Pinia** para gerenciamento de estado e Axios
para consumo de API.

Tecnologias utilizadas

* Vue 3 (Composition API) - Framework principal.
* Vite - Build tool e servidor de desenvolvimento ultra-rápido.
* Pinia - Gerenciamento de estado global (Stores).
* Vue Router - Navegação entre páginas e guards de segurança.
* Axios - Cliente HTTP com interceptores para autenticação JWT.
* Docker - Conteinerização da aplicação.

Como Executar o Projeto

1. Clonar o Repositório

SSH - git clone git@github.com:D4viiAssis/projeto-final.git
HTTPS - git clone https://github.com/D4viiAssis/projeto-final.git

2. Entrar na pasta do projeto

cd projeto-final

3. Subir o ambiente com Docker

Certifique-se de que o Docker está rodando e execute:
docker compose up -d

4. Acessar a aplicação

Acesse no seu navegador:
http://localhost:3000
