const formAgregarTalles = document.getElementById("agregarTalles");

formAgregarTalles.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Elementos para mensajes de error
  const errorIdProducto = document.getElementById("mensajeId");
  const errorBusto = document.getElementById("mensajeBusto");
  const errorCintura = document.getElementById("mensajeCintura");
  const errorCadera = document.getElementById("mensajeCadera");

  // Función para limpiar mensajes de error
  function limpiarMensajes() {
    errorIdProducto.textContent = "";
    errorBusto.textContent = "";
    errorCintura.textContent = "";
    errorCadera.textContent = "";
  }
  limpiarMensajes();

  // Obtener los valores del formulario
  const formData = new FormData(formAgregarTalles);
  const id = formData.get("id");
  const idProducto = formData.get("idProducto");
  const talle = formData.get("talle");
  const busto = formData.get("busto");
  const cintura = formData.get("cintura");
  const cadera = formData.get("cadera");

  // Validar los campos
  const idProductoValido = !stringVacio(idProducto);
  const bustoValido = !stringVacio(busto) && !isNaN(busto);
  const cinturaValido = !stringVacio(cintura) && !isNaN(cintura);
  const caderaValido = !stringVacio(cadera) && !isNaN(cadera);

  if (!idProductoValido || !bustoValido || !cinturaValido || !caderaValido) {
    // Mostrar mensajes de error si algún campo no es válido
    errorIdProducto.textContent = idProductoValido ? "" : "Por favor, completa este campo.";
    errorBusto.textContent = bustoValido ? "" : "Por favor, ingrese una medida válida.";
    errorCintura.textContent = cinturaValido ? "" : "Por favor, ingrese una medida válida.";
    errorCadera.textContent = caderaValido ? "" : "Por favor, ingrese una medida válida.";
    return;
  }

  let url = "http://localhost:8080/api_lueva/talles";
  let method = "POST";

  const talleData = {
    idProducto: idProducto,
    talle: talle,
    medidaBusto: busto,
    medidaCintura: cintura,
    medidaCadera: cadera
  };

  if (id) {
    talleData.id = id;
    method = "PUT";
  }

  // Configuración de la petición
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(talleData),
  };

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      // Manejar errores específicos de la respuesta
      let errorMessage = "Error al guardar el talle";
      if (response.status === 400) {
        errorMessage = responseData.message || "El ID del producto no existe.";
      } else if (response.status === 409) {
        errorMessage = responseData.message || "Conflicto de datos. Verifique los valores enviados.";
      }

      throw new Error(errorMessage);
    }

    if (method === "POST") {
      if (response.status === 201) {
        swal({
          title: "Talle agregado correctamente",
          icon: "success",
        }).then((value) => {
          if (value) {
            location.reload();
          }
        });
      } else {
        throw new Error("Error al guardar el talle");
      }
    } else {
      if (response.status === 200) {
        swal({
          title: "Talle modificado correctamente",
          icon: "success",
        }).then((value) => {
          if (value) {
            location.reload();
          }
        });
      } else {
        throw new Error("Error al modificar el talle");
      }
    }
  } catch (error) {
    console.log("Error: ", error);
    swal({
      title: "Error al agregar/modificar el talle.",
      text: error.message || "Por favor, intente de nuevo más tarde",
      icon: "error",
    });
  }
});

// Funciones auxiliares
function stringVacio(string) {
  return string === "";
}

// Limpiar campos al hacer clic en el botón "Limpiar campos"
document.getElementById("reset").addEventListener("click", function () {
  const indicador = document.getElementById("indicador");
  indicador.classList.add("d-none");
  var mensajesError = document.querySelectorAll(".mensaje-error");
  mensajesError.forEach(function (mensaje) {
    mensaje.textContent = "";
  });
});
