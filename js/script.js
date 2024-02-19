
  var pedidos = [];
  var precioPorPedido = 100;
  var sumaPreciosPorUsuario = {};

  cargarPedidosDesdeJSON();

  function realizarPedido() {
    var nombreUsuario = prompt("Ingrese su nombre:");

    if (!nombreUsuario) {
      alert("Nombre no válido. Pedido cancelado.");
      return;
    }

    var tipoComida = document.getElementById("tipoComida").value;

    var acompanamiento = obtenerAcompanamiento(tipoComida);

    if (acompanamiento.length === 0) {
      alert("Tipo de comida no válido. Por favor, seleccione nuevamente.");
      return;
    }

    var seleccionAcompanamiento = prompt("Seleccione su acompañamiento:\n" + acompanamiento.join(", ")).toLocaleLowerCase();

    while (seleccionAcompanamiento != "pure" && seleccionAcompanamiento != "papas fritas") {
      seleccionAcompanamiento = prompt("No disponemos de " + seleccionAcompanamiento + ", o no es una respuesta correcta, por favor, seleccione su acompañamiento:\n" + acompanamiento.join(", "));
    }

    if (seleccionAcompanamiento) {
      var numeroPedido = generarNumeroPedido();

      if (!sumaPreciosPorUsuario[nombreUsuario]) {
        sumaPreciosPorUsuario[nombreUsuario] = 0;
      }
      sumaPreciosPorUsuario[nombreUsuario] += precioPorPedido;

      pedidos.push({
        numero: numeroPedido,
        nombre: nombreUsuario,
        comida: tipoComida,
        acompanamiento: seleccionAcompanamiento,
      });

      var output = document.getElementById("output");
      output.innerHTML = "¡Pedido realizado!<br>Número de Pedido: " +
        numeroPedido +
        "<br>Nombre: " +
        nombreUsuario +
        "<br>Comida: " +
        tipoComida +
        "<br>Acompañamiento: " +
        seleccionAcompanamiento;

      guardarPedidosEnJSON();
    } else {
      alert("Pedido cancelado.");
    }
  }

  function buscarPedido() {
    var nombreBuscar = prompt("Ingrese el nombre del usuario para buscar el pedido:");
    buscarYMostrarPedidoPorNombre(nombreBuscar);
  }

  function eliminarPedido() {
    var numeroEliminar = prompt("Ingrese el número de pedido a eliminar:");

    if (numeroEliminar) {
      var confirmacion = confirm("¿Está seguro de que desea eliminar el pedido?");

      if (confirmacion) {
        var indiceEliminar = pedidos.findIndex(function (pedido) {
          return pedido.numero == numeroEliminar;
        });

        if (indiceEliminar !== -1) {
          var pedidoEliminado = pedidos.splice(indiceEliminar, 1)[0];

          if (sumaPreciosPorUsuario[pedidoEliminado.nombre]) {
            sumaPreciosPorUsuario[pedidoEliminado.nombre] -= precioPorPedido;
          }

          var output = document.getElementById("output");
          output.innerHTML = "¡Pedido eliminado!<br>Número de Pedido: " +
            pedidoEliminado.numero +
            "<br>Nombre: " +
            pedidoEliminado.nombre +
            "<br>Comida: " +
            pedidoEliminado.comida +
            "<br>Acompañamiento: " +
            pedidoEliminado.acompanamiento;

          guardarPedidosEnJSON();
        } else {
          alert("Pedido no encontrado. Verifique el número de pedido ingresado.");
        }
      } else {
        alert("Operación cancelada.");
      }
    } else {
      alert("Operación cancelada.");
    }
  }

  function obtenerAcompanamiento(tipoComida) {
    switch (tipoComida) {
      case "milanesa":
      case "matambre":
      case "hamburguesa":
      case "carne al horno":
      case "churrasco":
      case "sanguche de milanesa":
      case "pollo":
        return ["Papas Fritas", "Pure"];

      default:
        return [];
    }
  }

  function generarNumeroPedido() {
    return Math.floor(Math.random() * 1000) + 1;
  }

  function mostrarSumaPreciosPorUsuario() {
    var nombreUsuario = prompt("Ingrese el nombre del usuario para ver la suma de precios:");
    if (sumaPreciosPorUsuario[nombreUsuario]) {
      var output = document.getElementById("output");
      output.innerHTML = "La suma de los precios para " + nombreUsuario + " es: $" + sumaPreciosPorUsuario[nombreUsuario];
    } else {
      alert("No hay pedidos para " + nombreUsuario);
    }
  }

  function buscarYMostrarPedidoPorNombre(nombreBuscar) {
    var pedidosEncontrados = pedidos.filter(function (pedido) {
      return pedido.nombre.toLowerCase() === nombreBuscar.toLowerCase();
    });

    if (pedidosEncontrados.length > 0) {
      for (var i = 0; i < pedidosEncontrados.length; i++) {
        var pedidoEncontrado = pedidosEncontrados[i];
        var output = document.getElementById("output");
        output.innerHTML = "Pedido encontrado:<br>Número de Pedido: " +
          pedidoEncontrado.numero +
          "<br>Nombre: " +
          pedidoEncontrado.nombre +
          "<br>Comida: " +
          pedidoEncontrado.comida +
          "<br>Acompañamiento: " +
          pedidoEncontrado.acompanamiento;
      }
    } else {
      var output = document.getElementById("output");
      output.innerHTML = "Pedido no encontrado para el usuario " + nombreBuscar;
    }
  }

  function cargarPedidosDesdeJSON() {
    var storedPedidos = localStorage.getItem("pedidos");

    if (storedPedidos) {
      pedidos = JSON.parse(storedPedidos);
    }
  }

  function guardarPedidosEnJSON() {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }
