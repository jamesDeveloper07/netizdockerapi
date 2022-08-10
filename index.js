const express = require('express');
const moment = require('moment-timezone');

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello Netiz: Venha ser feliz com a gente!');
});


app.get('/api/validarhorario/comercial', (req, res) => {

    let dtNow = moment().tz("America/Maceio");
    let dtNowStr = dtNow.format("YYYY-MM-DD");
    let dtInicio = moment.tz(dtNowStr + " 08:00:00", "America/Maceio");
    let dtFim = moment.tz(dtNowStr + " 17:59:59", "America/Maceio");

    let dia = dtNow.day();
    let diaName = '';
    let diaValido;

    let horaStr = dtNow.format("HH");
    let horaInt = parseInt(horaStr);
    let horaValida;

    if (dia && dia > 0) {
        diaValido = true;

        if (dia == 6) {
            if (horaInt && horaInt > 7 && horaInt < 12) {
                horaValida = true;
            } else {
                horaValida = false;
            }
        } else {
            if (horaInt && horaInt > 7 && horaInt < 18) {
                horaValida = true;
            } else {
                horaValida = false;
            }
        }

    } else {
        diaValido = false;
        horaValida = false;
    }

    switch (dia) {
        case 0:
            diaName = 'Domingo';
            break;
        case 1:
            diaName = 'Segunda-Feira';
            break;
        case 2:
            diaName = 'Terça-Feira';
            break;
        case 3:
            diaName = 'Quarta-Feira';
            break;
        case 4:
            diaName = 'Quinta-Feira';
            break;
        case 5:
            diaName = 'Sexta-Feira';
            break;
        case 6:
            diaName = 'Sábado';
            break;
        default:
            diaName = "";
    }



    res.json(
        {
            data_atual: dtNow.format("DD/MM/YYYY HH:mm:ss"),
            data_inicio: dtInicio.format("DD/MM/YYYY HH:mm:ss"),
            data_fim: dtFim.format("DD/MM/YYYY HH:mm:ss"),
            dia_semana_atual: diaName,
            hora_atual: horaInt,
            //dia_valido: !!diaValido,
            //hora_valida: !!horaValida,
            dentro_do_horario: (!!diaValido && !!horaValida)
        }
    );

});


app.get('/api/validarsinistro', (req, res) => {

    //variáveis de teste;
    //devem ser parametrizadas em um banco de dados e não no código.
    let sinistro = false;
    //let descricao = 'Está ocorrendo uma manutenção no nosso sistema, com previsão de finalização para as próximas 4 horas';
    let descricao = '';
    let previsao_retorno = null

    res.json(
        {
            sinistro,
            descricao,
            previsao
        }
    );

});

app.listen(PORT, HOST);