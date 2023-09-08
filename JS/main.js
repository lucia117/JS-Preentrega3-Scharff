// Definición de la clase Persona para almacenar los datos del usuario
function Persona(sexo, edad, altura, pesoActual, anioSobrepeso, contextura) {
    this.sexo = sexo;
    this.edad = edad;
    this.altura = altura;
    this.pesoActual = pesoActual;
    this.anioSobrepeso = anioSobrepeso;
    this.contextura = contextura;
}


// Agregar un evento de escucha al formulario para manejar el envío
document.querySelector("#form-calculo").addEventListener("submit", (e) => {
    e.preventDefault();
    mostrarInformacionNutricional();
});

// Función para mostrar la información nutricional después de la validación
function mostrarInformacionNutricional() {
    // Obtener los valores de los inputs
    let sexo = document.querySelector("#sexo").value;
    let edad = parseInt(document.querySelector("#edad").value);
    let altura = parseFloat(document.querySelector("#altura").value);
    let contextura = document.querySelector("#contextura").value;
    let pesoActual = parseFloat(document.querySelector("#peso").value);
    let anioSobrepeso = parseInt(document.querySelector("#anios").value);

    // Validar las entradas del usuario
    if (!validarEntradas(edad, contextura, pesoActual, anioSobrepeso)) {
        alert("Por favor, ingresa valores válidos.");
        return;
    }

    let persona = new Persona(sexo, edad, altura, pesoActual, anioSobrepeso, contextura);

    // Calcular el IMC, peso ideal y peso posible
    let imc = calcIMC(persona);
    let pesoIdeal = calcPesoIdeal(persona);
    let pesoPosible = calcPesoPosible(persona, pesoIdeal);

    // Mostrar la información calculada en el HTML
    document.getElementById("imc-text").innerText = imc;
    document.getElementById("peso-actual-text").innerText = pesoActual + " kg";
    document.getElementById("peso-ideal-text").innerText = pesoIdeal + " kg";
    document.getElementById("peso-posible-text").innerText = (pesoPosible.toFixed(2) - 1) + " Kg - " + (pesoPosible.toFixed(2) + 1) + " Kg";

    document.getElementById("result-card1").removeAttribute("hidden");
    document.getElementById("result-card2").removeAttribute("hidden");
    let email = localStorage.getItem("email")
    localStorage.setItem(email, JSON.stringify({ imc, pesoIdeal, pesoActual, fecha: new Date() }))
    document.getElementById("form-calculo").reset();
}

// Función para validar las entradas del usuario
function validarEntradas(edad, contextura, peso, anios) {
    const edadValid = edad && !isNaN(edad) && edad >= 10;
    const contexturaValid = contextura && contextura.trim() !== "";
    const pesoValid = peso && !isNaN(peso) && peso > 0;
    const aniosValid = anios && !isNaN(anios) || anios > 0;

    return edadValid && contexturaValid && pesoValid && aniosValid;
}

// Función para calcular el IMC y su estado correspondiente
function calcIMC(persona) {
    let estado;
    altura = persona.altura / 100;
    const imc = parseFloat(persona.pesoActual / (altura * altura)).toFixed(2);

    if (imc < 16.5) {
        estado = 'Desnutrición o anorexia';
    } else if (imc >= 16.5 && imc < 18.5) {
        estado = 'Bajo peso';
    } else if (imc >= 18.5 && imc < 25) {
        estado = 'Peso normal';
    } else if (imc >= 25 && imc < 30) {
        estado = 'Sobrepeso';
    } else if (imc >= 30 && imc < 35) {
        estado = 'Obesidad clase I';
    } else if (imc >= 35 && imc < 40) {
        estado = 'Obesidad clase II';
    } else {
        estado = 'Obesidad clase III';
    }
    return `${imc} Kg/m² \n ${estado}`;
}

// Función para calcular el peso ideal
function calcPesoIdeal(persona) {
    const result = file.tablaPesosyContextura.find((ele) => ele.Altura >= persona.altura && ele.Sexo === persona.sexo && ele.ContexturaFisica === persona.contextura);
    return result.Medio;
}

// Función para calcular el peso posible
function calcPesoPosible(persona, pesoIdeal) {
    let kg1 = (persona.edad > 20) ? (persona.edad - 20) / 10 : 0;
    let kg2 = persona.anioSobrepeso / 10;
    let kg3 = (persona.pesoActual - pesoIdeal) / 10;
    let kg4 = (persona.pesoActual > 100) ? ((persona.pesoActual - 100) * 2) / 10 : 0;
    return Number(pesoIdeal) + Number(kg1) + Number(kg2) + Number(kg3) + Number(kg4);
}


function cerrarSesion() {
    localStorage.removeItem("emai");
    window.location.href = "./index.html";
}