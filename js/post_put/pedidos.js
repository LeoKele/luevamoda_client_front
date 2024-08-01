const formNuevoPedido = document.getElementById("agregarPedidos");

formNuevoPedido.addEventListener("submit", async (event) => {
  event.preventDefault();

  var errorFechaRecibido = document.getElementById("mensajeFechaRecibido");
  var errorCliente = document.getElementById("mensajeIdCliente");
  var errorFechaFinalizado = document.getElementById("mensajeFechaFinalizado");
  var errorDescripcion = document.getElementById("mensajeDescripcion");

  function limpiarMensajes() {
    errorFechaRecibido.textContent = "";
    errorCliente.textContent = "";
    errorFechaFinalizado.textContent = "";
    errorDescripcion.textContent = "";
  }
  limpiarMensajes();

  //* Validacion simple del form
  //Obtengo los valores de los campos
  const formData = new FormData(formNuevoPedido);
  //Obtengo los valores de los inputs
  const id = formData.get("id");
  const fechaRecibido = formData.get("fechaRecibido");
  const idCliente = formData.get("idCliente");
  const fechaFinalizado = formData.get("fechaFinalizado") || null;
  const descripcion = formData.get("descripcion");
  const estado = formData.get("estado");

  //Valido los campos
  const fechaRecibidoValido = stringVacio(fechaRecibido);
  const idClienteValido = esInt(idCliente);
  const descripcionValido = stringVacio(descripcion);

  if (
    fechaRecibidoValido ||
    !idClienteValido ||
    descripcionValido
  ) {
    //Si algun campo no es valido, muestro el mensaje de error

    errorFechaRecibido.textContent = !fechaRecibidoValido
      ? ""
      : "Por favor, completa este campo.";
    errorCliente.textContent = idClienteValido
      ? ""
      : "Por favor, completa este campo.";
    errorDescripcion.textContent = !descripcionValido
    ? ""
    : "Por favor, completa este campo.";
    return;
  }

  let url = "http://localhost:8080/api_lueva/pedidos";
  let method = "POST";

  const pedidoData = {
    fechaRecibido: fechaRecibido,
    idCliente: idCliente,
    fechaFinalizado: fechaFinalizado,
    estado: estado,
    descripcion: descripcion
  };

  if (id) {
    pedidoData.idPedido = id;
    method = "PUT";
  }
  //Configuramos para la peticion
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pedidoData),
  };

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      // Manejar errores específicos de la respuesta
      let errorMessage = "Error al guardar el pedido";
      if (response.status === 400) {
        errorMessage =
          responseData.message || "El ID de cliente no existe.";
      } else if (response.status === 409) {
        errorMessage =
          responseData.message ||
          "Conflicto de datos. Verifique los valores enviados.";
      }

      throw new Error(errorMessage);
    }

    if (method === "POST") {
      if (response.status === 201) {
        swal({
          title: "Pedido agregado correctamente",
          icon: "success",
        }).then((value) => {
          if (value) {
            location.reload();
          }
        });
      } else {
        throw new Error("Error al guardar el pedido");
      }
    } else {
      if (response.status === 200) {
        swal({
          title: "Pedido modificado correctamente",
          icon: "success",
        }).then((value) => {
          if (value) {
            location.reload();
          }
        });
      } else {
        throw new Error("Error al modificar el pedido");
      }
    }
  } catch (error) {
    console.log("Error: ", error);
    swal({
      title: "Error al agregar/modificar el pedido.",
      text: error.message || "Por favor, intente de nuevo más tarde",
      icon: "error",
    });
  }
});

function esInt(valor) {
  const numero = parseInt(valor);
  return !isNaN(numero);
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
