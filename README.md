# Projeto Meu Porão

Esse é um projeto feito em ReactJs, o qual fiz visando aprender a utilizar o Firebase e também para utilizar suas funcionalidades.

## Descrição Do Projeto

O projeto é basicamente um site que permite enviar qualquer tipo de arquivo para um armazenamento na nuvem, além de dar possibilidade de visualizar esses arquivos ou compartilhá-los.

Para permitir que apenas você tenha acesso aos seus arquivos, implementei um sistema de login, que impossibilita que uma pessoa consiga ver ou alterar os arquivos de outras pessoas.

Ao entrar na página principal, você estará possibilitado a enviar os seus arquivos para a nuvem. Ao selecionar e enviar um arquivo, ele será automaticamente direcionada para uma pasta especifica, dependendo da extensão desses arquivo, sendo essas pastas:

+ Documentos: Arquivos do tipo pdf, doc, pptx, entre outros.
+ Imagens: Arquivos do tipo png, jpg, gif, entre outros.
+ Vídeos: Arquivos do tipo mp4, mkv, webm, entre outros.
+ Áudios: Arquivos do tipo mp3, wav, ogg, entre outros.
+ Geral: Todos os arquivos que não tiveram suas extensões definidas no código virão para essa pasta.

Cada arquivo terá 3 botões, que dão possibilidade de excluir, compartilhar(copiar o link do arquivo) e ver/baixar o arquivo.

### Bibliotecas Utilizadas

+ Chakra
+ Firebase
+ React Router

#### Firebase

A biblioteca mais importante desse site foi o Firebase, responsável por disponibilizar o armazenamento em nuvem e o acesso a ele. Além do armazenamento, outra funcionalidade nativa do Firebase que utilizei foi o sistema de autenticação, que por ser bem completo e seguro, resolvi utilizá-lo. Além disso, ele foi o principal motivo de ter iniciado esse projeto, pois queria aprender a usá-lo para um projeto que pretendo fazer, então resolvi criar esse site para pegar o jeito.

#### Chakra

Um amigo havia me falado sobre essa biblioteca, e acabei me interessando por ela. Não esperava que utilizá-la faria muita diferença no início do site, mas acabou que ela me ajudou muito, pois já havia vários componentes nela que ficaram perfeitos no site. Um dos exemplos desses componentes é o acordeon que utilizei para exibir os itens das pastas.

#### React Router

Utilizei essa biblioteca para fazer a paginação do site.

## Como Utilizar O Projeto

Ao baixar o projeto, execute o comando `npm install` para instalar as dependências, e o comando `npm run dev` para rodar o projeto.

## Considerações Finais

Gostei bastante de fazer esse projeto, pois além de ter me trazido bastante conhecimento sobre as bibliotecas que utilizei, ainda me proveu uma ferramenta que farei questão de utilizar, que é o próprio site.

Mesmo assim, ainda não finalizei o projeto, pois pretendo fazer algumas melhorias, como: otimizar o carregamento das listas, melhorar um poucos mais a responsividade do site, já que ela ficou muito simples e, por último, permitir criar as suas próprias pastas, o que eu acredito que melhoraria muito a usabilidade do site.
