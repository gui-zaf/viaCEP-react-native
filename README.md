### Problemas no Snack com emulador Android e problemas de migração de ambiente
Baseado na análise do código, não identifiquei problemas específicos que impeçam o funcionamento no Android, mas o Snack desconecta do emulador, algo que não acontece no emulador web e iOS.

Sobre os erros de tipagem:
- Ocorrem por conta da migração de ambientes; Eu não inicio um projeto direto pelo Snack, mas sim pelo Cursor (editor de código como o VScode). Caso haja alguma dúvida, por favor, entre em contato comigo para que eu a esclareça.

## ViaCEP App

Um aplicativo React Native para consultar, cadastrar e gerenciar endereços usando a API ViaCEP.

### Funcionalidades

#### 1. Cadastro de Usuários
- Permite cadastrar usuários com nome, CEP e endereço completo
- Validação automática de CEP pela API ViaCEP
- Preenchimento automático dos campos de endereço após validação do CEP
- Tratamento de erros:
  - Validação de CEP inválido (formato incorreto)
  - Tratamento quando o CEP não é encontrado
  - Validação de campos obrigatórios

#### 2. Pesquisa de Usuários
- Busca de usuários por nome
- Interface amigável para exibição dos resultados
- Tratamento de erros:
  - Feedback quando nenhum usuário é encontrado
  - Normalização de texto para busca (remove acentos, converte para minúsculas)

#### 3. Listagem de Usuários
- Exibe todos os usuários cadastrados
- Ordenação por data de cadastro (mais recentes primeiro)
- Navegação para detalhes do usuário

#### 4. Detalhes do Usuário
- Visualização detalhada das informações do usuário
- Opção para excluir usuário
- Tratamento de erros:
  - Feedback quando o usuário não existe ou foi removido

### Armazenamento de Dados
- Dados persistidos localmente usando AsyncStorage
- Estrutura de dados organizada para facilitar buscas e atualizações

### Tratamento de Erros
- Validação de CEP antes da consulta à API
- Feedback visual para o usuário em caso de erros
- Logs de erro para facilitar depuração
- Tratamento de exceções em todas as operações críticas

### Compatibilidade
- Desenvolvido com React Native e Expo
- Compatível com iOS e Android
- Interface adaptativa utilizando SafeAreaProvider
- Suporte a diferentes tamanhos de tela

### Dependências Principais
- React Native 0.79.2
- Expo 53.0.9
- React Navigation 7
- React Native Paper 5.14.5
- AsyncStorage para persistência de dados

### API Externa
- Integração com a API ViaCEP (https://viacep.com.br) para consulta de endereços por CEP
