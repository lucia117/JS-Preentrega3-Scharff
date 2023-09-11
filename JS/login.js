document.querySelector("#login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    console.log(email, password)
    // Realizar la validación del usuario y contraseña (puedes ajustar esto según tus necesidades)
    if (validarCredenciales(email, password)) {
        // Si las credenciales son válidas, guardar la información en localStorage
        localStorage.setItem("email", email);
        // Redireccionar a la página principal
        window.location.href = "./principal.html"; 
    } else {
        alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
});

function validarCredenciales(email, password) {
    // Aquí debes implementar tu lógica de validación de credenciales.

    return email === "usuario@mail.com" && password === "contrasena";
}

alert("usuario: usuario@mail.com pass: contrasena")