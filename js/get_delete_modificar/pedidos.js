document.addEventListener("DOMContentLoaded", async () => {
    await cargarPedidosPorEstado('Pendiente', 'bodyTablePedidosPendiente');
    await cargarPedidosPorEstado('Procesando', 'bodyTablePedidosProcesando');
    await cargarPedidosPorEstado('Completado', 'bodyTablePedidosCompletado');
    await cargarPedidosPorEstado('Cancelado', 'bodyTablePedidosCancelado');
});

async function cargarPedidosPorEstado(estado, tableBodyId) {
  const API_URL = `http://localhost:8080/api_lueva/pedidos?estado=${estado}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  //*Valor default para el input type date
  // Establecer la fecha actual como valor predeterminado
  var today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  var formattedDate = today.toISOString().substring(0, 10);
  document.getElementById("fechaRecibido").value = formattedDate;

  const response = await fetch(API_URL, options);
  const data = await response.json();
  const pedidos = data;
  const tbody = document.getElementById(tableBodyId);
  tbody.innerHTML = "";

  pedidos.forEach((pedido) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.classList.add("d-none");
    tdId.textContent = pedido.idPedido;

    const tdFecha = document.createElement("td");
    tdFecha.classList.add("p-2");
    tdFecha.textContent = convertirFecha(pedido.fechaRecibido);

    const tdIdCliente = document.createElement("td");
    tdIdCliente.classList.add("p-2");
    tdIdCliente.textContent = pedido.idCliente;

    const tdNombreCliente = document.createElement("td");
    tdNombreCliente.classList.add("p-2");
    tdNombreCliente.textContent = pedido.nombreCliente;

    const tdFechaFinalizado = document.createElement("td");
    tdFechaFinalizado.classList.add("p-2");
    tdFechaFinalizado.textContent = pedido.fechaFinalizado ? convertirFecha(pedido.fechaFinalizado) : "";

    const tdDescripcion = document.createElement("td");
    tdDescripcion.classList.add("p-2");
    tdDescripcion.textContent = pedido.descripcion;

    const tdEstado = document.createElement("td");
    tdEstado.classList.add("p-2");
    tdEstado.textContent = pedido.estado;

    const tdAccion = document.createElement("td");
    tdAccion.classList.add("p-2");

    const btnModificar = document.createElement("a");
    btnModificar.href = "#agregarPedidos";
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

    tr.appendChild(tdId);
    tr.appendChild(tdFecha);
    tr.appendChild(tdIdCliente);
    tr.appendChild(tdNombreCliente);
    tr.appendChild(tdFechaFinalizado);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdEstado);
    tr.appendChild(tdAccion);

    tbody.appendChild(tr);
  });

  // Agregar eventos después de crear los botones
  agregarEventosBotones();
}
// Función para convertir la fecha a formato "DD-MM-YYYY"
function convertirFecha(fechaYyyymmdd) {
    try {
        // Crear un objeto de fecha en UTC
        const fechaObj = new Date(fechaYyyymmdd + 'T00:00:00Z');
        const dia = String(fechaObj.getUTCDate()).padStart(2, '0'); // Obtener el día en UTC
        const mes = String(fechaObj.getUTCMonth() + 1).padStart(2, '0'); // Obtener el mes en UTC
        const anio = fechaObj.getUTCFullYear(); // Obtener el año en UTC

        // Formatear la fecha como "DD-MM-YYYY"
        const fechaDdmmyyyy = `${dia}-${mes}-${anio}`;
        return fechaDdmmyyyy;
    } catch (error) {
        return "Fecha inválida";
    }
}


function agregarEventosBotones() {
    document.querySelectorAll(".btnEliminar").forEach((button) => {
        button.addEventListener("click", async (event) => {
            const row = event.target.closest("tr");
            const pedidoId = row.querySelector("td:first-child").innerText.trim();

            // Confirmación de eliminación
            swal({
                title: "¿Estás seguro?",
                text: "Una vez eliminado, no podrás recuperar este pedido.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const response = await fetch(
                            `http://localhost:8080/api_lueva/pedidos?id=${pedidoId}`,
                            {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        if (!response.ok) {
                            let errorMessage = "Error al eliminar el pedido.";
                            if (response.status === 400) {
                                const responseData = await response.json();
                                errorMessage =
                                    responseData.message || "Error con el ID proporcionado.";
                            }

                            swal({
                                title: errorMessage,
                                text: "Por favor, intente de nuevo más tarde",
                                icon: "error",
                            });
                            throw new Error(errorMessage);
                        }

                        const data = await response.json();

                        // Si la eliminación fue exitosa, mostrar alerta de éxito
                        swal({
                            title: "Pedido Eliminada Correctamente",
                            icon: "success",
                        }).then((value) => {
                            if (value) {
                                location.reload();
                            }
                        });
                    } catch (error) {
                        console.error("Error:", error);
                        swal({
                            title: "Error al eliminar el pedido.",
                            text: "Por favor, intente de nuevo más tarde",
                            icon: "error",
                        });
                    }
                }
            });
        });
    });

    document.querySelectorAll(".btnModificar").forEach((button) => {
        button.addEventListener("click", async (event) => {
            const row = event.target.closest("tr");
            const pedidoId = row.querySelector("td:first-child").innerText.trim();
            const indicador = document.getElementById("indicador");
            indicador.classList.remove("d-none");

            try {
                const response = await fetch(
                    `http://localhost:8080/api_lueva/pedidos?id=${pedidoId}`
                );
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del pedido.");
                }
                const data = await response.json();
                const pedidoUnico = data[0];
                document.getElementById("id").value = pedidoUnico.idPedido;
                document.getElementById("fechaRecibido").value = pedidoUnico.fechaRecibido;
                document.getElementById("idCliente").value = pedidoUnico.idCliente;
                document.getElementById("fechaFinalizado").value = pedidoUnico.fechaFinalizado;
                document.getElementById("descripcion").value = pedidoUnico.descripcion;
                document.getElementById("estado").value = pedidoUnico.estado;
            } catch (error) {
                console.error("Error:", error);
            }
        });
    });
}