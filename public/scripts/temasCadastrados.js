const socket = new WebSocket('ws://localhost:3000/paratodosverem/principal');

socket.addEventListener('open', (e) => {
    console.log('Olá, servidor!');
})

socket.addEventListener('message', (e) => {
    console.log('Mensagem do servidor: ', e.data);
})

function editarLink() {
    const link_leitura = document.querySelectorAll('.secao-principal_link')
    const ids = document.querySelectorAll('.id-tema');
    console.log(link_leitura, ids);
    for (let i = 0; i < link_leitura.length; i++) {
        console.log(link_leitura[i].getAttribute('href') + '/' + ids[i].value);
        link_leitura[i].href += '/' + ids[i].value;
    }

}

const remover = e => {
    const botao = e.currentTarget;
    const codigo = botao.parentElement.previousElementSibling.previousElementSibling.textContent;
    const grandparent = botao.parentElement.parentElement;
    const inputId = grandparent.nextElementSibling;
    grandparent.remove();
    inputId.remove();
    console.log(codigo);
    enviarMensagem(codigo);
}

const enviarMensagem = (mensagem) => {
    socket.send(mensagem);
}

        
        