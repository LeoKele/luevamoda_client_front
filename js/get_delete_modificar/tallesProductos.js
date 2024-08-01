document.addEventListener("DOMContentLoaded", async () => {
    await cargarTalles();
});

async function cargarTalles() {
    const API_URL = `http://localhost:8080/api_lueva/talles`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(API_URL, options);
    const data = await response.json();
    const talles = data;
    const tbody = document.getElementById("bodyTableTalles");
    tbody.innerHTML = "";

    talles.forEach((talle) => {
        const tr = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.classList.add("d-none");
        tdId.textContent = talle.id;

        const tdIdProducto = document.createElement("td");
        tdIdProducto.classList.add("p-2");
        tdIdProducto.textContent = talle.idProducto;

        const tdTalle = document.createElement("td");
        tdTalle.classList.add("p-2");
        tdTalle.textContent = talle.talle;

        const tdBusto = document.createElement("td");
        tdBusto.classList.add("p-2");
        tdBusto.textContent = talle.medidaBusto;

        const tdCintura = document.createElement("td");
        tdCintura.classList.add("p-2");
        tdCintura.textContent = talle.medidaCintura;

        const tdCadera = document.createElement("td");
        tdCadera.classList.add("p-2");
        tdCadera.textContent = talle.medidaCadera;

        const tdAccion = document.createElement("td");
        tdAccion.classList.add("p-2");

        const btnModificar = document.createElement("button");
        btnModificar.type = "button";
        btnModificar.classList.add("btn", "btn-warning", "my-1", "mx-1", "btnModificar");
        btnModificar.innerHTML = "Modificar";

        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.classList.add("btn", "btn-danger", "my-1", "mx-1", "btnEliminar");
        btnEliminar.innerHTML = "Eliminar";

        tdAccion.appendChild(btnModificar);
        tdAccion.appendChild(btnEliminar);

        tr.appendChild(tdId);
        tr.appendChild(tdIdProducto);
        tr.appendChild(tdTalle);
        tr.appendChild(tdBusto);
        tr.appendChild(tdCintura);
        tr.appendChild(tdCadera);
        tr.appendChild(tdAccion);

        tbody.appendChild(tr);
    });

    agregarEventosBotones();
}

function agregarEventosBotones() {
    document.querySelectorAll(".btnEliminar").forEach((button) => {
        button.addEventListener("click", async (event) => {
            const row = event.target.closest("tr");
            const talleId = row.querySelector("td:first-child").innerText.trim();

            // Confirmación de eliminación
            swal({
                title: "¿Estás seguro?",
                text: "Una vez eliminado, no podrás recuperar este talle.",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    try {
                        const response = await fetch(
                            `http://localhost:8080/api_lueva/talles?id=${talleId}`,
                            {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );

                        if (!response.ok) {
                            let errorMessage = "Error al eliminar el talle.";
                            if (response.status === 400) {
                                const responseData = await response.json();
                                errorMessage = responseData.message || "Error con el ID proporcionado.";
                            }

                            swal({
                                title: errorMessage,
                                text: "Por favor, intente de nuevo más tarde",
                                icon: "error",
                            });
                            throw new Error(errorMessage);
                        }

                        // Si la eliminación fue exitosa, mostrar alerta de éxito
                        swal({
                            title: "Talle Eliminado Correctamente",
                            icon: "success",
                        }).then((value) => {
                            if (value) {
                                location.reload();
                            }
                        });
                    } catch (error) {
                        console.error("Error:", error);
                        swal({
                            title: "Error al eliminar el talle.",
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
            const talleId = row.querySelector("td:first-child").innerText.trim();
            const indicador = document.getElementById("indicador");
            indicador.classList.remove("d-none");

            try {
                const response = await fetch(
                    `http://localhost:8080/api_lueva/talles?id=${talleId}`
                );
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del talle.");
                }
                const data = await response.json();
                const talleUnico = data[0];
                document.getElementById("id").value = talleUnico.id;
                document.getElementById("idProducto").value = talleUnico.idProducto;
                document.getElementById("talle").value = talleUnico.talle;
                document.getElementById("busto").value = talleUnico.medidaBusto;
                document.getElementById("cintura").value = talleUnico.medidaCintura;
                document.getElementById("cadera").value = talleUnico.medidaCadera;
            } catch (error) {
                console.error("Error:", error);
            } finally {
                indicador.classList.add("d-none");
            }
        });
    });
}
