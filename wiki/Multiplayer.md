# 👥 Multiplayer

Jogue com até **6 jogadores** por partida via lobbies com código. O servidor é o mesmo arquivo que serve o jogo localmente.

## ▶️ Como rodar

```bash
node server/index.js            # porta padrão 8080
PORT=3000 node server/index.js  # porta customizada
```

- Abra `http://localhost:8080` — o console mostra também o IP da rede local para jogar em LAN (`http://SEU-IP:8080`).
- O servidor entrega o build estático (`dist/`) **e** o WebSocket no caminho `/ws`.
- Se o servidor cair durante o lobby, o jogo avisa: *"Servidor Localhost! - Suba ele localmente!"*

## 🎫 Como entrar numa partida

1. Menu → **Multiplayer**
2. **Criar Lobby** → gera um código de **4 letras/números** (sem caracteres ambíguos tipo I/O/0/1)
3. Envie o código pros amigos → eles usam **Entrar** com o código
4. **Só o host** escolhe mapa, modo e número de animais, e inicia a partida

### Regras do lobby

| Regra | Valor |
|---|---|
| Máximo de jogadores | **6** |
| Código do lobby | 4 caracteres |
| Nome do jogador | até 12 caracteres (vira "Anon" se vazio) |
| Host sai? | Host passa automaticamente pro próximo jogador (com aviso no chat) |
| Entrar depois do início | Bloqueado ("Essa partida ja comecou.") |
| Bots injetados no início | UmLegalGaucho, Bot_Mineiro, Bot_Paulista, Bot_Carioca, Bot_Baiano |

## 🔄 O que sincroniza entre jogadores

| Sincronizado ✅ | NÃO sincronizado ❌ |
|---|---|
| Posição e rotação de cada jogador | Vida dos jogadores |
| Placar de abates | Armas e inventário |
| Chat global | Emotes, peido, teleporte |
| Escolha de mapa/modo/animais | Waves individuais dos animais |

Cada jogador remoto aparece como uma capivara 3D própria no seu mundo.

## 💬 Chat

- Mensagens de até 150 caracteres, com limite de **1 mensagem a cada 2 segundos**.
- Ping medido automaticamente a cada 4s e exibido na UI.

## 🔌 Reconexão

Se a conexão cair, o cliente tenta reconectar sozinho após **3 segundos**.

---

> ⚠️ O site público (`github.io`) roda só o front-end — para multiplayer, alguém precisa subir `node server/index.js` (na sua máquina ou num host próprio).
