const URL = "/clientes"

/* =========================
Mostrar mensaje
========================= */

function mostrarMensaje(texto){
document.getElementById("mensaje").innerText = texto
}

/* =========================
Mostrar clientes en tabla
========================= */

function mostrarClientes(clientes){

const tabla = document.getElementById("tablaClientes")
tabla.innerHTML=""

clientes.forEach(c=>{

tabla.innerHTML += `
<tr>
<td>${c.rut}</td>
<td>${c.nombre}</td>
<td>${c.edad}</td>
</tr>
`

})

}

/* =========================
Listar clientes
========================= */

async function listarClientes(){

const res = await fetch(URL)
const data = await res.json()

if(data.ok){
mostrarClientes(data.data)
}

}

/* =========================
Buscar
========================= */

async function buscarClientes(){

const rut = document.getElementById("rutBuscar").value
const nombre = document.getElementById("nombreBuscar").value
const edad = document.getElementById("edadBuscar").value

let query=""

if(rut) query=`?rut=${rut}`
else if(nombre) query=`?nombre=${nombre}`
else if(edad) query=`?edad=${edad}`

const res = await fetch(URL+query)
const data = await res.json()

if(data.ok){
mostrarClientes(data.data)
}else{
mostrarMensaje(data.mensaje)
}

}

/* =========================
Crear cliente
========================= */

async function crearCliente(){

const rut = document.getElementById("rutCrear").value
const nombre = document.getElementById("nombreCrear").value
const edad = document.getElementById("edadCrear").value

const res = await fetch(URL,{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({rut,nombre,edad})
})

const data = await res.json()

if(data.ok){
mostrarMensaje("Cliente creado")
listarClientes()
}else{
mostrarMensaje(data.mensaje)
}

}

/* =========================
Editar
========================= */

async function editarCliente(){

const rut = document.getElementById("rutEditar").value
const nombre = document.getElementById("nombreEditar").value

const res = await fetch(`${URL}/${rut}`,{
method:"PUT",
headers:{'Content-Type':'application/json'},
body:JSON.stringify({nombre})
})

const data = await res.json()

mostrarMensaje(data.mensaje)

if(data.ok){
listarClientes()
}

}

/* =========================
Eliminar
========================= */

async function eliminarCliente(){

const rut = document.getElementById("rutEliminar").value
const nombre = document.getElementById("nombreEliminar").value
const edad = document.getElementById("edadEliminar").value

let query=""

if(rut) query=`?rut=${rut}`
else if(nombre) query=`?nombre=${nombre}`
else if(edad) query=`?edad=${edad}`

const res = await fetch(URL+query,{
method:"DELETE"
})

const data = await res.json()

mostrarMensaje(data.mensaje)

if(data.ok){
listarClientes()
}

}