function pressionarLink(id) {
    const container = document.querySelector(id);
    container.innerHTML += 
    `<section class="conteudo-principal_secao-qrcode">
        <h1>COMPARTILHAR</h1>
        <section id="secao-qrcode" class="conteudo-principal_secao-qrcode_botoes">
            <button onclick="gerarQRcode('#secao-qrcode', '#qrcode-data', '.conteudo-principal_secao-qrcode', '.conteudo-principal_secao-qrcode_botoes')" class="conteudo-principal_secao-qrcode_botao"><img class="nav-menu_botao-img" src="../images/qr-code.svg" alt="link">Gerar QR Code</button>
            <button class="conteudo-principal_secao-qrcode_botao"><img class="nav-menu_botao-img" src="../images/link-45deg.svg" alt="link">Copiar link</button>
        </section>
    </section>`;
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
     <button class="conteudo-principal_secao-qrcode_download"><img class="nav-menu_botao-img" src="../images/download.svg" alt="link">DOWNLOAD</button>`;
}

`<button class="conteudo-principal_secao-qrcode_imagem"><img class="nav-menu_botao-qrcode" src="../images/qr-code.svg" alt="link"></button>
 <button class="conteudo-principal_secao-qrcode_download"><img class="nav-menu_botao-img" src="../images/download.svg" alt="link">DOWNLOAD</button>`