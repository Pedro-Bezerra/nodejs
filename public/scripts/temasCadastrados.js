function editarLink() {
    const link_leitura = document.querySelectorAll('.secao-principal_link')
    const ids = document.querySelectorAll('.id-tema');
    console.log(link_leitura, ids);
    for (let i = 0; i < link_leitura.length; i++) {
        console.log(link_leitura[i].getAttribute('href') + '/' + ids[i].value);
        link_leitura[i].href += '/' + ids[i].value;
    }

}

        
        