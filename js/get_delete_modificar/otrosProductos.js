document.addEventListener("DOMContentLoaded", async () => {
  //* Datos API
  const API_URL = "http://localhost:8080/api_lueva/productos/admin?listado=0";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(API_URL, options);
  const data = await response.json();
  const productos = data;
  //Obtenemos el body de la tabla
  const tbody = document.getElementById("bodyTableProductos");
  tbody.innerHTML = "";
  //Recorremos todos los productos
  productos.forEach((producto) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.classList.add("p-2");
    tdId.textContent = producto.id;

    const tdCliente = document.createElement("td");
    tdCliente.classList.add("p-2");
    tdCliente.textContent = producto.cliente;

    const tdNombre = document.createElement("td");
    tdNombre.classList.add("p-2");
    tdNombre.textContent = producto.nombre;

    const tdIdCategoria = document.createElement("td");
    tdIdCategoria.classList.add("p-2");
    tdIdCategoria.textContent = producto.idCategoria;

    const tdMedidaBusto = document.createElement("td");
    tdMedidaBusto.classList.add("p-2");
    tdMedidaBusto.textContent = producto.medidaBusto;

    const tdMedidaCintura = document.createElement("td");
    tdMedidaCintura.classList.add("p-2");
    tdMedidaCintura.textContent = producto.medidaCintura;

    const tdMedidaCadera = document.createElement("td");
    tdMedidaCadera.classList.add("p-2");
    tdMedidaCadera.textContent = producto.medidaCadera;

    const tdPrecioBase = document.createElement("td");
    tdPrecioBase.classList.add("p-2");
    tdPrecioBase.textContent = `$${producto.precioMoldeBase}`;
    const tdPrecioDigital = document.createElement("td");
    tdPrecioDigital.classList.add("p-2");
    tdPrecioDigital.textContent = `$${producto.precioMoldeDigital}`;
    const tdPrecioCartulina = document.createElement("td");
    tdPrecioCartulina.classList.add("p-2");
    tdPrecioCartulina.textContent = `$${producto.precioMoldeCartulina}`;

    const tdTalles = document.createElement("td");
    tdTalles.classList.add("p-2");
    tdTalles.textContent = producto.cantidadTalles;

    const tdListado = document.createElement("td");
    tdListado.classList.add("d-none");
    tdListado.textContent = producto.listado;

    //Añadimos los botones de accion
    const tdAccion = document.createElement("td");
    tdAccion.classList.add("p-2");

    const btnModificar = document.createElement("a");
    btnModificar.href = "#agregarProductos";
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
    tr.appendChild(tdCliente);
    tr.appendChild(tdNombre);
    tr.appendChild(tdIdCategoria);
    tr.appendChild(tdMedidaBusto);
    tr.appendChild(tdMedidaCintura);
    tr.appendChild(tdMedidaCadera);
    tr.appendChild(tdPrecioBase);
    tr.appendChild(tdPrecioDigital);
    tr.appendChild(tdPrecioCartulina);
    tr.appendChild(tdTalles);
    tr.appendChild(tdListado);
    tr.appendChild(tdAccion);
    //Añadimos el tr al tbody
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btnEliminar").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const row = event.target.closest("tr");
      const productoId = row.querySelector("td:first-child").innerText.trim();

      // Confirmación de eliminación
      swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperar este producto",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const response = await fetch(
              `http://localhost:8080/api_lueva/productos/admin?id=${productoId}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              const errorText =
                errorData.message || "Error al eliminar el producto";
              swal({
                title: "Error al eliminar el producto.",
                text: errorText,
                icon: "error",
              });
              throw new Error(errorText);
            }

            const data = await response.json();

            // Si la eliminación fue exitosa, mostrar alerta de éxito
            swal({
              title: "Producto Eliminado Correctamente",
              icon: "success",
            }).then((value) => {
              if (value) {
                // Recargar la página
                location.reload();
              }
            });
          } catch (error) {
            console.error("Error:", error);
            swal({
              title: "Error al eliminar el producto.",
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
      const productoId = row.querySelector("td:first-child").innerText.trim(); // de la fila levanto el id de la pelicula por su clase, por un selector de hijo primero
      const indicador = document.getElementById("indicador");
      indicador.classList.remove("d-none");

      try {
        const response = await fetch(
          `http://localhost:8080/api_lueva/productos/admin?id=${productoId}&listado=0`
        );
        if (!response.ok) {
          // lanzo una excepcion en caso de que no funcione el fetch, esto se ve en la consola
          throw new Error("Error al obtener los datos del producto");
        }
        const data = await response.json();
        const productoUnico = data[0];
        // console.log(data);

        // son los id del formulario, como son unicos e irrepetibles dentro del html, sabe a quien insertarles los valores
        document.getElementById("id").value = productoUnico.id;
        document.getElementById("cliente").value = productoUnico.cliente;
        document.getElementById("nombre").value = productoUnico.nombre;
        document.getElementById("busto").value = productoUnico.medidaBusto;
        document.getElementById("cintura").value = productoUnico.medidaCintura;
        document.getElementById("cadera").value = productoUnico.medidaCadera;
        document.getElementById("precioBase").value =
          productoUnico.precioMoldeBase;
        document.getElementById("precioDigital").value =
          productoUnico.precioMoldeDigital;
        document.getElementById("precioCartulina").value =
          productoUnico.precioMoldeCartulina;
        document.getElementById("idCategoria").value =
          productoUnico.idCategoria;
        document.getElementById("cantidadTalles").value =
          productoUnico.cantidadTalles;
        document.getElementById("listado").value = productoUnico.listado;

        // manejo de excepciones, levanto la excepcion si hay error y la muestro en consola
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
});
