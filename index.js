const readline = require("readline");
const fs = require("fs");
const Usuario = require("./usuario");
const Evento = require("./evento");

let usuarios = [];
let eventos = [];

//carregar dados de arquivos JSON
function carregarDados() {
    if(fs.existsSync("dados.json")) {
        const dados = JSON.parse(fs.readFileSync("dados.json"));
        usuarios = dados.usuarios.map( u => {
            let user = new Usuario(u.nome, u.email, u.cidade);
            if(u.eventos) {
                user.eventos = u.eventos.map(e => new Evento(e.nome, e.endereco, e.categoria, e.descricao, e.horario));
            }
            return user;
        });
        eventos = dados.eventos.map(e => new Evento(e.nome, e.endereco, e.categoria, e.descricao, e.horario));
    }
}

//Salvar dados
function salvarDados() {
    const dados = {
        usuarios,
        eventos
    };
    fs.writeFileSync("dados.json", JSON.stringify(dados, null, 2));
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menu() {
  console.log("\n--- Sistema de Eventos ---");
  console.log("1 - Cadastrar usuário");
  console.log("2 - Cadastrar evento");
  console.log("3 - Listar eventos");
  console.log("4 - Ordenar eventos por data");
  console.log("5 - Participar de um evento");
  console.log("6 - Cancelar participação");
  console.log("7 - Listar eventos futuros");
  console.log("8 - Listar eventos passados");
  console.log("9 - Listar usuários e seus eventos");
  console.log("0 - Sair");

    rl.question("Escolha: ", opcao => {
    switch (opcao) {
      case "1":
        rl.question("Nome: ", nome => {
          rl.question("Email: ", email => {
            rl.question("Cidade: ", cidade => {
              usuarios.push(new Usuario(nome, email, cidade));
              console.log("Usuário cadastrado!");
              salvarDados();
              menu();
            });
          });
        });
        break;

      case "2":
        rl.question("Nome do evento: ", nomeEvento => {
          rl.question("Endereço: ", endereco => {
            rl.question("Categoria: ", categoria => {
              rl.question("Descrição: ", descricao => {
                rl.question("Data e hora (YYYY-MM-DD HH:mm): ", dataStr => {
                  eventos.push(new Evento(nomeEvento, endereco, categoria, descricao, dataStr));
                  console.log("Evento cadastrado!");
                  salvarDados();
                  menu();
                });
              });
            });
          });
        });
        break;

      case "3":
        eventos.forEach((e, i) => console.log(`${i+1}. ${e.toString()}`));
        menu();
        break;

      case "4":
        eventos.sort((a, b) => a.horario - b.horario);
        console.log("Eventos ordenados!");
        eventos.forEach((e, i) => console.log(`${i+1}. ${e.toString()}`));
        salvarDados();
        menu();
        break;

      case "5":
        if (usuarios.length === 0 || eventos.length === 0) {
          console.log("Cadastre pelo menos um usuário e um evento!");
          return menu();
        }
        console.log("\nUsuários:");
        usuarios.forEach((u, i) => console.log(`${i+1}. ${u.toString()}`));
        rl.question("Escolha o usuário: ", userIndex => {
          let usuario = usuarios[userIndex - 1];
          console.log("\nEventos:");
          eventos.forEach((e, i) => console.log(`${i+1}. ${e.toString()}`));
          rl.question("Escolha o evento: ", eventIndex => {
            let evento = eventos[eventIndex - 1];
            usuario.participar(evento);
            console.log(`${usuario.nome} agora participa de ${evento.nome}`);
            salvarDados();
            menu();
          });
        });
        break;

      case "6":
        console.log("\nUsuários:");
        usuarios.forEach((u, i) => console.log(`${i+1}. ${u.toString()}`));
        rl.question("Escolha o usuário: ", userIndex => {
          let usuario = usuarios[userIndex - 1];
          if (usuario.eventos.length === 0) {
            console.log("Esse usuário não participa de nenhum evento.");
            return menu();
          }
          console.log("\nEventos do usuário:");
          usuario.eventos.forEach((e, i) => console.log(`${i+1}. ${e.toString()}`));
          rl.question("Escolha o evento para cancelar: ", eventIndex => {
            let evento = usuario.eventos[eventIndex - 1];
            usuario.cancelar(evento);
            console.log(`${usuario.nome} cancelou participação em ${evento.nome}`);
            salvarDados();
            menu();
          });
        });
        break;

      case "7":
        let agora = new Date();
        console.log("\n--- Eventos Futuros ---");
        eventos.filter(e => e.horario > agora).forEach(e => console.log(e.toString()));
        menu();
        break;

      case "8":
        agora = new Date();
        console.log("\n--- Eventos Passados ---");
        eventos.filter(e => e.horario < agora).forEach(e => console.log(e.toString()));
        menu();
        break;

      case "9":
        usuarios.forEach(u => {
          console.log(`\n${u.toString()}`);
          if (u.eventos.length > 0) {
            u.eventos.forEach(e => console.log(" - " + e.toString()));
          } else {
            console.log(" - Nenhum evento");
          }
        });
        menu();
        break;

      case "0":
        console.log("Saindo...");
        rl.close();
        break;

      default:
        console.log("Opção inválida!");
        menu();
        break;
    }
  });
}

// Início
carregarDados();
menu();
