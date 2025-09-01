class Evento {
    constructor(nome, endereco, categoria, descricao, horario) {
        this.nome = nome;
        this.endereco = endereco;
        this.categoria = categoria;
        this.descricao = descricao;
        this.horario = new Date(horario);
    }

    toString() {
        return `${this.nome} | ${this.categoria} | ${this.descricao} | ${this.horario}`;
    }
}

module.exports = Evento;