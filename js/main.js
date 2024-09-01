document.addEventListener("DOMContentLoaded", async function () {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let componentes = [];

    try {
        const response = await fetch('componentes.json');
        componentes = await response.json();
    } catch (error) {
        console.error('Error al cargar los componentes:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar los componentes. Inténtalo de nuevo más tarde.'
        });
    }

    const seleccionDiv = document.getElementById("seleccion");
    const carritoDiv = document.getElementById("carrito");
    const carritoItemsDiv = document.getElementById("carritoItems");
    const totalCarritoSpan = document.getElementById("totalCarrito");
    const pagoDiv = document.getElementById("pago");
    const searchResultsDiv = document.getElementById("searchResults");

    document.getElementById("armarPC").addEventListener("click", function () {
        seleccionDiv.style.display = "block";
        carritoDiv.style.display = "none";
        pagoDiv.style.display = "none";
        searchResultsDiv.style.display = "none";
        mostrarComponentes();
    });

    document.getElementById("buscarComponente").addEventListener("click", function () {
        seleccionDiv.style.display = "none";
        carritoDiv.style.display = "none";
        pagoDiv.style.display = "none";
        searchResultsDiv.style.display = "block";
    });

    document.getElementById("verCarrito").addEventListener("click", function () {
        seleccionDiv.style.display = "none";
        carritoDiv.style.display = "block";
        pagoDiv.style.display = "none";
        searchResultsDiv.style.display = "none";
        mostrarCarrito();
    });

    document.getElementById("salir").addEventListener("click", function () {
        Swal.fire({
            icon: 'success',
            title: '¡Gracias por visitar Cybermart!',
            text: '¡Vuelve pronto!',
        });
        seleccionDiv.style.display = "none";
        carritoDiv.style.display = "none";
        pagoDiv.style.display = "none";
        searchResultsDiv.style.display = "none";
    });

    document.getElementById("searchBtn").addEventListener("click", function () {
        const query = document.getElementById("searchInput").value.toLowerCase();
        const resultados = componentes.filter(componente => 
            componente.nombre.toLowerCase().includes(query) || 
            componente.tipo.toLowerCase().includes(query)
        );
        mostrarResultadosBusqueda(resultados);
    });

    document.getElementById("pagarBtn").addEventListener("click", function () {
        seleccionDiv.style.display = "none";
        carritoDiv.style.display = "none";
        pagoDiv.style.display = "block";
        searchResultsDiv.style.display = "none";
    });

    document.getElementById("formularioPago").addEventListener("submit", function (event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const metodoPago = document.getElementById("metodoPago").value;

        Swal.fire({
            icon: 'success',
            title: `Gracias ${nombre} por tu compra`,
            text: `Recibirás un correo de confirmación en ${email}.`
        });

        if (nombre.toLowerCase() === "lucas") {
            Swal.fire({
                icon: 'info',
                title: '¡Ahh!!',
                text: '¡Te la creíste! jajaja.'
            });
        }

        carrito = []; // Vaciar el carrito después de la compra
        localStorage.removeItem('carrito'); // Eliminar carrito del localStorage
        actualizarCarrito();
        seleccionDiv.style.display = "none";
        carritoDiv.style.display = "none";
        pagoDiv.style.display = "none";
        searchResultsDiv.style.display = "none";
    });

    function mostrarComponentes() {
        seleccionDiv.innerHTML = "";
        const tipos = [...new Set(componentes.map(componente => componente.tipo))];
        tipos.forEach(tipo => {
            const tipoDiv = document.createElement("div");
            tipoDiv.innerHTML = `<h4>${tipo}</h4>`;
            componentes.filter(componente => componente.tipo === tipo).forEach(componente => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "item";
                itemDiv.innerHTML = `
                    <p>${componente.nombre} - ${componente.precio} CLP</p>
                    <button class="btn btn-primary agregarCarrito">Agregar al Carrito</button>
                `;
                itemDiv.querySelector(".agregarCarrito").addEventListener("click", function () {
                    agregarAlCarrito(componente);
                });
                tipoDiv.appendChild(itemDiv);
            });
            seleccionDiv.appendChild(tipoDiv);
        });
    }

    function agregarAlCarrito(componente) {
        carrito.push(componente);
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar carrito en localStorage
        actualizarCarrito();
    }

    function actualizarCarrito() {
        const total = carrito.reduce((sum, item) => sum + item.precio, 0);
        document.getElementById("carritoCantidad").textContent = carrito.length;
        totalCarritoSpan.textContent = total;
    }

    function mostrarCarrito() {
        carritoItemsDiv.innerHTML = "";
        carrito.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.innerHTML = `
                <p>${item.nombre} - ${item.precio} CLP <button class="btn btn-danger btn-sm eliminarItem" data-index="${index}">Eliminar</button></p>
            `;
            itemDiv.querySelector(".eliminarItem").addEventListener("click", function () {
                eliminarDelCarrito(index);
            });
            carritoItemsDiv.appendChild(itemDiv);
        });
        actualizarCarrito();
    }

    function eliminarDelCarrito(index) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizar carrito en localStorage
        mostrarCarrito();
    }

    function mostrarResultadosBusqueda(resultados) {
        searchResultsDiv.innerHTML = "<h4>Resultados de Búsqueda</h4>";
        if (resultados.length > 0) {
            resultados.forEach(componente => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "item";
                itemDiv.innerHTML = `
                    <p>${componente.nombre} - ${componente.precio} CLP</p>
                    <button class="btn btn-primary agregarCarrito">Agregar al Carrito</button>
                `;
                itemDiv.querySelector(".agregarCarrito").addEventListener("click", function () {
                    agregarAlCarrito(componente);
                });
                searchResultsDiv.appendChild(itemDiv);
            });
        } else {
            searchResultsDiv.innerHTML += "<p>No se encontraron productos con ese nombre.</p>";
        }
    }
});