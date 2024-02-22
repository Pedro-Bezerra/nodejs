
function pressionarLink(id) {
    const container = document.querySelector(id);
    const containerPrincipal = document.querySelector('.secao-principal');
    container.innerHTML += 
    `<section class="conteudo-principal_secao-qrcode">
        <h1>COMPARTILHAR</h1>
        <section id="secao-qrcode" class="conteudo-principal_secao-qrcode_botoes">
            <button onclick="gerarQRcode('#secao-qrcode', '#qrcode-data', '.conteudo-principal_secao-qrcode', '.conteudo-principal_secao-qrcode_botoes')" class="conteudo-principal_secao-qrcode_botao"><img class="nav-menu_botao-img" src="../../images/qr-code.svg" alt="link">Gerar QR Code</button>
            <button onClick="copiarLink()" class="conteudo-principal_secao-qrcode_botao"><img class="nav-menu_botao-img" src="../../images/link-45deg.svg" alt="link">Copiar link</button>
        </section>
    </section>`;
    //containerPrincipal.style.filter = "blur(6px)";
}

function gerarQRcode(id, idQRCode, class1, class2) {
    const container = document.querySelector(id);
    const classContainerSection = document.querySelector(class1)
    const classContainerSubSection = document.querySelector(class2);
    const qrcode = document.querySelector(idQRCode).value;
    classContainerSection.classList.replace('conteudo-principal_secao-qrcode', 'conteudo-principal_secao-qrcode_atualizado');
    classContainerSubSection.classList.replace('conteudo-principal_secao-qrcode_botoes', 'conteudo-principal_secao-qrcode_botoes-atualizado');
    container.innerHTML = 
    `<button class="conteudo-principal_secao-qrcode_imagem"><img class="nav-menu_botao-qrcode" src="${qrcode}" alt="link"></button>
     <button onClick="fazerDownload()" class="conteudo-principal_secao-qrcode_download"><img class="nav-menu_botao-img" src="../../images/download.svg" alt="link">DOWNLOAD</button>`;
}

function copiarLink() {
    navigator.clipboard.writeText(window.location.href);  
}

function editar() {
    const dados = document.getElementsByClassName('secao-principal_container-input');
    const id = window.location.href.slice(-1);
    const link = document.getElementsByClassName('nav-menu_botao edicao');
    link[0].href += id;
    localStorage["categoria"] = dados[0].value;
    localStorage["nome"] = dados[1].value;
    localStorage["responsavel"] = dados[2].value;
    localStorage["descricao"] = dados[3].value;
    localStorage["codigo"] = dados[4].value;
    console.log(dados);
    console.log(window.location.href.slice(-1));
}


function fazerDownload() {
    const url = document.querySelector('.nav-menu_botao-qrcode').getAttribute('src');
    console.log(url);
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            console.log(blob);
            const href = URL.createObjectURL(blob);
            console.log(href);
            const a = Object.assign(document.createElement("a"), {
                href,
                style: "display:none",
                download: 'qrcode.png',
            });
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(href);
            a.remove();
        })
        .catch(error => {
            console.error('Error fetching the image:', error);
        });
}


function ouvir() {
    const textos = document.querySelectorAll('.secao-principal_container-input');
    const labels = document.querySelectorAll('.secao-principal_container-label');
    const imagem = document.querySelector('#img-audio');
    imagem.setAttribute('src', '../../images/stop-fill.svg');
    adicionarBotaoPausa(); 
    playTexto(montarTexto(labels, textos));
    document.querySelector('#audio').onclick = encerrar;
}

function montarTexto(tema, conteudo) {
    let texto = '';
    for(let i = 0; i < 4; i++) {
        texto += tema[i].textContent;
        texto += conteudo[i].value + ".\n";
    }
    return texto;
}

function playTexto(texto) {
    console.log(texto);
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'pt-br'
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
    utterance.onend = encerrar;
}

function adicionarBotaoPausa() {
    const secao = document.querySelector('.nav-menu_secao-botoes');
    let pausa = document.querySelector('#botao-pausar');
    if (!pausa) {
        secao.innerHTML += `<button id="botao-pausar" class="nav-menu_botao pausar"><img id="img-pausa" class="nav-menu_botao-img" src="../../images/pause-fill.svg" alt="pausar"></button>`
        pausa = document.querySelector('#botao-pausar');
        pausa.onclick = mudarImagem();
    }
}

function mudarImagem() {
    const pausa = document.querySelector('#botao-pausar');
    pausa.addEventListener('click', (e) => {
        const imagem = document.querySelector('#img-pausa');
        if (imagem.getAttribute('src') == '../../images/pause-fill.svg') {
            imagem.setAttribute('src', '../../images/play-fill.svg');
            pausarTexto();
        } else {
            imagem.setAttribute('src', '../../images/pause-fill.svg');
            resumirTexto();
        }
        
    });
}

function pausarTexto() {
    if (speechSynthesis.speaking) {
        speechSynthesis.pause();
    }
}

function resumirTexto() {
    if (speechSynthesis.speaking) {
        speechSynthesis.resume();
    }
}

function encerrar() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    if (document.querySelector('#img-audio').getAttribute('src') === '../../images/stop-fill.svg') {
        document.querySelector('#botao-pausar').remove();
        document.querySelector('#img-audio').setAttribute('src', '../../images/volume-up-fill.svg');  
    }
    document.querySelector('#audio').onclick = ouvir;
}

`<button class="conteudo-principal_secao-qrcode_imagem"><img class="nav-menu_botao-qrcode" src="../images/qr-code.svg" alt="link"></button>
 <button class="conteudo-principal_secao-qrcode_download"><img class="nav-menu_botao-img" src="../images/download.svg" alt="link">DOWNLOAD</button>`