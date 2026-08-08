import * as THREE from 'three';
import { Audio } from './audio.js';

export class Boss {
  constructor(scene, x, z, arena, bossConfig = {}) {
    this.scene = scene;
    this.arena = arena;
    this.alive = true;
    this.health = bossConfig.health !== undefined ? bossConfig.health : 1000;
    this.maxHealth = bossConfig.maxHealth !== undefined ? bossConfig.maxHealth : 1000;
    this.speed = bossConfig.speed !== undefined ? bossConfig.speed : 10;
    this.chaseSpeed = bossConfig.chaseSpeed !== undefined ? bossConfig.chaseSpeed : 10;
    this.attackDamage = bossConfig.attackDamage !== undefined ? bossConfig.attackDamage : 20;
    this.attackRange = bossConfig.attackRange !== undefined ? bossConfig.attackRange : 12;
    this.attackCooldown = 0;
    this.shootCooldown = 1.5;
    this.meleeRange = 4;
    this.meleeCooldown = 0;
    this.meleeRate = 2.0;
    this.detectionRange = 50;
    this.chasing = true;
    this.wanderDir = new THREE.Vector3(0, 0, 1);
    this.projectiles = [];
    this.minions = [];
    this.minionTimer = 30;
    this.points = bossConfig.points !== undefined ? bossConfig.points : 10;
    this.hitRadius = 3.0;
    this.hitHeight = 2.5;

    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
    scene.add(this.mesh);

    this.speechTimer = 5;
    this.speechBubble = null;
    this.speechVisible = false;
    this.speeches = [
      'Pague seus impostos!',
      'Taxa de respiro!',
      'ICMS ativado!',
      'Imposto sobre imposto!',
      'Nota fiscal, por favor!',
      'Contribuinte detectado!',
      'Aliquota maxima!',
      'Voce deve ao governo!',
      'Tributo obrigatorio!',
      'Multa por atraso!',
      'Declaracao pendente!',
      'Sonegador identificado!',
      'Chegou a hora do Leao!',
      'O caixa do governo agradece!',
      'Pagamento fiscal confirmado!',
      'Sua guia venceu ontem!',
      'Boleto tributario gerado!',
      'Pix para a Receita, agora!',
      'O tributo nao se paga sozinho!',
      'Cofre publico com fome!',
      'Seu debito acabou de crescer!',
      'Arrecadacao em andamento!',
      'Auditoria surpresa!',
      'Fiscal na sua cola!',
      'Malha fina localizada!',
      'Documento irregular!',
      'Recibo suspeito!',
      'Cadastro sob analise!',
      'Patrimonio investigado!',
      'Movimentacao fiscal detectada!',
      'Comprovante rejeitado!',
      'Processo tributario aberto!',
      'Taxa de caminhada!',
      'Imposto de piscada!',
      'Tributo por segundo!',
      'Taxa de sombra!',
      'Imposto de silencio!',
      'Tarifa de coragem!',
      'Cobranca por vitoria!',
      'Pedagio de batalha!',
      'Taxa de mira!',
      'Imposto de recarga!',
      'Seu loot tem dono: o governo!',
      'Drop raro, imposto maior!',
      'Cada moeda gera uma taxa!',
      'Bau aberto, guia emitida!',
      'Upgrade sujeito a tributacao!',
      'Skin nova, tarifa nova!',
      'XP tributavel detectado!',
      'Respawn com taxa adicional!',
      'Revive sem nota fiscal!',
      'Premio liquido: quase nada!',
      'Corra, o boleto corre mais!',
      'Voce nao escapa da Receita!',
      'Nem seu escudo evita impostos!',
      'A multa atravessa armadura!',
      'Seu saldo parece tributavel!',
      'Prepare o bolso!',
      'Hoje tem cobranca em dobro!',
      'Seu lucro chamou minha atencao!',
      'Nada pessoal, apenas tributos!',
      'A Receita sempre encontra voce!',
      'Aliquota reajustada sem aviso!',
      'Juros fiscais acumulando!',
      'Correcao monetaria aplicada!',
      'Vencimento antecipado!',
      'Isencao negada!',
      'Recurso indeferido!',
      'Parcelamento cancelado!',
      'Guia complementar emitida!',
      'Saldo devedor atualizado!',
      'Regularizacao obrigatoria!',
      'Cade o CPF?',
      'Apresente seus comprovantes!',
      'Assine esta declaracao!',
      'Carimbe todas as vias!',
      'Protocolo gerado!',
      'Certidao indisponivel!',
      'Sistema fiscal fora do ar!',
      'Tente pagar novamente!',
      'Dados divergentes!',
      'Declaracao incompleta!',
      'Seu bolso foi auditado!',
      'A burocracia venceu!',
      'Parabens, voce ganhou um imposto!',
      'Promocao: pague duas taxas!',
      'Imposto gratis na primeira compra!',
      'O desconto virou contribuicao!',
      'Seu troco foi retido!',
      'Ate o nada tem aliquota!',
      'Taxamos antes de perguntar!',
      'Sorria para o fiscal!',
      'Golpe fiscal carregado!',
      'Boleto teleguiado!',
      'Rajada de tributos!',
      'Escudo de burocracia!',
      'Combo de cobrancas!',
      'Critico tributario!',
      'Dano fiscal aumentado!',
      'Ataque da malha fina!',
      'Ultimato da Receita!',
      'Fim da isencao!',
      'Cobranca concluida!',
      'Tributo bloqueado? Jamais!',
      'Debito confirmado!',
      'Seu prazo acabou!',
      'Pagamento pendente!',
      'Multa duplicada!',
      'Fiscalizacao maxima!',
      'Imposto inevitavel!',
      'Receita em alerta!',
      'Contribuinte cercado!',
      'Taxa aplicada em seu inventario!',
      'Taxa aplicada em seu equipamento!',
      'Taxa aplicada em seu saldo!',
      'Taxa aplicada em seu premio!',
      'Taxa aplicada em seu bonus!',
      'Taxa aplicada em seu lucro!',
      'Taxa aplicada em seu ouro!',
      'Taxa aplicada em seu bau!',
      'Taxa aplicada em seu escudo!',
      'Taxa aplicada em seu capacete!',
      'Taxa aplicada em seu colete!',
      'Taxa aplicada em seu ataque!',
      'Taxa aplicada em seu combo!',
      'Taxa aplicada em seu dano!',
      'Taxa aplicada em seu revive!',
      'Taxa aplicada em seu respawn!',
      'Taxa aplicada em seu portal!',
      'Taxa aplicada em seu nivel!',
      'Taxa aplicada em seu rank!',
      'Taxa aplicada em seu passe!',
      'Auditoria iniciada em seu inventario!',
      'Auditoria iniciada em seu equipamento!',
      'Auditoria iniciada em seu saldo!',
      'Auditoria iniciada em seu premio!',
      'Auditoria iniciada em seu bonus!',
      'Auditoria iniciada em seu lucro!',
      'Auditoria iniciada em seu ouro!',
      'Auditoria iniciada em seu bau!',
      'Auditoria iniciada em seu escudo!',
      'Auditoria iniciada em seu capacete!',
      'Auditoria iniciada em seu colete!',
      'Auditoria iniciada em seu ataque!',
      'Auditoria iniciada em seu combo!',
      'Auditoria iniciada em seu dano!',
      'Auditoria iniciada em seu revive!',
      'Auditoria iniciada em seu respawn!',
      'Auditoria iniciada em seu portal!',
      'Auditoria iniciada em seu nivel!',
      'Auditoria iniciada em seu rank!',
      'Auditoria iniciada em seu passe!',
      'Cobranca extra em seu inventario!',
      'Cobranca extra em seu equipamento!',
      'Cobranca extra em seu saldo!',
      'Cobranca extra em seu premio!',
      'Cobranca extra em seu bonus!',
      'Cobranca extra em seu lucro!',
      'Cobranca extra em seu ouro!',
      'Cobranca extra em seu bau!',
      'Cobranca extra em seu escudo!',
      'Cobranca extra em seu capacete!',
      'Cobranca extra em seu colete!',
      'Cobranca extra em seu ataque!',
      'Cobranca extra em seu combo!',
      'Cobranca extra em seu dano!',
      'Cobranca extra em seu revive!',
      'Cobranca extra em seu respawn!',
      'Cobranca extra em seu portal!',
      'Cobranca extra em seu nivel!',
      'Cobranca extra em seu rank!',
      'Cobranca extra em seu passe!',
      'Imposto surpresa em seu inventario!',
      'Imposto surpresa em seu equipamento!',
      'Imposto surpresa em seu saldo!',
      'Imposto surpresa em seu premio!',
      'Imposto surpresa em seu bonus!',
      'Imposto surpresa em seu lucro!',
      'Imposto surpresa em seu ouro!',
      'Imposto surpresa em seu bau!',
      'Imposto surpresa em seu escudo!',
      'Imposto surpresa em seu capacete!',
      'Imposto surpresa em seu colete!',
      'Imposto surpresa em seu ataque!',
      'Imposto surpresa em seu combo!',
      'Imposto surpresa em seu dano!',
      'Imposto surpresa em seu revive!',
      'Imposto surpresa em seu respawn!',
      'Imposto surpresa em seu portal!',
      'Imposto surpresa em seu nivel!',
      'Imposto surpresa em seu rank!',
      'Imposto surpresa em seu passe!',
      'Fiscal de olho em seu inventario!',
      'Fiscal de olho em seu equipamento!',
      'Fiscal de olho em seu saldo!',
      'Fiscal de olho em seu premio!',
      'Fiscal de olho em seu bonus!',
      'Fiscal de olho em seu lucro!',
      'Fiscal de olho em seu ouro!',
      'Fiscal de olho em seu bau!',
      'Fiscal de olho em seu escudo!',
      'Fiscal de olho em seu capacete!',
      'Fiscal de olho em seu colete!',
      'Fiscal de olho em seu ataque!',
      'Fiscal de olho em seu combo!',
      'Fiscal de olho em seu dano!',
      'Fiscal de olho em seu revive!',
      'Fiscal de olho em seu respawn!',
      'Fiscal de olho em seu portal!',
      'Fiscal de olho em seu nivel!',
      'Fiscal de olho em seu rank!',
      'Fiscal de olho em seu passe!',
      'Tarifa ativada em seu inventario!',
      'Tarifa ativada em seu equipamento!',
      'Tarifa ativada em seu saldo!',
      'Tarifa ativada em seu premio!',
      'Tarifa ativada em seu bonus!',
      'Tarifa ativada em seu lucro!',
      'Tarifa ativada em seu ouro!',
      'Tarifa ativada em seu bau!',
      'Tarifa ativada em seu escudo!',
      'Tarifa ativada em seu capacete!',
      'Tarifa ativada em seu colete!',
      'Tarifa ativada em seu ataque!',
      'Tarifa ativada em seu combo!',
      'Tarifa ativada em seu dano!',
      'Tarifa ativada em seu revive!',
      'Tarifa ativada em seu respawn!',
      'Tarifa ativada em seu portal!',
      'Tarifa ativada em seu nivel!',
      'Tarifa ativada em seu rank!',
      'Tarifa ativada em seu passe!',
      'Tributo acumulado em seu inventario!',
      'Tributo acumulado em seu equipamento!',
      'Tributo acumulado em seu saldo!',
      'Tributo acumulado em seu premio!',
      'Tributo acumulado em seu bonus!',
      'Tributo acumulado em seu lucro!',
      'Tributo acumulado em seu ouro!',
      'Tributo acumulado em seu bau!',
      'Tributo acumulado em seu escudo!',
      'Tributo acumulado em seu capacete!',
      'Tributo acumulado em seu colete!',
      'Tributo acumulado em seu ataque!',
      'Tributo acumulado em seu combo!',
      'Tributo acumulado em seu dano!',
      'Tributo acumulado em seu revive!',
      'Tributo acumulado em seu respawn!',
      'Tributo acumulado em seu portal!',
      'Tributo acumulado em seu nivel!',
      'Tributo acumulado em seu rank!',
      'Tributo acumulado em seu passe!',
      'Pendencia encontrada em seu inventario!',
      'Pendencia encontrada em seu equipamento!',
      'Pendencia encontrada em seu saldo!',
      'Pendencia encontrada em seu premio!',
      'Pendencia encontrada em seu bonus!',
      'Pendencia encontrada em seu lucro!',
      'Pendencia encontrada em seu ouro!',
      'Pendencia encontrada em seu bau!',
      'Pendencia encontrada em seu escudo!',
      'Pendencia encontrada em seu capacete!',
      'Pendencia encontrada em seu colete!',
      'Pendencia encontrada em seu ataque!',
      'Pendencia encontrada em seu combo!',
      'Pendencia encontrada em seu dano!',
      'Pendencia encontrada em seu revive!',
      'Pendencia encontrada em seu respawn!',
      'Pendencia encontrada em seu portal!',
      'Pendencia encontrada em seu nivel!',
      'Pendencia encontrada em seu rank!',
      'Pendencia encontrada em seu passe!',
      'Multa registrada em seu inventario!',
      'Multa registrada em seu equipamento!',
      'Multa registrada em seu saldo!',
      'Multa registrada em seu premio!',
      'Multa registrada em seu bonus!',
      'Multa registrada em seu lucro!',
      'Multa registrada em seu ouro!',
      'Multa registrada em seu bau!',
      'Multa registrada em seu escudo!',
      'Multa registrada em seu capacete!',
      'Multa registrada em seu colete!',
      'Multa registrada em seu ataque!',
      'Multa registrada em seu combo!',
      'Multa registrada em seu dano!',
      'Multa registrada em seu revive!',
      'Multa registrada em seu respawn!',
      'Multa registrada em seu portal!',
      'Multa registrada em seu nivel!',
      'Multa registrada em seu rank!',
      'Multa registrada em seu passe!',
      'Aliquota elevada em seu inventario!',
      'Aliquota elevada em seu equipamento!',
      'Aliquota elevada em seu saldo!',
      'Aliquota elevada em seu premio!',
      'Aliquota elevada em seu bonus!',
      'Aliquota elevada em seu lucro!',
      'Aliquota elevada em seu ouro!',
      'Aliquota elevada em seu bau!',
      'Aliquota elevada em seu escudo!',
      'Aliquota elevada em seu capacete!',
      'Aliquota elevada em seu colete!',
      'Aliquota elevada em seu ataque!',
      'Aliquota elevada em seu combo!',
      'Aliquota elevada em seu dano!',
      'Aliquota elevada em seu revive!',
      'Aliquota elevada em seu respawn!',
      'Aliquota elevada em seu portal!',
      'Aliquota elevada em seu nivel!',
      'Aliquota elevada em seu rank!',
      'Aliquota elevada em seu passe!',
      'Receita rastreando seu inventario!',
      'Receita rastreando seu equipamento!',
      'Receita rastreando seu saldo!',
      'Receita rastreando seu premio!',
      'Receita rastreando seu bonus!',
      'Receita rastreando seu lucro!',
      'Receita rastreando seu ouro!',
      'Receita rastreando seu bau!',
      'Receita rastreando seu escudo!',
      'Receita rastreando seu capacete!',
      'Receita rastreando seu colete!',
      'Receita rastreando seu ataque!',
      'Receita rastreando seu combo!',
      'Receita rastreando seu dano!',
      'Receita rastreando seu revive!',
      'Receita rastreando seu respawn!',
      'Receita rastreando seu portal!',
      'Receita rastreando seu nivel!',
      'Receita rastreando seu rank!',
      'Receita rastreando seu passe!',
      'Governo taxando seu inventario!',
      'Governo taxando seu equipamento!',
      'Governo taxando seu saldo!',
      'Governo taxando seu premio!',
      'Governo taxando seu bonus!',
      'Governo taxando seu lucro!',
      'Governo taxando seu ouro!',
      'Governo taxando seu bau!',
      'Governo taxando seu escudo!',
      'Governo taxando seu capacete!',
      'Governo taxando seu colete!',
      'Governo taxando seu ataque!',
      'Governo taxando seu combo!',
      'Governo taxando seu dano!',
      'Governo taxando seu revive!',
      'Governo taxando seu respawn!',
      'Governo taxando seu portal!',
      'Governo taxando seu nivel!',
      'Governo taxando seu rank!',
      'Governo taxando seu passe!',
      'Declare seu inventario agora!',
      'Declare seu equipamento agora!',
      'Declare seu saldo agora!',
      'Declare seu premio agora!',
      'Declare seu bonus agora!',
      'Declare seu lucro agora!',
      'Declare seu ouro agora!',
      'Declare seu bau agora!',
      'Declare seu escudo agora!',
      'Declare seu capacete agora!',
      'Declare seu colete agora!',
      'Declare seu ataque agora!',
      'Declare seu combo agora!',
      'Declare seu dano agora!',
      'Declare seu revive agora!',
      'Declare seu respawn agora!',
      'Declare seu portal agora!',
      'Declare seu nivel agora!',
      'Declare seu rank agora!',
      'Declare seu passe agora!',
      'Nota fiscal para seu inventario!',
      'Nota fiscal para seu equipamento!',
      'Nota fiscal para seu saldo!',
      'Nota fiscal para seu premio!',
      'Nota fiscal para seu bonus!',
      'Nota fiscal para seu lucro!',
      'Nota fiscal para seu ouro!',
      'Nota fiscal para seu bau!',
      'Nota fiscal para seu escudo!',
      'Nota fiscal para seu capacete!',
      'Nota fiscal para seu colete!',
      'Nota fiscal para seu ataque!',
      'Nota fiscal para seu combo!',
      'Nota fiscal para seu dano!',
      'Nota fiscal para seu revive!',
      'Nota fiscal para seu respawn!',
      'Nota fiscal para seu portal!',
      'Nota fiscal para seu nivel!',
      'Nota fiscal para seu rank!',
      'Nota fiscal para seu passe!',
      'Debito ligado a seu inventario!',
      'Debito ligado a seu equipamento!',
      'Debito ligado a seu saldo!',
      'Debito ligado a seu premio!',
      'Debito ligado a seu bonus!',
      'Debito ligado a seu lucro!',
      'Debito ligado a seu ouro!',
      'Debito ligado a seu bau!',
      'Debito ligado a seu escudo!',
      'Debito ligado a seu capacete!',
      'Debito ligado a seu colete!',
      'Debito ligado a seu ataque!',
      'Debito ligado a seu combo!',
      'Debito ligado a seu dano!',
      'Debito ligado a seu revive!',
      'Debito ligado a seu respawn!',
      'Debito ligado a seu portal!',
      'Debito ligado a seu nivel!',
      'Debito ligado a seu rank!',
      'Debito ligado a seu passe!',
      'Contribuicao sobre seu inventario!',
      'Contribuicao sobre seu equipamento!',
      'Contribuicao sobre seu saldo!',
      'Contribuicao sobre seu premio!',
      'Contribuicao sobre seu bonus!',
      'Contribuicao sobre seu lucro!',
      'Contribuicao sobre seu ouro!',
      'Contribuicao sobre seu bau!',
      'Contribuicao sobre seu escudo!',
      'Contribuicao sobre seu capacete!',
      'Contribuicao sobre seu colete!',
      'Contribuicao sobre seu ataque!',
      'Contribuicao sobre seu combo!',
      'Contribuicao sobre seu dano!',
      'Contribuicao sobre seu revive!',
      'Contribuicao sobre seu respawn!',
      'Contribuicao sobre seu portal!',
      'Contribuicao sobre seu nivel!',
      'Contribuicao sobre seu rank!',
      'Contribuicao sobre seu passe!',
      'Retencao aplicada a seu inventario!',
      'Retencao aplicada a seu equipamento!',
      'Retencao aplicada a seu saldo!',
      'Retencao aplicada a seu premio!',
      'Retencao aplicada a seu bonus!',
      'Retencao aplicada a seu lucro!',
      'Retencao aplicada a seu ouro!',
      'Retencao aplicada a seu bau!',
      'Retencao aplicada a seu escudo!',
      'Retencao aplicada a seu capacete!',
      'Retencao aplicada a seu colete!',
      'Retencao aplicada a seu ataque!',
      'Retencao aplicada a seu combo!',
      'Retencao aplicada a seu dano!',
      'Retencao aplicada a seu revive!',
      'Retencao aplicada a seu respawn!',
      'Retencao aplicada a seu portal!',
      'Retencao aplicada a seu nivel!',
      'Retencao aplicada a seu rank!',
      'Retencao aplicada a seu passe!',
      'Regularize seu inventario!',
      'Regularize seu equipamento!',
      'Regularize seu saldo!',
      'Regularize seu premio!',
      'Regularize seu bonus!',
      'Regularize seu lucro!',
      'Regularize seu ouro!',
      'Regularize seu bau!',
      'Regularize seu escudo!',
      'Regularize seu capacete!',
      'Regularize seu colete!',
      'Regularize seu ataque!',
      'Regularize seu combo!',
      'Regularize seu dano!',
      'Regularize seu revive!',
      'Regularize seu respawn!',
      'Regularize seu portal!',
      'Regularize seu nivel!',
      'Regularize seu rank!',
      'Regularize seu passe!',
      'Imposto calculado em seu inventario!',
      'Imposto calculado em seu equipamento!',
      'Imposto calculado em seu saldo!',
      'Imposto calculado em seu premio!',
      'Imposto calculado em seu bonus!',
      'Imposto calculado em seu lucro!',
      'Imposto calculado em seu ouro!',
      'Imposto calculado em seu bau!',
      'Imposto calculado em seu escudo!',
      'Imposto calculado em seu capacete!',
      'Imposto calculado em seu colete!',
      'Imposto calculado em seu ataque!',
      'Imposto calculado em seu combo!',
      'Imposto calculado em seu dano!',
      'Imposto calculado em seu revive!',
      'Imposto calculado em seu respawn!',
      'Imposto calculado em seu portal!',
      'Imposto calculado em seu nivel!',
      'Imposto calculado em seu rank!',
      'Imposto calculado em seu passe!',
      'Taxacao automatica em seu inventario!',
      'Taxacao automatica em seu equipamento!',
      'Taxacao automatica em seu saldo!',
      'Taxacao automatica em seu premio!',
      'Taxacao automatica em seu bonus!',
      'Taxacao automatica em seu lucro!',
      'Taxacao automatica em seu ouro!',
      'Taxacao automatica em seu bau!',
      'Taxacao automatica em seu escudo!',
      'Taxacao automatica em seu capacete!',
      'Taxacao automatica em seu colete!',
      'Taxacao automatica em seu ataque!',
      'Taxacao automatica em seu combo!',
      'Taxacao automatica em seu dano!',
      'Taxacao automatica em seu revive!',
      'Taxacao automatica em seu respawn!',
      'Taxacao automatica em seu portal!',
      'Taxacao automatica em seu nivel!',
      'Taxacao automatica em seu rank!',
      'Taxacao automatica em seu passe!'
    ];
  }

  createMesh() {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1a1a3a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 1.2), bodyMat);
    body.position.y = 2.5;
    body.castShadow = true;
    group.add(body);

    const headMat = new THREE.MeshLambertMaterial({ color: 0xddbb88 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), headMat);
    head.position.y = 4.2;
    head.castShadow = true;
    group.add(head);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.18, 4.3, 0.42);
    group.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.18, 4.3, 0.42);
    group.add(eyeR);

    const tieMat = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.1), tieMat);
    tie.position.set(0, 2.8, 0.65);
    group.add(tie);

    const chestMat = new THREE.MeshLambertMaterial({ color: 0xd4af37 });
    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.5, 0.08), chestMat);
    chestPlate.position.set(0, 2.8, 0.59);
    group.add(chestPlate);

    const hatMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.1, 8), hatMat);
    hatBase.position.y = 4.7;
    group.add(hatBase);
    const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 8), hatMat);
    hatTop.position.y = 5.0;
    group.add(hatTop);

    const armMat = new THREE.MeshLambertMaterial({ color: 0x1a1a3a });
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.4), armMat);
    armL.position.set(-1.3, 2.5, 0);
    group.add(armL);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.8, 0.4), armMat);
    armR.position.set(1.3, 2.5, 0);
    group.add(armR);

    const fistL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), armMat);
    fistL.position.set(-1.3, 1.35, 0);
    group.add(fistL);
    const fistR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), armMat);
    fistR.position.set(1.3, 1.35, 0);
    group.add(fistR);

    const legMat = new THREE.MeshLambertMaterial({ color: 0x1a1a2a });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), legMat);
    legL.position.set(-0.4, 0.6, 0);
    group.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.2, 0.5), legMat);
    legR.position.set(0.4, 0.6, 0);
    group.add(legR);

    const briefMat = new THREE.MeshLambertMaterial({ color: 0x3a2a1a });
    const brief = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.3), briefMat);
    brief.position.set(1.5, 1.6, 0);
    group.add(brief);

    const signCanvas = document.createElement('canvas');
    signCanvas.width = 256;
    signCanvas.height = 64;
    const ctx = signCanvas.getContext('2d');
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 22px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('GOVERNO FEDERAL', 128, 40);
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.SpriteMaterial({ map: signTex });
    const sign = new THREE.Sprite(signMat);
    sign.position.y = 5.8;
    sign.scale.set(3, 0.8, 1);
    group.add(sign);

    return group;
  }

  update(delta, playerPos) {
    if (!this.alive) return null;

    this.attackCooldown -= delta;
    this.speechTimer -= delta;

    if (this.speechTimer <= 0) {
      this.showSpeechBubble();
      this.speechTimer = 10;
    }

    if (this.speechBubble) {
      this.speechBubbleLife -= delta;
      if (this.speechBubbleLife <= 0) {
        this.mesh.remove(this.speechBubble);
        this.speechBubble = null;
      }
    }

    this.minionTimer -= delta;
    if (this.minionTimer <= 0) {
      this.minionTimer = 30;
      this.spawnMinions(3);
    }

    for (const m of this.minions) {
      if (!m.alive) continue;
      const mDmg = m.update(delta, playerPos);
      if (mDmg > 0) {
        this.lastHitDamage = (this.lastHitDamage || 0) + mDmg;
      }
    }

    const pos = this.mesh.position;
    const distToPlayer = pos.distanceTo(playerPos);

    const chaseDir = playerPos.clone().sub(pos).normalize();
    chaseDir.y = 0;
    this.wanderDir.copy(chaseDir);

    const speed = this.chaseSpeed;
    const nextX = pos.x + this.wanderDir.x * speed * delta;
    const nextZ = pos.z + this.wanderDir.z * speed * delta;

    if (this.arena && !this.arena.isPassable(nextX, nextZ)) {
      this.wanderDir.negate();
    } else {
      pos.x = nextX;
      pos.z = nextZ;
    }

    const angle = Math.atan2(this.wanderDir.x, this.wanderDir.z);
    this.mesh.rotation.y = angle;
    this.mesh.position.y = Math.sin(performance.now() * 0.003) * 0.1;

    this.updateProjectiles(delta, playerPos);
    this.meleeCooldown -= delta;

    if (distToPlayer < this.meleeRange && this.meleeCooldown <= 0) {
      this.meleeCooldown = this.meleeRate;
      this.lastHitDamage = this.attackDamage;
      this.spawnMeleeHitbox(playerPos);
    } else if (distToPlayer < this.attackRange && this.attackCooldown <= 0) {
      this.attackCooldown = this.shootCooldown;
      this.fireProjectile(playerPos);
    }

    return null;
  }

  fireProjectile(playerPos) {
    const pos = this.mesh.position.clone();
    pos.y = 2.5;
    const dir = playerPos.clone().sub(pos).normalize();

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 64);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, 124, 60);
    ctx.fillStyle = '#cc0000';
    ctx.font = 'bold 18px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('IMPOSTO', 64, 38);
    const tex = new THREE.CanvasTexture(canvas);

    const projGeo = new THREE.PlaneGeometry(1.0, 0.5);
    const projMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const proj = new THREE.Mesh(projGeo, projMat);
    proj.position.copy(pos);
    this.scene.add(proj);

    const trailGeo = new THREE.PlaneGeometry(0.4, 0.2);
    const trailMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
    const trail = new THREE.Mesh(trailGeo, trailMat);
    trail.position.copy(pos);
    this.scene.add(trail);

    this.projectiles.push({
      mesh: proj,
      trail,
      dir,
      speed: 18,
      life: 3
    });

    Audio.gunshot();
  }

  updateProjectiles(delta, playerPos) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.mesh.position.add(p.dir.clone().multiplyScalar(p.speed * delta));
      p.mesh.rotation.z += delta * 3;
      p.trail.position.copy(p.mesh.position).add(p.dir.clone().multiplyScalar(-0.5));
      p.trail.rotation.z = p.mesh.rotation.z;
      p.life -= delta;

      const dist = p.mesh.position.distanceTo(playerPos);
      if (dist < 1.2) {
        this.scene.remove(p.mesh);
        this.scene.remove(p.trail);
        this.projectiles.splice(i, 1);
        this.lastHitDamage = this.attackDamage;
        return;
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.scene.remove(p.trail);
        this.projectiles.splice(i, 1);
      }
    }
    this.lastHitDamage = 0;
  }

  getHitDamage() {
    const d = this.lastHitDamage || 0;
    this.lastHitDamage = 0;
    return d;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
      return true;
    }
    this.flashDamage();
    return false;
  }

  flashDamage() {
    this.mesh.children.forEach(c => {
      if (c.material) {
        const orig = c.material.color.getHex();
        c.material.color.setHex(0xff0000);
        setTimeout(() => c.material.color.setHex(orig), 100);
      }
    });
  }

  spawnMinions(count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 5 + Math.random() * 3;
      const mx = this.mesh.position.x + Math.cos(angle) * dist;
      const mz = this.mesh.position.z + Math.sin(angle) * dist;
      const minion = new Minion(this.scene, mx, mz, this.arena);
      this.minions.push(minion);
    }
  }

  spawnMeleeHitbox(playerPos) {
    const pos = this.mesh.position.clone();
    const dir = playerPos.clone().sub(pos).normalize();
    pos.add(dir.multiplyScalar(2.5));
    pos.y = 1.5;
    const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.4 });
    const hitbox = new THREE.Mesh(geo, mat);
    hitbox.position.copy(pos);
    this.scene.add(hitbox);
    setTimeout(() => {
      this.scene.remove(hitbox);
      geo.dispose();
      mat.dispose();
    }, 300);
  }

  showSpeechBubble() {
    if (this.speechBubble) {
      this.mesh.remove(this.speechBubble);
    }
    const text = this.speeches[Math.floor(Math.random() * this.speeches.length)];
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 60, 12);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(4, 4, 248, 60, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(120, 64);
    ctx.lineTo(128, 78);
    ctx.lineTo(136, 64);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.fillStyle = '#222222';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(text, 128, 42);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex });
    const sprite = new THREE.Sprite(mat);
    sprite.position.y = 7.0;
    sprite.scale.set(4, 1.2, 1);
    this.mesh.add(sprite);
    this.speechBubble = sprite;
    this.speechBubbleLife = 5;
  }

  die() {
    this.alive = false;
    if (this.speechBubble) {
      this.mesh.remove(this.speechBubble);
      this.speechBubble = null;
    }
    for (const p of this.projectiles) {
      this.scene.remove(p.mesh);
      this.scene.remove(p.trail);
    }
    this.projectiles = [];
    for (const m of this.minions) {
      if (m.alive) m.die();
    }
    this.minions = [];
    this.scene.remove(this.mesh);
  }
}

export class MiniBoss extends Boss {
  constructor(scene, x, z, arena) {
    super(scene, x, z, arena, {
      health: 500,
      maxHealth: 500,
      speed: 10,
      chaseSpeed: 10,
      attackDamage: 12,
      points: 5,
      attackRange: 10
    });
    this.mesh.scale.setScalar(0.7);
  }
}

class Minion {
  constructor(scene, x, z, arena) {
    this.scene = scene;
    this.arena = arena;
    this.alive = true;
    this.health = 100;
    this.speed = 10;
    this.attackDamage = 10;
    this.attackRange = 8;
    this.meleeRange = 3;
    this.shootCooldown = 0;
    this.shootRate = 2.5;
    this.meleeCooldown = 0;
    this.meleeRate = 2.5;
    this.hitRadius = 1.0;
    this.hitHeight = 1.5;
    this.projectiles = [];

    this.mesh = this.createMesh();
    this.mesh.position.set(x, 0, z);
    scene.add(this.mesh);
  }

  createMesh() {
    const group = new THREE.Group();
    const suitMat = new THREE.MeshLambertMaterial({ color: 0x2a2a4a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.2, 0.5), suitMat);
    body.position.y = 1.3;
    body.castShadow = true;
    group.add(body);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xddbb88 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), headMat);
    head.position.y = 2.2;
    group.add(head);
    const tieMat = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.05), tieMat);
    tie.position.set(0, 1.5, 0.28);
    group.add(tie);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x2a2a3a });
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), legMat);
    legL.position.set(-0.15, 0.35, 0);
    group.add(legL);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), legMat);
    legR.position.set(0.15, 0.35, 0);
    group.add(legR);

    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 128;
    labelCanvas.height = 32;
    const ctx = labelCanvas.getContext('2d');
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('FISCAL', 64, 22);
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    const labelMat = new THREE.SpriteMaterial({ map: labelTex });
    const label = new THREE.Sprite(labelMat);
    label.position.y = 2.8;
    label.scale.set(1.5, 0.4, 1);
    group.add(label);

    return group;
  }

  update(delta, playerPos) {
    if (!this.alive) return 0;

    this.shootCooldown -= delta;
    this.meleeCooldown -= delta;

    const pos = this.mesh.position;
    const distToPlayer = pos.distanceTo(playerPos);

    const dir = playerPos.clone().sub(pos).normalize();
    dir.y = 0;

    const nextX = pos.x + dir.x * this.speed * delta;
    const nextZ = pos.z + dir.z * this.speed * delta;

    if (this.arena && !this.arena.isPassable(nextX, nextZ)) {
      // blocked
    } else {
      pos.x = nextX;
      pos.z = nextZ;
    }

    const angle = Math.atan2(dir.x, dir.z);
    this.mesh.rotation.y = angle;

    this.updateProjectiles(delta, playerPos);

    let dmg = 0;
    if (distToPlayer < this.meleeRange && this.meleeCooldown <= 0) {
      this.meleeCooldown = this.meleeRate;
      dmg = this.attackDamage;
      this.spawnMeleeHitbox(playerPos);
    } else if (distToPlayer < this.attackRange && this.shootCooldown <= 0) {
      this.shootCooldown = this.shootRate;
      this.fireProjectile(playerPos);
    }

    return dmg;
  }

  fireProjectile(playerPos) {
    const pos = this.mesh.position.clone();
    pos.y = 1.5;
    const dir = playerPos.clone().sub(pos).normalize();

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 64, 32);
    ctx.fillStyle = '#cc0000';
    ctx.font = 'bold 10px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('TAXA', 32, 22);
    const tex = new THREE.CanvasTexture(canvas);

    const projGeo = new THREE.PlaneGeometry(0.6, 0.3);
    const projMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const proj = new THREE.Mesh(projGeo, projMat);
    proj.position.copy(pos);
    this.scene.add(proj);

    this.projectiles.push({ mesh: proj, dir, speed: 14, life: 2.5 });
  }

  updateProjectiles(delta, playerPos) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.mesh.position.add(p.dir.clone().multiplyScalar(p.speed * delta));
      p.mesh.rotation.z += delta * 4;
      p.life -= delta;

      const dist = p.mesh.position.distanceTo(playerPos);
      if (dist < 1.2) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
        this.lastHitDamage = this.attackDamage;
        return;
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }

  spawnMeleeHitbox(playerPos) {
    const pos = this.mesh.position.clone();
    const dir = playerPos.clone().sub(pos).normalize();
    pos.add(dir.multiplyScalar(1.5));
    pos.y = 1.2;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.35 });
    const hitbox = new THREE.Mesh(geo, mat);
    hitbox.position.copy(pos);
    this.scene.add(hitbox);
    setTimeout(() => {
      this.scene.remove(hitbox);
      geo.dispose();
      mat.dispose();
    }, 250);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  die() {
    this.alive = false;
    for (const p of this.projectiles) {
      this.scene.remove(p.mesh);
    }
    this.projectiles = [];
    this.scene.remove(this.mesh);
  }
}
