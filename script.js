/**
 * ARCHIVO: script.js
 * AUTOR: Johnatan Guacho
 * DESTINO: La mística de nosotros
 */

// 1. FUNCIONES GLOBALES (Para que los botones onclick funcionen)

function displayMessage() {
    const output = document.getElementById('console-output');
    if (!output) return;

    const stored = localStorage.getItem('katerin_msg');

    if (stored) {
        const data = JSON.parse(stored);
        output.innerHTML = `
            <div class="log-entry" style="margin-top: 10px; border-left: 2px solid #d4af37; padding-left: 10px;">
                <span class="log-date" style="color: #888; font-size: 11px;">[LOG LOCAL ${data.date}]:</span>
                <span class="log-text" style="color: #fff; display: block; font-size: 14px;">${data.text}</span>
            </div>
        `;
    } else {
        output.innerHTML = `<p class="log-empty" style="color: #444; font-size: 13px;">[WAITING FOR INPUT...]</p>`;
    }
}

function deleteMessage() {
    if (confirm("¿Seguro que quieres borrar el registro de la consola?")) {
        localStorage.removeItem('katerin_msg');
        displayMessage();
        const textarea = document.getElementById('user-msg');
        if (textarea) textarea.value = "";
    }
}

// 2. LÓGICA PRINCIPAL AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', () => {

    // Inicializar AOS (Animaciones)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200,
            once: true,
            offset: 100
        });
    }

    // Cargar mensaje guardado al inicio
    displayMessage();

    // Efecto Typewriter para el Subtítulo
    const subtitleElement = document.querySelector('.subtitle');
    const textToType = "Capítulo 7: Estás tú, siempre tú."; // Cambiado según tu preferencia anterior
    let index = 0;

    if (subtitleElement) {
        subtitleElement.innerHTML = "";
        function typeWriter() {
            if (index < textToType.length) {
                subtitleElement.innerHTML += textToType.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        }
        setTimeout(typeWriter, 1000);
    }

    // Easter Egg en Consola
    console.log("%c [SYSTEM]: Initializing Love_Protocol.exe...", "color: #d4af37; font-family: monospace; font-size: 14px;");
    setTimeout(() => {
        console.log("%c [SUCCESS]: Connection established with Katerin's Heart.", "color: #ff4d4d; font-family: monospace; font-size: 14px; font-weight: bold;");
        console.log("%c [INFO]: 7 years of data found. Integrity: 100%.", "color: #888; font-family: monospace;");
        console.log("%c [DEV]: Johnatan Guacho - Siempre fiel a la musa.", "color: #5d4037; font-style: italic; font-size: 16px;");
    }, 2000);

    // Efecto Parallax suave para las fotos
    const cards = document.querySelectorAll('.photo-card');
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            let xAxis = (window.innerWidth / 2 - e.pageX) / 60;
            let yAxis = (window.innerHeight / 2 - e.pageY) / 60;
            cards.forEach(card => {
                card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            });
        }
    });

    // MANEJO DEL FORMULARIO (Formspree + LocalStorage)
    const form = document.getElementById("contact-form");

    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const status = document.getElementById("form-status");
            const msgInput = document.getElementById("user-msg");
            const data = new FormData(event.target);

            // 1. Guardar localmente para que ella lo vea en su pantalla
            if (msgInput && msgInput.value.trim() !== "") {
                const now = new Date();
                const dateStr = now.toLocaleDateString();
                const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const fullMsg = {
                    text: msgInput.value.trim(),
                    date: `${dateStr} ${timeStr}`
                };
                localStorage.setItem('katerin_msg', JSON.stringify(fullMsg));
                displayMessage();
            }

            // 2. Enviar a tu correo vía Formspree
            status.innerHTML = "<span style='color: #d4af37;'>[ SENDING TO CLOUD... ]</span>";

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "<span style='color: #27c93f;'>[ SUCCESS ]: El mensaje ha llegado a mi sistema, mi Doc.</span>";
                    form.reset();
                } else {
                    status.innerHTML = "<span style='color: #ff4d4d;'>[ ERROR ]: No se pudo enviar el paquete.</span>";
                }
            }).catch(error => {
                status.innerHTML = "<span style='color: #ff4d4d;'>[ ERROR ]: Error de conexión.</span>";
            });
        });
    }
});