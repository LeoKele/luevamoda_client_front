const formNuevaImagen = document.getElementById("agregarStock");

formNuevaImagen.addEventListener("submit", async (event) => {
  event.preventDefault();
  var errorId = document.getElementById("mensajeId");
  var errorCantidad = document.getElementById("mensajeCantidad");
  errorId.textContent = "";
  errorCantidad.textContent = "";

  const formData = new FormData(formNuevaImagen);
  const id = formData.get("id");
  const idProducto = formData.get("idProducto");
  const cantidad = formData.get("cantidad");

  //comprobamos que no este vacio
  const idValido = stringVacio(idProducto);
  const cantidadValido = stringVacio(cantidad);

 

  if (idValido || cantidadValido) {
    errorId.textContent = !idValido ? "" : "Por favor, completa este campo.";
    errorCantidad.textContent = !cantidadValido ? "" : "Por favor, completa este campo";
    return;
  } 
    //* Datos API

    
    let url = "http://localhost:8080/api_lueva/stock";
    let method = 'POST';

    const productoData = {
      idProducto: idProducto,
      cantidad: cantidad
    };
    if (id){
      productoData.id = id;
      method = 'PUT';
    }

      //Configuramos para la peticion 
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productoData),
    };


    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
          const errorText = await response.text(); // Obtener el texto del error
          throw new Error(errorText || 'Error al guardar stock');
      }
  
      const responseData = await response.json();
  
      if (method === 'POST') {
          if (response.status !== 201) { // 201 indica que se creó correctamente
              swal({
                  title: "Error al agregar el stock.",
                  text: responseData.message || 'Error desconocido', // Mostrar el mensaje de error recibido
                  icon: "error",
              });
              throw new Error(responseData.message || 'Error al agregar el stock.');
          }
          swal({
              title: "Stock agregado correctamente",
              icon: "success",
          }).then((value) => {
              if (value) {
                  // Recargar la página para ver el stock agregado
                  location.reload();
              }
          });
      } else {
          // Si es 200, el stock se modificó correctamente
          if (response.status !== 200) {
              swal({
                  title: "Error al modificar el stock.",
                  text: responseData.message || 'Error desconocido', // Mostrar el mensaje de error recibido
                  icon: "error",
              });
              throw new Error(responseData.message || 'Error al modificar el stock.');
          }
          swal({
              title: "Stock modificado correctamente",
              icon: "success",
          }).then((value) => {
              if (value) {
                  // Recargar la página para ver el stock modificado
                  location.reload();
              }
          });
      }
  
  } catch (error) {
      console.log('Error: ', error);
      swal({
          title: "Error al agregar/modificar el stock.",
          text: error.message || "Por favor, inténtelo de nuevo más tarde",
          icon: "error",
      });
  }
  
    
    
  
});

function stringVacio(string) {
  if (string === "") return true;
};

 //limpio campos
 document.getElementById("reset").addEventListener("click", function () {
  const indicador = document.getElementById('indicador');
  indicador.classList.add("d-none");
  var mensajesError = document.querySelectorAll(".mensaje-error");
  mensajesError.forEach(function (mensaje) {
    mensaje.textContent = "";
  });
});
