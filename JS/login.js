document.querySelector("#login-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los valores del formulario
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    //const guardar = document.querySelector("#check").value;

    console.log(email, password)
    // Realizar la validación del usuario y contraseña (puedes ajustar esto según tus necesidades)
    if (validarCredenciales(email, password)) {
        // Si las credenciales son válidas, guardar la información en localStorage
        localStorage.setItem("email", email);

        // Redireccionar a la página principal
        window.location.href = "./principal.html"; // Reemplaza con la URL correcta
    } else {
        // Si las credenciales son inválidas, mostrar un mensaje de error
        alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
});

function validarCredenciales(email, password) {
    // Aquí debes implementar tu lógica de validación de credenciales.
    // Por ejemplo, puedes comparar con un nombre de usuario y contraseña predefinidos.
    // Retorna true si las credenciales son válidas y false si no lo son.
    return email === "usuario@mail.com" && password === "contrasena";
}