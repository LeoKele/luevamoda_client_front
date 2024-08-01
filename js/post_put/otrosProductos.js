const formNuevoProducto = document.getElementById("agregarProductos");

formNuevoProducto.addEventListener("submit", async (event) => {
  event.preventDefault();

  //recolectando los mensajes de error de index.html
  var errorCliente = document.getElementById("mensajeCliente");
  var errorNombre = document.getElementById("mensajeNombre");;
  var errorPrecioBase = document.getElementById("mensajePrecioBase");
  var errorPrecioDigital = document.getElementById("mensajePrecioDigital");
  var errorPrecioCartulina = document.getElementById("mensajePrecioCartulina");
  var errorCategoria = document.getElementById("mensajeCategoria");
  var errorListado = document.getElementById("mensajeListado");

  function limpiarMensajes() {
    errorCliente.textContent = "";
    errorNombre.textContent = "";
    errorPrecioBase.textContent = "";
    errorPrecioDigital.textContent = "";
    errorPrecioCartulina.textContent = "";
    errorCategoria.textContent = "";
    errorListado.textContent = "";
  }
  limpiarMensajes();

  //* Validacion simple del form
  //Obtengo los valores de los campos
  const formData = new FormData(formNuevoProducto);
  //Obtengo los valores de los inputs del form
  const id = formData.get("id");
  const cliente = formData.get("cliente");
  const nombre = formData.get("nombre");
  const precioBase = formData.get("precioBase");
  const precioDigital = formData.get("precioDigital");
  const precioCartulina = formData.get("precioCartulina");
  const idCategoria = formData.get("idCategoria");
  const listado = formData.get("listado");

  //validamos los valores de los inputs
  const clienteValido = stringVacio(cliente);
  const nombreValido = stringVacio(nombre);
  const precioBaseValido = esFloat(precioBase);
  const precioDigitalValido = esFloat(precioDigital);
  const precioCartulinaValido = esFloat(precioCartulina);
  const categoriaValido = esInt(idCategoria);
  const listadoValido = esTiny(listado);

  //validamos que todos los valores sean validos antes de hacer la peticion a la API
  if (
    clienteValido ||
    nombreValido ||
    !precioBaseValido ||
    !precioDigitalValido ||
    !precioCartulinaValido ||
    !categoriaValido ||
    !listadoValido
  ) {
    errorCliente.textContent = !clienteValido
      ? ""
      : "Por favor, completa este campo";
    errorNombre.textContent = !nombreValido
      ? ""
      : "Por favor, completa este campo.";
    errorPrecioBase.textContent = precioBaseValido
      ? ""
      : "Por favor, ingresa un valor numerico para el precio base.";
    errorPrecioDigital.textContent = precioDigitalValido
      ? ""
      : "Por favor, ingresa un valor numerico para el precio digital.";
    errorPrecioCartulina.textContent = precioCartulinaValido
      ? ""
      : "Por favor, ingresa un valor numerico para el precio cartulina.";
    errorCategoria.textContent = categoriaValido
      ? ""
      : "Por favor, ingrese un número entero.";
    errorListado.textContent = listadoValido
      ? ""
      : "Por favor, ingrese un número válido";
    return;
  }

  let url = "http://localhost:8080/api_lueva/productos/admin";
  let method = "POST";

  const productoData = {
    cliente: cliente,
    nombre: nombre,
    idCategoria: idCategoria,
    precioMoldeBase: precioBase,
    precioMoldeDigital: precioDigital,
    precioMoldeCartulina: precioCartulina,
    listado: listado,
  };

  if (id) {
    productoData.id = id;
    method = "PUT";
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
      throw new Error(errorText || "Error al guardar producto");
    }

    const responseData = await response.json();
    if (method === "POST") {
      if (response.status !== 201) {
        // 201 indica que se creó correctamente
        swal({
          title: "Error al agregar el producto.",
          text: responseData.message || "Por favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error(responseData.message || "Error al agregar el producto");
      }
      swal({
        title: "Producto agregado correctamente",
        icon: "success",
      }).then((value) => {
        if (value) {
          // Recargar la página para ver el producto agregado
          location.reload();
        }
      });
    } else {
      // Si es 200, el producto se modificó correctamente
      if (response.status !== 200) {
        swal({
          title: "Error al modificar el producto.",
          text: responseData.message || "Por favor, intente de nuevo más tarde",
          icon: "error",
        });
        throw new Error(
          responseData.message || "Error al modificar el producto"
        );
      }
      swal({
        title: "Producto modificado correctamente",
        icon: "success",
      }).then((value) => {
        if (value) {
          // Recargar la página para ver el producto modificado
          location.reload();
        }
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    swal({
      title: "Error al procesar la solicitud.",
      text: error.message || "Por favor, intente de nuevo más tarde",
      icon: "error",
    });
  }
});

function esFloat(valor) {
  const numero = parseFloat(valor);
  return !isNaN(numero);
}

function esInt(valor) {
  const numero = parseInt(valor);
  return !isNaN(numero);
}

function esTiny(numero) {
  const valorNumerico = parseFloat(numero); // Convierte el valor a número
  if (
    !isNaN(valorNumerico) &&
    Number.isInteger(valorNumerico) &&
    (valorNumerico === 0 || valorNumerico === 1)
  ) {
    return true;
  } else {
    return false;
  }
}

function stringVacio(string) {
  if (string === "") return true;
}

//limpio campos
document.getElementById("reset").addEventListener("click", function () {
  const indicador = document.getElementById("indicador");
  indicador.classList.add("d-none");
  var mensajesError = document.querySelectorAll(".mensaje-error");
  mensajesError.forEach(function (mensaje) {
    mensaje.textContent = "";
  });
});
