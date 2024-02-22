// alert("¡ Bienvenido !\nDisculpe las molestias, solo disponemos de algunas minutas.")

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

  var seleccionAcompanamiento = prompt(
    "Seleccione su acompañamiento:\n" + acompanamiento.join(", ")
  ).toLocaleLowerCase();

  while (
    seleccionAcompanamiento != "pure" &&
    seleccionAcompanamiento != "papas fritas"
  ) {
    seleccionAcompanamiento = prompt(
      "No disponemos de " +
        seleccionAcompanamiento +
        ", o no es una respuesta correcta, por favor, seleccione su acompañamiento:\n" +
        acompanamiento.join(", ")
    );
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
    output.innerHTML =
      "<span class='respuesta'>¡Pedido realizado!</span><br>Número de Pedido: " +
      "<span class='respuesta'>" +
      numeroPedido +
      "</span>" +
      "<br>Nombre: " +
      "<span class='respuesta'>" +
      nombreUsuario +
      "</span>" +
      "<br>Comida: " +
      "<span class='respuesta'>" +
      tipoComida +
      "</span>" +
      "<br>Acompañamiento: " +
      "<span class='respuesta'>" +
      seleccionAcompanamiento +
      "</span>";

    output.style.display = "block";

    guardarPedidosEnJSON();
  } else {
    alert("Pedido cancelado.");
  }
}

function buscarPedido() {
  var nombreBuscar = prompt(
    "Ingrese el nombre del usuario para buscar el pedido:"
  );
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
        output.innerHTML =
          "<span class='respuesta2'>¡Pedido eliminado!</span><br>Número de Pedido: " +
          "<span class='respuesta2'>" +
          pedidoEliminado.numero +
          "</span>" +
          "<br>Nombre: " +
          "<span class='respuesta2'>" +
          pedidoEliminado.nombre +
          "</span>" +
          "<br>Comida: " +
          "<span class='respuesta2'>" +
          pedidoEliminado.comida +
          "</span>" +
          "<br>Acompañamiento: " +
          "<span class='respuesta2'>" +
          pedidoEliminado.acompanamiento +
          "</span>";

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
  var nombreUsuario = prompt(
    "Ingrese el nombre del usuario para ver la suma de precios:"
  );
  if (sumaPreciosPorUsuario[nombreUsuario]) {
    var output = document.getElementById("output");
    output.innerHTML =
      "La suma de los precios para " +
      nombreUsuario +
      " es: $" +
      sumaPreciosPorUsuario[nombreUsuario];
  } else {
    alert("No hay pedidos para " + nombreUsuario);
  }
}

function buscarYMostrarPedidoPorNombre(nombreBuscar) {
  var pedidosEncontrados = pedidos.filter(function (pedido) {
    return pedido.nombre.toLowerCase() === nombreBuscar.toLowerCase();
  });

  var output = document.getElementById("output");

  if (pedidosEncontrados.length > 0) {
    var resultadoHTML = "Pedidos encontrados para " + nombreBuscar + ":<br>";

    for (var i = 0; i < pedidosEncontrados.length; i++) {
      var pedidoEncontrado = pedidosEncontrados[i];
      resultadoHTML +=
        "Número de Pedido: " +
        pedidoEncontrado.numero +
        "<br>Nombre: " +
        pedidoEncontrado.nombre +
        "<br>Comida: " +
        pedidoEncontrado.comida +
        "<br>Acompañamiento: " +
        pedidoEncontrado.acompanamiento +
        "<br><br>";
    }

    output.innerHTML = resultadoHTML;
  } else {
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