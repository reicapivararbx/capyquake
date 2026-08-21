<div align="center">

# 🔥 CAPIQUAKE

**A Grande Caçada**

Sobreviva. Evolua. Domine.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge)](https://developer.mozilla.org/pt-BR/docs/Web/API/WebSocket)

</div>

---

## 🎮 Sobre o Jogo

**Capiquake** é um jogo 3D de arena de combate com capivaras. Lute contra ondas crescentes de inimigos, compre armas e habilidades na loja, desbloqueie conquistas e enfrente o boss final em cada mapa.

### ⚔️ Funcionalidades

- **⚔️ Combate em Arena** — Armas corpo a corpo e à distância com mecânicas de recoil
- **🛒 Loja Completa** — Armas, armaduras, boosts, skins, encantamentos e habilidades especiais
- **🏆 216 Conquistas** — 8 raridades de Common a Cursed com sistema de progresso
- **👥 Multiplayer** — Partidas online com até 6 jogadores via WebSocket
- **🗺️ 3 Mapas** — Castelo, Floresta e Caverna, cada um com boss final
- **💰 Economia** — Tokens e Reais (R$) com sistema de troca

---

## 📸 Screenshots

<div align="center">

### Menu Principal
<img src="assets/templates/menu.png" alt="Menu Principal" width="800">

### Gameplay
<img src="assets/templates/gameplay.png" alt="Gameplay" width="800">

### Loja
<img src="assets/templates/shop.png" alt="Loja" width="800">

### Conquistas
<img src="assets/templates/achievements.png" alt="Conquistas" width="800">

### Multiplayer
<img src="assets/templates/multiplayer.png" alt="Multiplayer" width="800">

### Banner Promocional
<img src="assets/templates/banner.png" alt="Banner" width="800">

</div>

---

## 🎯 Como Jogar

### Controles

| Ação | Tecla |
|------|-------|
| Mover | W, A, S, D |
| Olhar | Mouse |
| Atirar | Click Esquerdo |
| Correr | Shift |
| Pular | Espaço |
| Trocar Arma | 1-5 |
| Loja | Tab |
| Pausar | Escape |

### Modos de Jogo

- **Singleplayer** — Lute contra ondas de inimigos e enfrente o boss final
- **Multiplayer** — Compita contra outros jogadores em partidas online
- **Modo Teste** — Teste armas e mecânicas sem restrições

---

## 🛠️ Stack Técnica

| Tecnologia | Uso |
|------------|-----|
| **Three.js** | Motor 3D, renderização, física |
| **WebSocket** | Multiplayer online em tempo real |
| **HTML5/CSS3** | UI, menus, HUD |
| **Vanilla JavaScript** | Lógica do jogo, sem frameworks |
| **Node.js** | Servidor multiplayer |

---

## 🚀 Como Executar

### Requisitos

- [Node.js](https://nodejs.org/) 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/reicapivararbx/capyquake.git
cd capyquake

# Instale as dependências (apenas para o servidor multiplayer)
npm install

# Execute o servidor
node server/index.js
```

### Jogando

1. Abra `index.html` no navegador
2. Digite seu nome e selecione um modo de jogo
3. Sobreviva às ondas e enfrente os boss!

---

## 📁 Estrutura do Projeto

```
capyquake/
├── index.html          # Arquivo principal do jogo
├── style.css           # Estilos do jogo
├── server/
│   └── index.js        # Servidor multiplayer (WebSocket)
├── src/
│   ├── main.js         # Inicialização e loop do jogo
│   ├── player.js       # Lógica do jogador
│   ├── enemy.js        # Sistema de inimigos
│   ├── weapons.js      # Armas e projéteis
│   ├── maps.js         # Mapas e terreno
│   ├── shop.js         # Loja e inventário
│   ├── hud.js          # Interface do usuário
│   ├── achievements.js # Sistema de conquistas
│   ├── achievements-data.js # Dados das conquistas
│   └── multiplayer.js  # Lógica multiplayer
├── assets/
│   ├── textures/       # Texturas do jogo
│   ├── models/         # Modelos 3D
│   ├── sounds/         # Efeitos sonoros
│   └── templates/      # Templates HTML para screenshots
│       ├── menu.html
│       ├── gameplay.html
│       ├── shop.html
│       ├── achievements.html
│       ├── multiplayer.html
│       └── banner.html
├── style-guide.md      # Guia de estilo visual
├── ai-prompts.md       # Prompts para geração de imagens com IA
└── gif-spec.md         # Especificação para sequência GIF
```

---

## 🏆 Conquistas

O jogo conta com **216 conquistas** distribuídas em 8 raridades:

| Raridade | Cor | Exemplo |
|----------|-----|---------|
| **COMMON** | ⬜ Cinza | Primeiro Abate, Cinco Ondas |
| **UNCOMMON** | 🟢 Verde | Rico, Colecionador |
| **RARE** | 🔵 Azul | Exterminador, Mestre das Waves |
| **EPIC** | 🟣 Roxo | Lenda Viva |
| **LEGENDARY** | 🟠 Laranja | Mestre das Waves |
| **MYTHIC** | 🔴 Vermelho | Lenda das Armas |
| **DIVINE** | 🟡 Dourado (gradiente) | Conquista Divina |
| **CURSED** | ⬛ Escuro (borda vermelha) | Masoquista |

---

## 🎨 Assets Visuais

O repositório inclui templates HTML/CSS para gerar screenshots autênticas do jogo:

- **`assets/style-guide.md`** — Paleta de cores, tipografia e regras visuais
- **`assets/ai-prompts.md`** — Prompts detalhados para geração de imagens com IA
- **`assets/gif-spec.md`** — Especificação para sequência animada GIF
- **`assets/templates/`** — 6 templates HTML prontos para captura de tela

### Como usar os templates

1. Abra o template desejado em um navegador
2. Use `Ctrl+Shift+S` (Firefox) ou ferramentas de captura para salvar como PNG
3. Tamanho ideal: 1920x1080 (banner, gameplay, multiplayer) ou 1600x900 (menu, shop, conquistas)

---

## 📄 Licença

Este projeto é de uso educacional. Os assets e código são fornecidos "como estão" sem garantias.

---

<div align="center">

Feito com ❤️ e muitas capivaras

</div>
