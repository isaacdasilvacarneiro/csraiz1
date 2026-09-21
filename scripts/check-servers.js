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
    console.log("========================================");
    console.log(`TESTANDO ${servidor.ip}:${servidor.port}`);
    console.log("========================================");

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
        console.log(`RESPOSTA RECEBIDA - ${servidor.port}`);

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
                : Number(
                    resposta.numplayers ||
                    resposta.raw?.numplayers ||
                    0
                );


        const maxplayers =
            Number(
                resposta.maxplayers ||
                resposta.raw?.maxplayers ||
                32
            );


        const mapa =
            resposta.map ||
            resposta.raw?.map ||
            resposta.raw?.mapname ||
            resposta.raw?.mapname ||
            "-";


        const hostname =
            resposta.name ||
            resposta.hostname ||
            resposta.raw?.hostname ||
            servidor.nome;


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

            hostname: hostname,

            erro: null,

            atualizado:
                new Date().toISOString()

        };

    } catch (erro) {

        const mensagem =
            erro?.message ||
            String(erro);


        console.log("");
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(`FALHA - ${servidor.ip}:${servidor.port}`);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        console.log(mensagem);


        if (erro?.stack) {
            console.log(erro.stack);
        }


        return {

            nome: servidor.nome,

            ip: servidor.ip,

            port: servidor.port,

            online: false,

            players: 0,

            maxplayers: 32,

            map: "-",

            hostname: servidor.nome,

            erro: mensagem,

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
    console.log("========================================");
    console.log("STATUS FINAL");
    console.log("========================================");

    console.log(
        JSON.stringify(
            arquivo,
            null,
            2
        )
    );

}


main();
