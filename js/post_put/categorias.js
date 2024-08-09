const formNuevaCategoria = document.getElementById('agregarCategorias');

formNuevaCategoria.addEventListener("submit", async (event)=>{
  event.preventDefault();

  var errorDescripcion = document.getElementById("mensajeDescripcion");
  var errorListado = document.getElementById("mensajeListado");

  errorDescripcion.textContent = "";
  errorListado.textContent = "";

  const formData = new FormData(formNuevaCategoria);
  const id = formData.get("id");
  const descripcion = formData.get("descripcion");
  const listado = formData.get("listado");


  //comprobamos que no este vacio
  const descripcionValido = stringVacio(descripcion);
  const listadoValido = esTiny(listado);



  if (descripcionValido || !listadoValido){
    errorDescripcion.textContent = !descripcionValido
    ? ""
    :"Por favor, completa este campo.";
    errorListado.textContent = listadoValido
    ? ""
    : "Por favor, ingrese un número válido";
    return;

}

    let url = "http://localhost:8080/api_lueva/categorias";
    let method = 'POST';

    const categoriaData = {
      descripcion: descripcion,
      listado: listado
    };

    if (id){
      categoriaData.id = id;
      method = 'PUT';
    }

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoriaData)
    };


    try {
      const response = await fetch(url,options);
      if (!response.ok){
        const errorText = await response.text(); // Obtener el texto del error
        throw new Error(errorText || 'Error al guardar categoria');
      }
      const responseData = await response.json();
      if (method === 'POST'){
        if (response.status !==201){//201 indica que se creo correctamente
          swal({
            title: "Error al guardar la categoria.",
            text: responseData.message || 'Error desconocido',
            icon: "error",
          });
          throw new Error(responseData.message || 'Error al guardar la categoria.');
        }
        swal({
          title: "Categoria agregada correctamente",
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
            title: "Error al modificar la categoria.",
            text: responseData.message || "Por Favor, intente de nuevo más tarde",
            icon: "error",
          });
          throw new Error(responseData.message || 'Error al modificar la categoria.');
        }
        swal({
          title: "Categoria modificada correctamente",
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
        title: "Error al agregar la categoria.",
        text: error.message || "Por Favor, intente de nuevo más tarde",
        icon: "error",
      });
    }

    
});

function stringVacio(string){
    if (string === '') return true;
}

function esTiny(numero) {
  const valorNumerico = parseFloat(numero); // Convierte el valor a número
  if (!isNaN(valorNumerico) && Number.isInteger(valorNumerico) && (valorNumerico === 0 || valorNumerico === 1)) {
      return true;
  } else {
      return false;
  }
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