# 🎯 Quiz JSON Generator

Um gerador de JSON para quizzes interativos com visualização em tempo real, inspirado no design Apple.

## ✨ Funcionalidades

### 🎮 **Editor Completo**
- **Perguntas e Respostas**: Adicione quantas perguntas quiser
- **Configuração de Cores**: Personalize cores dos botões e progresso
- **Formulário de Inscrição**: Configure campos opcionais
- **Seletor de Idiomas**: 6 idiomas disponíveis (EN, PT, IT, ES, DE, FR)

### 👁️ **Visualização em Tempo Real**
- **Preview do Quiz**: Veja como ficará o quiz em tempo real
- **3 Telas Diferentes**: Questions, Loading, Form
- **Navegação Intuitiva**: Clique nas opções para avançar
- **Cores Dinâmicas**: Aplicadas instantaneamente

### 🌍 **Suporte Multi-idioma**
- **6 Idiomas**: English, Portuguese, Italian, Spanish, German, French
- **Preenchimento Automático**: Placeholders e footnotes traduzidos
- **Interface Intuitiva**: Dropdown simples para seleção

### 🎨 **Design Moderno**
- **Apple-inspired**: Design limpo e minimalista
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Layout de 2 Colunas**: Editor à esquerda, preview à direita
- **Animações Suaves**: Transições elegantes

## 🚀 Como Usar

1. **Abra o arquivo** `index.html` no seu navegador
2. **Selecione o idioma** desejado
3. **Adicione perguntas** clicando em "Add Question"
4. **Configure as cores** dos botões e progresso
5. **Ative o formulário** de inscrição se necessário
6. **Visualize em tempo real** no preview à direita
7. **Gere o JSON** clicando em "Generate JSON"

## 📁 Estrutura do Projeto

```
cowbuilder/
├── index.html          # Interface principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── README.md           # Documentação
└── .gitignore          # Arquivos ignorados pelo Git
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, animações
- **JavaScript ES6+**: Funcionalidades interativas
- **Git**: Controle de versão

## 📋 Estrutura do JSON Gerado

```json
{
  "footnote": "View ad to continue",
  "questions": [
    {
      "question": "When do you need the money?",
      "options": ["Today", "Within 3 days", "Within a week"],
      "isLoading": false
    },
    {
      "question": "Looking for trusted loan providers...",
      "options": [],
      "isLoading": true
    }
  ],
  "buttonColor": "#1D4ED8",
  "progressColor": "#1D4ED8",
  "buttonTextColor": "#ffffff",
  "subscribeForm": {
    "cta": "View offers →",
    "headline": "We found offers",
    "show_name": true,
    "show_email": false,
    "show_phone": true,
    "name_placeholder": "Your name",
    "email_placeholder": "Your email",
    "phone_placeholder": "Your phone"
  }
}
```

## 🌟 Características Especiais

### 🎯 **Navegação Inteligente**
- **Perguntas normais**: Mostram opções e permitem navegação
- **Perguntas de loading**: Exibidas como tela de carregamento
- **Progress bar**: Calculada apenas com perguntas normais

### 🎨 **Personalização Completa**
- **Cores dinâmicas**: Aplicadas em tempo real
- **Formulário opcional**: Ative/desative conforme necessário
- **Campos configuráveis**: Mostre/esconda campos do form

### 📱 **Responsividade**
- **Desktop**: Layout de 2 colunas
- **Tablet**: Layout adaptativo
- **Mobile**: Layout de 1 coluna

## 🔧 Desenvolvimento

Para contribuir com o projeto:

1. **Clone o repositório**
2. **Faça suas alterações**
3. **Teste localmente** abrindo `index.html`
4. **Commit suas mudanças**
5. **Push para o repositório**

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Adicionar novos idiomas
- Melhorar a documentação

---

**Desenvolvido com ❤️ para criar quizzes interativos de forma simples e elegante!** 