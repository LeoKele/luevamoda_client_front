document.addEventListener("DOMContentLoaded", async () => {
  //* Datos api_lueva
  const API_URL = "http://localhost:8080/api_lueva/clientes";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(API_URL, options);
  const data = await response.json();
  const clientes = data;
  //Obtenemos el body de la tabla
  const tbody = document.getElementById("bodyTableClientes");
  tbody.innerHTML = "";

  clientes.forEach((cliente) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.classList.add("p-2");
    tdId.textContent = cliente.id;

    const tdNombre = document.createElement("td");
    tdNombre.classList.add("p-2");
    tdNombre.textContent = cliente.nombre;
    const tdTelefono = document.createElement("td");
    tdTelefono.classList.add("p-2");
    tdTelefono.textContent = cliente.telefono;
    const tdMail = document.createElement("td");
    tdMail.classList.add("p-2");
    tdMail.textContent = cliente.mail;

    //Añadimos los botones de accion
    const tdAccion = document.createElement("td");
    tdAccion.classList.add("p-2");

    const btnModificar = document.createElement("a");
    btnModificar.href = "#agregarGastos";
    btnModificar.type = "submit";
    btnModificar.classList.add(
      "btn",
      "btn-warning",
      "my-1",
      "mx-1",
      "btnModificar"
    );
    btnModificar.innerHTML = "Modificar";
    const btnEliminar = document.createElement("button");
    btnEliminar.type = "submit";
    btnEliminar.classList.add(
      "btn",
      "btn-danger",
      "my-1",
      "mx-1",
      "btnEliminar"
    );
    btnEliminar.innerHTML = "Eliminar";

    tdAccion.appendChild(btnModificar);
    tdAccion.appendChild(btnEliminar);

    //Añadimos los td al tr
    tr.appendChild(tdId);
    tr.appendChild(tdNombre);
    tr.appendChild(tdMail);
    tr.appendChild(tdTelefono);
    tr.appendChild(tdAccion);
    //Añadimos el tr al tbody
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btnEliminar").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const row = event.target.closest("tr");
      const clienteId = row.querySelector("td:first-child").innerText.trim();

      // Confirmación de eliminación
      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este cliente",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const response = await fetch(
              `http://localhost:8080/api_lueva/clientes?id=${clienteId}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const errorText = response.ok ? null : await response.text();

            if (!response.ok) {
              let errorMessage = "Por favor, intente de nuevo más tarde";

              if (response.status === 409) {
                // Conflict
                errorMessage =
                  "Error: El cliente está relacionado con otros registros y no puede ser eliminado.";
              } else if (response.status === 404) {
                // Not Found
                errorMessage = "Cliente no encontrado.";
              } else if (response.status === 400) {
                // Bad Request
                errorMessage = "ID de cliente inválido.";
              } else if (response.status === 500) {
                // Internal Server Error
                errorMessage =
                  "Error en el servidor. Intente nuevamente más tarde.";
              }

              swal({
                title: "Error al eliminar el cliente.",
                text: errorMessage,
                icon: "error",
              });
              throw new Error(errorText || "Error al eliminar el cliente");
            }

            const responseData = await response.json();

            // Si la eliminación fue exitosa, mostrar alerta de éxito
            swal({
              title: "Cliente eliminado correctamente",
              icon: "success",
            }).then((value) => {
              if (value) {
                location.reload();
              }
            });
          } catch (error) {
            console.error("Error:", error);
            swal({
              title: "Error al eliminar el cliente.",
              text: error.message || "Por favor, intente de nuevo más tarde",
              icon: "error",
            });
          }
        }
      });
    });
  });

  //evento para modificar
  // Agregar eventos después de crear los botones
  document.querySelectorAll(".btnModificar").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const row = event.target.closest("tr");
      const clienteId = row.querySelector("td:first-child").innerText.trim(); // de la fila levanto el id de la pelicula por su clase, por un selector de hijo primero
      const indicador = document.getElementById("indicador");
      indicador.classList.remove("d-none");

      try {
        const response = await fetch(
          `http://localhost:8080/api_lueva/clientes?id=${clienteId}`
        );
        if (!response.ok) {
          // lanzo una excepcion en caso de que no funcione el fetch, esto se ve en la consola
          throw new Error("Error al obtener los datos del cliente");
        }
        const data = await response.json();
        const clienteUnico = data[0];
        // son los id del formulario, como son unicos e irrepetibles dentro del html, sabe a quien insertarles los valores
        document.getElementById("id").value = clienteUnico.id;
        document.getElementById("nombre").value = clienteUnico.nombre;
        document.getElementById("telefono").value = clienteUnico.telefono;
        document.getElementById("mail").value = clienteUnico.mail;

        // manejo de excepciones, levanto la excepcion si hay error y la muestro en consola
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});
