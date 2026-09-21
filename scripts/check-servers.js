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

        console.log(
            `Consultando ${servidor.ip}:${servidor.port}...`
        );


        const resposta = await Gamedig.query({

            type: "counterstrike16",

            host: servidor.ip,

            port: servidor.port,

            socketTimeout: 10000

        });


        console.log(
            `Resposta ${servidor.port}:`,
            JSON.stringify(resposta, null, 2)
        );


        /*
         * Se o GameDig respondeu, o servidor está ONLINE.
         */

        const jogadores =
            Array.isArray(resposta.players)
                ? resposta.players.length
                : Number(
                    resposta.raw?.numplayers ??
                    resposta.numplayers ??
                    0
                );


        const maxplayers =
            Number(
                resposta.maxplayers ??
                resposta.raw?.maxplayers ??
                32
            );


        const mapa =
            resposta.map ??
            resposta.raw?.map ??
            resposta.raw?.mapname ??
            "-";


        const hostname =
            resposta.name ??
            resposta.hostname ??
            resposta.raw?.hostname ??
            servidor.nome;


        return {

            nome: servidor.nome,

            ip: servidor.ip,

            port: servidor.port,

            online: true,

            players: jogadores,

            maxplayers: maxplayers,

            map: mapa,

            hostname: hostname,

            atualizado: new Date().toISOString()

        };


    } catch (erro) {

        console.log(
            `ERRO ao consultar ${servidor.ip}:${servidor.port}`
        );

        console.log(
            erro.message || erro
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

        const resultado =
            await consultarServidor(servidor);

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


    console.log(
        "STATUS FINAL:"
    );


    console.log(
        JSON.stringify(
            arquivo,
            null,
            2
        )
    );

}


main();
