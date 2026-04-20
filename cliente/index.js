const PAGINAS_POR_PUESTO = {
  admin: 'admin.html',
  manager: 'manager.html',
  worker: 'worker.html'
};

document.querySelector('#login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombreUsuario = document.querySelector('#username').value.trim();
  const contrasena = document.querySelector('#password').value;
  const message = document.querySelector('#message');

  message.textContent = 'Iniciando sesión...';
  try {
    iniciarSesion(nombreUsuario, contrasena) // funcion asíncrona, devuelve una promesa
      .then(datosInicioSesion => {
        if (datosInicioSesion.token && datosInicioSesion.user && datosInicioSesion.user.puesto) {
          // Store auth data for use in subsequent pages.
          sessionStorage.setItem('token', datosInicioSesion.token);
          sessionStorage.setItem('user', JSON.stringify(datosInicioSesion.user));

          const targetPage = PAGINAS_POR_PUESTO[datosInicioSesion.user.puesto];

          if (!targetPage) {
            message.textContent = 'Error: puesto no reconocido.';
            return;
          }
          message.textContent = 'Inicio de sesión correcto. Redirigiendo...';
          window.location.href = targetPage;
        } else {
          message.textContent = 'Error: ' + (data || 'Credenciales inválidas.');
        }})
      .catch(err => {
        message.textContent = 'Error en el inicio de sesión: ' + err;
        console.error('Error en el inicio de sesión: ', err);
      })

  } catch (err) {
    message.textContent = 'Error en inicio de sesión: ' + err;
    console.error('Error en inicio de sesión: ', err);
  }

});
