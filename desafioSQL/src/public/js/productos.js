
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
    }).then(console.log({formData: formData})).then(res=>res.json()).then(json=>console.log({json: json})).then(socket.emit('newProduct'))
})

socket.on('agregarProducto',data=>{
    console.log(data)
    let productsContainer = document.getElementById('productsContainer');
    const nuevoContenedor = document.createElement('div');
    nuevoContenedor.innerHTML = `<div>
                                    <p>${data.producto}</p>
                                    <p>Precio: ${data.precio}</p>
                                    <img src="http://localhost:8080/img/${data.thumbnail}" alt="">
                                </div>`
    productsContainer.appendChild(nuevoContenedor)
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

socket.on('log',async(data)=>{
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