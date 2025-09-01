class Usuario {
    constructor(nome, email, cidade) {
        this.nome = nome;
        this.email = email;
        this.cidade = cidade;
        this.eventos = [] // eventos que o usúario participa
    }

    participar(evento) {
        this.eventos.push(evento);
    }

    cancelar(evento) {
        this.eventos = this.eventos.filter(e => e.nome !== evento.nome);
    }

    toString() {
        return `${this.nome} (${this.email}) - ${this.cidade}`;
    }
}

module.exports = Usuario;