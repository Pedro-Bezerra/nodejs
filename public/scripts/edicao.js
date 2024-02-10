window.addEventListener('load', () => {
    const categoria = document.getElementById('select');
    const textos = document.getElementsByClassName('secao-principal_form-texto');
    const letra = document.getElementsByClassName('secao-principal_secao-fom_codigo-letra');
    const form = document.getElementsByClassName('secao-principal_secao-form_container');
    categoria.value = localStorage['categoria'];
    textos[0].value = localStorage['nome'];
    textos[1].value = localStorage['responsavel'];
    letra[0].value = localStorage['codigo'][0];
    textos[2].value = localStorage['codigo'].slice(1);
    textos[3].value = localStorage['descricao'];
    form[0].action = window.location.href.slice(-1);

})

function selecionar() {
    const categoria = document.getElementById('select');
    const codigo = document.querySelector('.secao-principal_secao-fom_codigo-letra');
    codigo.value = categoria.value[0].toUpperCase();
}