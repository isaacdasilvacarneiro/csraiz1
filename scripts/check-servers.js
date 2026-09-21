const Gamedig = require("gamedig");
const fs = require("fs");

const servidores = [
    {
        nome: "DE_INFERNO 24/7 | VANILLA",
        ip: "188.220.169.152",
        port: 27029
    },
    {
        nome: "DE_DUST2 24/7 | VANILLA",
        ip: "188.220.169.152",
        port: 27030
    }
];

async function consultarServidor(servidor) {
    try {
        const resposta = await Gamedig.query({
            type: "counterstrike16",
            host: servidor.ip,
            port: servidor.port,
            socketTimeout: 5000
        });

        return {
            nome: servidor.nome,
            ip: servidor.ip,
            port: servidor.port,
            online: true,
            players: resposta.players
                ? resposta.players.length
                : resposta.raw?.numplayers ?? 0,
            maxplayers: resposta.maxplayers ?? 32,
            map: resposta.map ?? "desconhecido",
            hostname: resposta.name ?? servidor.nome,
            atualizado: new Date().toISOString()
        };

    } catch (erro) {
        console.log(
            `${servidor.ip}:${servidor.port} offline ou sem resposta`
        );

        return {
            nome: servidor.nome,
            ip: servidor.ip,
            port: servidor.port,
            online: false,
            players: 0,
            maxplayers: 32,
            map: "-",
            hostname: servidor.nome,
            atualizado: new Date().toISOString()
        };
    }
}

async function main() {
    const resultados = [];

    for (const servidor of servidores) {
        const resultado = await consultarServidor(servidor);
        resultados.push(resultado);
    }

    const arquivo = {
        atualizado: new Date().toISOString(),
        servidores: resultados
    };

    fs.writeFileSync(
        "status.json",
        JSON.stringify(arquivo, null, 2) + "\n"
    );

    console.log(JSON.stringify(arquivo, null, 2));
}

main();
