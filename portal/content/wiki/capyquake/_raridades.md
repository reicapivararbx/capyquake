# Conquistas e raridades

As conquistas registram desafios, descobertas e momentos especiais alcançados pelos jogadores no universo Capy.

No portal, a **raridade** de uma conquista é calculada pelo percentual de jogadores que a desbloquearam entre os elegíveis:

```
jogadores que desbloquearam ÷ jogadores elegíveis × 100
```

A classificação abaixo é a regra oficial do Portal Capy. A função `getAchievementRarity(rate)` centraliza essa lógica — não duplicar em componentes.

## Níveis de raridade das conquistas

| Raridade | Percentual | Significado |
|---|---:|---|
| **Brinde** | 90% a 100% | Dada a quase todos que acessam ou fazem a ação básica inicial |
| **Moleza** | 80% a 89,99% | Exige pouco esforço ou poucos minutos de jogo |
| **Fácil** | 50% a 79,99% | Simples de conseguir, geralmente por tarefas básicas |
| **Moderado** | 30% a 49,99% | Exige algum foco ou concluir objetivos iniciais |
| **Desafiador** | 20% a 29,99% | Exige esforço real, habilidade ou conhecimento do jogo |
| **Difícil** | 10% a 19,99% | Exige prática, paciência ou superar obstáculo mais complicado |
| **Extremo** | 5% a 9,99% | Apenas uma parcela pequena dos jogadores consegue |
| **Insano** | 1% a 4,99% | Reservado para desafios difíceis, segredos raros ou marcos altos |
| **Lendário** | 0% a 0,99% | O mais raro; feitos excepcionalmente difíceis ou segredos muito raros |

## Importância da raridade

A raridade comunica dificuldade e exclusividade **com base em dados reais**, não em rótulos fixos inventados. Quando o percentual puder ser calculado a partir da API, o portal deve preferir o valor dinâmico.

Enquanto estatísticas globais de unlock não estiverem expostas pela API, o catálogo do portal mostra as conquistas documentadas na wiki do Capyquake sem inventar percentuais falsos de produção.

## Onde ver suas conquistas

1. Abra o perfil no portal (avatar na barra superior).
2. Ou entre no hub do Capyquake, onde o progresso de conta fica sincronizado.
3. Consulte também a página [Conquistas](/wiki/capyquake/conquistas) para a lista completa documentada.

## Exemplo

Se **143** de **20.428** jogadores elegíveis desbloquearam uma conquista:

```
143 / 20.428 × 100 ≈ 0,70% → Lendário
```
