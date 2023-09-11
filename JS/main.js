const EMAIL = localStorage.getItem("email")

cargarPaginaPrincipal()


// Definición de la clase Persona para almacenar los datos del usuario
function Persona(sexo, edad, altura, pesoActual, anioSobrepeso, contextura) {
    this.sexo = sexo;
    this.edad = edad;
    this.altura = altura;
    this.pesoActual = pesoActual;
    this.anioSobrepeso = anioSobrepeso;
    this.contextura = contextura;
}

//Funcion para cargar pagina principa
function cargarPaginaPrincipal() {
    if (localStorage.getItem(EMAIL) !== null) {
        let dataStorage = JSON.parse(localStorage.getItem(EMAIL))
        cargarInformacionPersonal(dataStorage);
        generarTabla(dataStorage.pesos);

    } else {
        //abro modal
        var myModal = new bootstrap.Modal(document.getElementById('registoModal'))
        myModal.show()
    }

}

// Agregar un evento de escucha al formulario para manejar el envío
document.querySelector("#form-calculo").addEventListener("submit", (e) => {
    e.preventDefault();
    mostrarInformacionNutricional();
});

//Sale de la pagina principal
document.getElementById("btn-salir").addEventListener("click", (e) => {
    window.location.href = "./index.html";
}); 

// Función para mostrar la información nutricional después de la validación
function mostrarInformacionNutricional() {
    // Obtener los valores de los inputs
    let sexo = document.querySelector("#sexo-input").value;
    let edad = parseInt(document.querySelector("#edad-input").value);
    let altura = parseFloat(document.querySelector("#altura-input").value);
    let contextura = document.querySelector("#contextura-input").value;
    let pesoActual = parseFloat(document.querySelector("#peso-input").value);
    let anioSobrepeso = parseInt(document.querySelector("#anios-input").value);

    // Validar las entradas del usuario
    if (!validarEntradas(edad, contextura, pesoActual, anioSobrepeso)) {
        console.log(edad, contextura, pesoActual, anioSobrepeso);
        alert("Por favor, ingresa valores válidos.");
        return;
    }

    let persona = new Persona(sexo, edad, altura, pesoActual, anioSobrepeso, contextura);

    // Calcular el IMC, peso ideal y peso posible
    let imc = calcIMC(persona);
    let pesoIdeal = calcPesoIdeal(persona);
    let pesoPosible = calcPesoPosible(persona, pesoIdeal);

    localStorage.setItem(EMAIL, JSON.stringify({
        data: {
            edad: persona.edad,
            genero: persona.sexo,
            altura: persona.altura,
            contextura: persona.contextura,
            anioSobrepeso: persona.anioSobrepeso,
            pesoIdeal,
            pesoPosible: (pesoPosible.toFixed(2) - 1) + " Kg - " + (pesoPosible.toFixed(2) + 1) + " Kg"
        },
        pesos: [
            {
                peso: pesoActual,
                fecha: new Date(),
                imc
            }
        ],
    }))

location.reload();
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

document.querySelector("#btn-guardar-registro").addEventListener("click", (e) => {
    //Valido si no esta vacio 
    let registro = document.getElementById("registro-peso").value;

    if (registro) {
        cargarnNuevoRegistro(registro);
    } else {
        alert("Debe completar el formulario");
    }
});

//Funcion para cargar un peso 
function cargarnNuevoRegistro(peso) {
    let dataStorage = JSON.parse(localStorage.getItem(EMAIL))

    let imc = calcIMC({ ...dataStorage.data, pesoActual: peso })
    dataStorage.pesos.push({
        peso,
        fecha: new Date(),
        imc
    })
    localStorage.setItem(EMAIL, JSON.stringify(dataStorage));
    location.reload();
}


//Funcion que muestra el historial de pesos
function generarTabla(data) {
    const table = document.getElementById("tableBody");
    let rows = "";
    for (let i = 0; i < data.length; i++) {
        let fecha = formatearFecha(data[i].fecha);
        let row = `<tr>
                    <td>${fecha}</td>
                    <td>${data[i].peso}</td>
                    <td>${data[i].imc}</td>
                </tr>`;
        rows += row;
    }
    table.innerHTML = rows;
}

//Funcion que formatea una fecha al formato "dd/mm/yyyy".
function formatearFecha(fecha) {
    const [año, mes, dia] = fecha.split('T')[0].split('-');

    return `${dia}/${mes}/${año}`;
}

//Funcion para cargar datos personales
function cargarInformacionPersonal(data) {
    document.getElementById("pesoPosible").textContent = data.data.pesoPosible;
    document.getElementById("pesoIdeal").textContent = data.data.pesoIdeal;
    document.getElementById("ultimoPeso").textContent = data.pesos[data.pesos.length - 1].peso;
    document.getElementById("altura").textContent = data.data.altura; 
    document.getElementById("edad").textContent = data.data.edad;
    document.getElementById("genero").textContent = data.data.genero;
    document.getElementById("contextura").textContent = data.data.contextura;
}

