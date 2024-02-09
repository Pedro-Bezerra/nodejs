const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const urlEncoded = new URLSearchParams(fd).toString();

    fetch('http://localhost:3000/paratodosverem/formulario', {
        method: "POST",
        body: urlEncoded,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        }
    });
})


function selecionar() {
    const categoria = document.getElementById('select');
    const codigo = document.querySelector('.secao-principal_secao-fom_codigo-letra');
    codigo.value = categoria.value[0].toUpperCase();
}

