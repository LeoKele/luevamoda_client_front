
const formNuevoGasto = document.getElementById('agregarClientes');

formNuevoGasto.addEventListener("submit", async (event) => {
  event.preventDefault();

    // guardamos los labels de mensajes de error
    var errorNombre = document.getElementById("mensajeNombre");
    var errorTelefono = document.getElementById("mensajeTelefono");
    var errorMail = document.getElementById("mensajeMail");

  function limpiarMensajes() {
    errorNombre.textContent = "";
    errorTelefono.textContent = "";
    errorMail.textContent = "";
  }
  limpiarMensajes();

  //* Validacion simple del form
  //Obtengo los valores de los campos
  const formData = new FormData(formNuevoGasto);
  //Obtengo los valores de los inputs
  const id = formData.get("id");
  const nombre = formData.get("nombre");
  const telefono = formData.get("telefono");
  const mail = formData.get("mail");

  //validamos los inputs
  const nombreValido = stringVacio(nombre);
  const telefonoValido = stringVacio(telefono);
  const mailValido = stringVacio(mail);

  if (nombreValido || telefonoValido || mailValido) {
    errorNombre.textContent = !nombreValido
    ? ""
    : "Por favor, completa este campo";
    errorTelefono.textContent = !telefonoValido
    ? ""
    : "Por favor, completa este campo";
    errorMail.textContent = !mailValido
    ? ""
    : "Por favor, completa este campo";
    return;
  }



  let url = "http://localhost:8080/api_lueva/clientes";
  let method = 'POST';

  const clienteData = {
    nombre: nombre,
    telefono: telefono,
    mail: mail
  };

  if (id){
    clienteData.id = id;
    method = 'PUT';

  }
  //Configuramos para la peticion 
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clienteData)
  };


  try {
    const response = await fetch(url,options);
    if (!response.ok){
        
        const errorText = await response.text(); // Obtener el texto del error
        throw new Error(errorText || 'Error al guardar el cliente');
    }
    const responseData = await response.json();
    if (method === 'POST'){
      if (response.status !==201){//201 indica que se creo correctamente
        swal({
          title: "Error al guardar el cliente.",
          text:  responseData.message || 'Error desconocido',
          icon: "error",
        });
        throw new Error(responseData.message ||'Error al guardar el cliente');
      }
      swal({
        title: "Cliente agregado correctamente",
        icon: "success",
      }).then((value) => {
        if (value) {
          // que se recargue la pagina para ver la categoria agregada
          location.reload();
        }
      });
    } else {
      //si es 200, el producto se modifico correctamente
      if (response.status !== 200){
        swal({
          title: "Error al modificar el cliente.",
          text: responseData.message || "Por Favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error(responseData.message || 'Error al modificar el gasto');
      }
      swal({
        title: "Cliente modificado correctamente",
        icon: "success",
      }).then((value) => {
        if (value) {
          // que se recargue la pagina para ver la categoria agregada
          location.reload();
        }
      });
    }
  }catch (error){
    console.log('Error: ', error);
    swal({
      title: "Error al agregar el gasto.",
      text: error.message || "Por Favor, intente de nuevo más tarde",
      icon: "error",
    });
  }
});

function stringVacio(string){
    if (string === '') return true;
}

  //limpio campos
  document.getElementById("reset").addEventListener("click", function () {
    const indicador = document.getElementById('indicador');
    indicador.classList.add("d-none");
    var mensajesError = document.querySelectorAll(".mensaje-error");
    mensajesError.forEach(function (mensaje) {
      mensaje.textContent = "";
    });
  });