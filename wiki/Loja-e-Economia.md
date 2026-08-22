# 🛒 Loja e Economia

A loja tem **452 itens divididos em 9 seções**, com duas moedas: **Reais (R$)** e **Tokens**. Compras de armas, armaduras, habilidades etc. são **permanentes**; revives são consumíveis.

## Seções da loja

| Seção | Itens | Moeda | Faixa de preço |
|---|---|---|---|
| 🔫 ARMAS | 52 | R$ | R$ 750 – 50.000 |
| ⚡ BOOSTS | 50 | tokens | 2 – 20 |
| 📦 MUNIÇÕES | 50 | R$ | R$ 58 – 15.000 |
| 🛡️ ARMADURAS COMPLETAS | 50 | R$ | R$ 1.500 – 500.000 |
| ✨ HABILIDADES | 50 | tokens | 3 – 50 |
| 🔮 ENCANTAMENTOS | 50 | tokens | 8 – 100 |
| 👕 SKINS DE JOGADOR | 50 | tokens | 20 – 200 |
| 🎨 SKINS DE ARMAS | 50 | tokens | 30 – 150 |
| ❤️ REVIVES | 50 | R$ | R$ 0 – 250.000 |

### Como comprar funciona
- **Permanente**: armas, armaduras, habilidades, encantamentos, skins e boosts ficam para sempre (salvos no navegador via `localStorage`).
- **Revives são consumíveis**: cada compra adiciona cargas de revive ao seu saldo.
- Armaduras aumentam seu HP máximo nas partidas · munições enchem o pool inicial · habilidades desbloqueiam poderes ativos ([veja controles](Controles-e-Configuracoes.md)).

## 💱 Conversão de moedas

| Conversão | Onde |
|---|---|
| **R$ 1.000 → 1 token** | Botão roxo na loja |
| **1 RT (Rebirth Token) → 1.000.000 tokens** | Painel do Rebirth no menu principal |

## 💰 Como ganhar dinheiro e tokens

| Fonte | Valor |
|---|---|
| Abate de animal | **R$ 81 – 313** (+ chance de 2% de 1–5 tokens) |
| XP por abate | pontos do animal × 10 |
| Bônus de wave completa | XP = 50 + wave × 10 |
| Mini-boss | +R$ 200 e +5 tokens |
| Boss (Governo Federal) | +R$ 500 e +10 tokens |
| Conquistas | R$ 250 a R$ 40.000 + tokens ([lista completa](Conquistas.md)) |

Todos esses valores sofrem o **multiplicador de rebirth** (exponencial — veja abaixo) e modificadores dos [modos de jogo](Modos-de-Jogo.md) (ex.: Dourado ×5, Cacique ×6).

## 🔄 Rebirth

O Rebirth reseta seu progresso em troca de bônus **exponenciais** permanentes.

### Requisitos
Você precisa dos três ao mesmo tempo:
- Nível **≥ 100**
- **≥ 10.000 tokens**
- **≥ R$ 1.000.000**

Ao fazer rebirth: nível, XP, dinheiro e tokens zeram · você ganha **+1 RT** · e todos os multiplicadores sobem.

### Multiplicador exponencial

Cada nível de rebirth eleva o multiplicador ao quadrado:

```
multiplicador(nível) = 2 ^ (2 ^ (nível - 1))
```

| Rebirth | Multiplicador |
|---|---|
| 1 | ×2 |
| 2 | ×4 |
| 3 | ×16 |
| 4 | ×256 |
| 5 | ×65.536 |
| 6 | ×4.294.967.296 😱 |

O multiplicador aplica a: **dinheiro, tokens, XP, dano e HP máximo**. Além disso, cada rebirth dá **+500 balas extras por recarga** de munição.

### RT (Rebirth Token)
- Cada rebirth concede +1 RT, guardado mesmo após reset.
- Troque 1 RT por 1.000.000 tokens no painel de rebirth.
- A conquista secreta [???](Conquistas.md#secreta) também envolve ter a MINIGUN + revives — o combo final do endgame.
