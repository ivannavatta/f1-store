document.addEventListener('DOMContentLoaded', function() {
    const productos = [
        { nombre: "Remera McLaren", precio: 35000 },
        { nombre: "Remera Ferrari", precio: 40000 },
        { nombre: "Remera Aston Martin", precio: 32000 },
        { nombre: "Remera Mercedes AMG", precio: 38000 },
        { nombre: "Remera Alpine BTW", precio: 30000 },
        { nombre: "Remera Williams Racing", precio: 31000 },
        { nombre: "Remera Red Bull", precio: 42000 },
        { nombre: "Remera Racing Bulls", precio: 29000 },
        { nombre: "Remera Haas", precio: 27000 }
    ];

    let carrito = [];

    document.querySelectorAll('.card button').forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            agregarAlCarrito(productos[idx]);
        });
    });

    function agregarAlCarrito(producto) {
        const item = carrito.find(p => p.nombre === producto.nombre);
        if (item) {
            item.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        renderCarrito();
    }

    function renderCarrito() {
        const lista = document.getElementById('carrito-lista');
        lista.innerHTML = '';
        carrito.forEach(prod => {
            const li = document.createElement('li');
            li.textContent = `${prod.nombre} x${prod.cantidad} - $${prod.precio * prod.cantidad}`;
            lista.appendChild(li);
        });

        let totalSinDescuento = 0;
        carrito.forEach(prod => {
            totalSinDescuento += prod.precio * prod.cantidad;
        });
        const { total, promo } = calcularPromocion(carrito);
        document.getElementById('carrito-total').textContent = `Total: $${total}`;
        document.getElementById('carrito-promos').textContent = promo ? `Promoción aplicada: ${promo}` : '';
        
        let totalSinDescElem = document.getElementById('carrito-total-sin-desc');
        if (!totalSinDescElem) {
            totalSinDescElem = document.createElement('p');
            totalSinDescElem.id = 'carrito-total-sin-desc';
            document.getElementById('carrito').insertBefore(totalSinDescElem, document.getElementById('carrito-total'));
        }
        totalSinDescElem.textContent = `Total sin descuento: $${totalSinDescuento}`;
    }

    function calcularPromocion(carrito) {
        let total = 0;
        let promo = '';

        // Suma sin promo
        carrito.forEach(prod => {
            total += prod.precio * prod.cantidad;
        });

        // 30% OFF si supera $100.000 (no acumulable)
        if (total > 100000) {
            total = Math.round(total * 0.7);
            promo = '30% OFF por compra mayor a $100.000';
            return { total, promo };
        }

        // 3x2 del mismo producto
        let total3x2 = 0;
        let aplica3x2 = false;
        carrito.forEach(prod => {
            if (prod.cantidad >= 3) {
                let sets = Math.floor(prod.cantidad / 3);
                let resto = prod.cantidad % 3;
                total3x2 += (sets * 2 * prod.precio) + (resto * prod.precio);
                aplica3x2 = true;
            } else {
                total3x2 += prod.precio * prod.cantidad;
            }
        });
        if (aplica3x2) {
            promo = '3x2 en productos iguales';
            return { total: total3x2, promo };
        }

        // 20% OFF si lleva 2 iguales
        let total20 = 0;
        let aplica20 = false;
        carrito.forEach(prod => {
            if (prod.cantidad === 2) {
                total20 += Math.round(prod.precio * 2 * 0.8);
                aplica20 = true;
            } else {
                total20 += prod.precio * prod.cantidad;
            }
        });
        if (aplica20) {
            promo = '20% OFF por llevar 2 productos iguales';
            return { total: total20, promo };
        }

        // Sin promo
        return { total, promo: '' };
    }
});
