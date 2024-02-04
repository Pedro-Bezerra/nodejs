const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const urlEncoded = new URLSearchParams(fd).toString();

    fetch('http://localhost:3000/paratodosverem/formulario/upload', {
        method: "POST",
        body: urlEncoded,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        }
    });
})