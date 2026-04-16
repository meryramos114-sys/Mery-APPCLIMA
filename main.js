const API_KEY = "402a4209262a67612de43e4464a4f11c";   

console.log("🔑 API Key cargada:", API_KEY ? "Sí (longitud: " + API_KEY.length + ")" : "NO");

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');

if (!API_KEY || API_KEY.includes("PEGA_AQUÍ")) {
    alert("⚠️ ERROR: Debes reemplazar 'PEGA_AQUÍ_TU_API_KEY_REAL' con tu clave real de OpenWeatherMap");
}

// Función para formatear hora
function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

async function getWeather(city) {
    console.log(`🌤 Buscando clima para: "${city}"`);

    if (!city || city.trim() === '') {
        alert('Por favor ingresa una ciudad');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&units=metric&lang=es&appid=${API_KEY}`;
    console.log("📡 URL generada:", url);

    try {
        console.log("⏳ Haciendo fetch...");
        const response = await fetch(url);
        console.log("📥 Response status:", response.status, response.ok ? "OK" : "ERROR");

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error del servidor:", errorText);
            
            if (response.status === 401) {
                alert("❌ API Key inválida o no activada. Verifica tu clave y espera 10-60 minutos si es nueva.");
            } else if (response.status === 404) {
                alert(`❌ Ciudad "${city}" no encontrada. Prueba con "Santo Domingo" o "New York"`);
            } else {
                alert(`Error ${response.status}: ${errorText || 'Desconocido'}`);
            }
            return;
        }

        const data = await response.json();
        console.log("✅ Datos recibidos:", data);

        // Crear tarjeta (mismo diseño neón)
        const weatherHTML = `
            <div class="card neon-card mx-auto" style="max-width: 440px;">
                <div class="card-header d-flex justify-content-between align-items-center bg-dark border-0">
                    <h5 class="mb-0">${data.name}, ${data.sys.country}</h5>
                    <button class="btn-close btn-close-white close-card" aria-label="Cerrar"></button>
                </div>
                <div class="card-body text-center p-4">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" 
                         alt="${data.weather[0].description}" 
                         style="width: 140px; height: 140px; filter: drop-shadow(0 0 15px #00ffff);">

                    <h1 class="display-1 fw-bold text-white mb-1">${Math.round(data.main.temp)}°C</h1>
                    <p class="fs-4 text-cyan mb-4">${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</p>

                    <div class="row text-start g-3">
                        <div class="col-6"><div class="param"><strong>Sensación térmica</strong><br><span class="value">${Math.round(data.main.feels_like)}°C</span></div></div>
                        <div class="col-6"><div class="param"><strong>Humedad</strong><br><span class="value">${data.main.humidity}%</span></div></div>
                        <div class="col-6"><div class="param"><strong>Presión</strong><br><span class="value">${data.main.pressure} hPa</span></div></div>
                        <div class="col-6"><div class="param"><strong>Viento</strong><br><span class="value">${data.wind.speed} m/s</span></div></div>
                        <div class="col-6"><div class="param"><strong>Visibilidad</strong><br><span class="value">${(data.visibility / 1000).toFixed(1)} km</span></div></div>
                        <div class="col-6"><div class="param"><strong>Amanecer</strong><br><span class="value">${formatTime(data.sys.sunrise)}</span></div></div>
                        <div class="col-6"><div class="param"><strong>Atardecer</strong><br><span class="value">${formatTime(data.sys.sunset)}</span></div></div>
                    </div>
                </div>
            </div>
        `;

        weatherContainer.innerHTML = weatherHTML;

        // Cerrar tarjeta
        document.querySelector('.close-card').addEventListener('click', () => {
            weatherContainer.innerHTML = '';
            searchInput.focus();
        });

    } catch (error) {
        console.error("🚨 Error en fetch:", error);
        alert('No se pudo conectar. Revisa tu internet o la API Key.');
    }
}

// Eventos
searchBtn.addEventListener('click', () => getWeather(searchInput.value));

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather(searchInput.value);
});

console.log("✅ App cargada correctamente. Escribe una ciudad y busca.");
