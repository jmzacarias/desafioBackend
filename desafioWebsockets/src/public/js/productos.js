const form = document.getElementById('productForm');

const socket = io({
});

let listaProductos; 

form.addEventListener('submit', event=>{
    event.preventDefault();
    const formData = new FormData(form);
    fetch('/api/productos',{
        method:'POST',
        body:formData
    }).then(console.log({formData: formData})).then(res=>res.json()).then(json=>console.log({json: json})).then(socket.emit('newProduct',formData))
})

socket.on('agregarProducto',data=>{
    let productsContainer = document.getElementById('productsContainer');
    let products = ''
    data.forEach(prod => {
        products = products + `<div>
                                    <p>${prod.producto}</p>
                                    <p>Precio: ${prod.precio}</p>
                                    <img src="http://localhost:8080/img/${prod.thumbnail}" alt="">
                                </div>`
    });
    console.log(products)
    productsContainer.innerHTML = products;
})

let user;



Swal.fire({
    title:'Ingresa tu email',
    input: "text",
    inputValidator: (value)=>{
        return !value && 'Necesitas ingresar tu email'
    },
    allowOutsideClick: false
}).then(result=>{
    user = result.value;
    console.log(user);
})
let chatbox = document.getElementById('chatbox');
chatbox.addEventListener('keyup',evt=>{
    if(evt.key==='Enter'){
        if(chatbox.value.trim().length>0){
            const d_t = new Date();
 
            let year = d_t.getFullYear();
            let month = d_t.getMonth();
            let day = d_t.getDate();
            let hour = d_t.getHours();
            let minute = d_t.getMinutes();
            let seconds = d_t.getSeconds();
            
            socket.emit('message', {user:user, message: chatbox.value, time: `[${day}/${month}/${year} ${hour}:${minute}:${seconds}]`})
        }
    }
})

socket.on('log',data=>{
    let log = document.getElementById('log');
    let messages ='';
    data.forEach(message => {
        messages = messages+ `<div class='contenedorMensaje'><p class='email'>${message.user} </p> <p class='time'>${message.time} </p> <p class='message'>${message.message}</p></div></br>`;
    });
    log.innerHTML = messages;
})
socket.on('newUser', data=>{
    if(user){
        Swal.fire({
            text: `${user} se acaba de conectar`,
            toast:true,
            position:'top-right'
        })
    }
})