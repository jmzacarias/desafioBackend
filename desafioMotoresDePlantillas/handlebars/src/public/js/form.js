const form = document.getElementById('productForm');


form.addEventListener('submit', event=>{
    event.preventDefault();
    const formData = new FormData(form);
    fetch('/api/form',{
        method:'POST',
        body:formData
    }).then(res=>res.json()).then(json=>console.log(json));
})