# **App Name**: Converse

## Core Features:

- Transcrição de Áudio em Tempo Real: Transcreve a fala do usuário a partir da entrada de áudio em tempo real usando CMU Sphinx4.
- Correção Gramatical e Feedback: Corrige erros gramaticais no texto transcrito e fornece feedback detalhado usando LanguageTool.
- Geração de Resposta Contextual: Gera respostas contextuais com base no texto transcrito ou inserido usando um módulo NLP local (OpenNLP/Stanford NLP). As respostas dependerão das informações que o LLM usa como uma ferramenta para raciocinar com o histórico da conversa e suas informações locais configuradas.
- Saída de Texto para Voz: Sintetiza a resposta da IA em áudio falado usando FreeTTS.
- Histórico da Conversa: Armazena e recupera o histórico da conversa para manter o contexto entre as interações usando SQLite.
- API REST: Fornece endpoints da API REST para processamento de áudio e texto e acesso ao histórico da conversa.
- Entrada de Voz e Texto: Permite que os usuários interajam por meio de voz (captura de áudio via WebRTC) e entrada de texto.

## Style Guidelines:

- Cor primária: Violeta profundo (#673AB7) para refletir uma sensação de inteligência.
- Cor de fundo: Violeta acinzentado claro (#EDE7F6). É visivelmente do mesmo matiz da cor primária, mas fortemente dessaturado.
- Cor de destaque: Azul-violeta (#3F51B5), criando contraste e destacando os principais elementos da IU.
- Fonte do corpo e do título: 'Inter', um sans-serif de estilo grotesco, garantirá uma aparência moderna e neutra, boa tanto para títulos quanto para texto do corpo.
- Use ícones simples e claros para representar ações e feedback, garantindo a usabilidade.
- Projete um layout responsivo otimizado para dispositivos desktop e móveis, com foco na legibilidade e facilidade de uso.
- Implemente animações sutis para fornecer feedback sobre as ações do usuário e os estados de carregamento, melhorando a experiência geral do usuário.