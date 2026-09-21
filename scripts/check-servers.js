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

    console.log("");
    console.log("======================================");
    console.log(`TESTANDO ${servidor.ip}:${servidor.port}`);
    console.log("======================================");

    try {

        const resposta = await Gamedig.query({

            type: "counterstrike16",

            host: servidor.ip,

            port: servidor.port,

            givenPortOnly: true,

            socketTimeout: 15000,

            attemptTimeout: 20000,

            maxAttempts: 3,

            debug: true

        });

        console.log("");
        console.log("RESPOSTA DO GAMEDIG:");

        console.log(
            JSON.stringify(
                resposta,
                null,
                2
            )
        );

        const jogadores =
            Array.isArray(resposta.players)
                ? resposta.players.length
                : Number(resposta.numplayers || 0);

        const maxplayers =
            Number(resposta.maxplayers || 32);

        const mapa =
            resposta.map ||
            resposta.raw?.map ||
            resposta.raw?.mapname ||
            "-";

        console.log("");
        console.log("RESULTADO:");
        console.log(`ONLINE: SIM`);
        console.log(`JOGADORES: ${jogadores}`);
        console.log(`SLOTS: ${maxplayers}`);
        console.log(`MAPA: ${mapa}`);

        return {

            nome: servidor.nome,
            ip: servidor.ip,
            port: servidor.port,

            online: true,

            players: jogadores,

            maxplayers: maxplayers,

            map: mapa,

            hostname:
                resposta.name ||
                servidor.nome,

            ping:
                resposta.ping || null,

            atualizado:
                new Date().toISOString()

        };

    } catch (erro) {

        console.log("");
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log("FALHA NA CONSULTA");
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        console.log(
            erro.stack ||
            erro.message ||
            erro
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

            ping: null,

            erro:
                erro.message ||
                "Falha na consulta UDP",

            atualizado:
                new Date().toISOString()

        };

    }
}


async function main() {

    const resultados = [];

    for (const servidor of servidores) {

        const resultado =
            await consultarServidor(
                servidor
            );

        resultados.push(resultado);
    }

    const arquivo = {

        atualizado:
            new Date().toISOString(),

        servidores:
            resultados

    };

    fs.writeFileSync(

        "status.json",

        JSON.stringify(
            arquivo,
            null,
            2
        ) + "\n"

    );

    console.log("");
    console.log("======================================");
    console.log("STATUS FINAL");
    console.log("======================================");

    console.log(
        JSON.stringify(
            arquivo,
            null,
            2
        )
    );
}


main();
