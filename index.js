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
            previsao_retorno
        }
    );

});


function validarCPF(strCPF) {

    strCPF = strCPF.replace(/[^\d]+/g, '');
    if (strCPF == '') return false;
    if (strCPF.length != 11) return false;
    // Elimina CNPJs invalidos conhecidos
    if (strCPF == "00000000000" ||
        strCPF == "11111111111" ||
        strCPF == "22222222222" ||
        strCPF == "33333333333" ||
        strCPF == "44444444444" ||
        strCPF == "55555555555" ||
        strCPF == "66666666666" ||
        strCPF == "77777777777" ||
        strCPF == "88888888888" ||
        strCPF == "99999999999") return false;

    var Soma;
    var Resto;
    Soma = 0;

    for (var i = 1; i <= 9; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11)) {
        Resto = 0;
    }
    if (Resto != parseInt(strCPF.substring(9, 10))) {
        return false;
    }

    Soma = 0;

    for (var i = 1; i <= 10; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11)) {
        Resto = 0;
    }
    if (Resto != parseInt(strCPF.substring(10, 11))) {
        return false;
    }
    return true;
}

function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '') return false;
    if (cnpj.length != 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999") return false;

    // Valida DVs
    var tamanho = cnpj.length - 2;
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (var i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) {
        return false;
    }

    return true;
}


app.get('/api/validardocumento', (req, res) => {

    const tipo = req.query.tipo;
    const documento = req.query.documento;
    var documento_valido = false;
    var message = "";

    if (tipo) {
        if (tipo === 'cpf') {
            if (documento) {
                documento_valido = validarCPF(documento);
                if (documento_valido) {
                    message = 'CPF válido'
                } else {
                    message = 'CPF inválido'
                }
            } else {
                message = 'CPF não informado'
            }
        } else {
            if (tipo === 'cnpj') {
                if (documento) {
                    documento_valido = validarCNPJ(documento);
                    if (documento_valido) {
                        message = 'CNPJ válido'
                    } else {
                        message = 'CNPJ inválido'
                    }
                } else {
                    message = 'CNPJ não informado'
                }
            } else {
                message = "Tipo de documento inválido"
            }
        }
    } else {
        message = "Tipo de documento não informado"
    }

    res.json(
        {
            tipo,
            documento,
            documento_valido,
            message
        }
    );

});


app.listen(PORT, HOST);