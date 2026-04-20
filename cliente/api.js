
// Cambiamos el endpoint a nuestro backend local para obtener datos reales
const API_ENDPOINT = 'http://localhost:3000';

// Intento de inicio de sesión
async function iniciarSesion(nombreUsuario, contrasena){
    console.log('Intentando iniciar sesión con:', nombreUsuario, contrasena);
      const respuestaInicioSesion = await fetch(API_ENDPOINT + "/auth/login" + 
      `?nombreUsuario=${encodeURIComponent(nombreUsuario)}&contrasena=${encodeURIComponent(contrasena)}`, {
    });
    // const respuestaInicioSesion = await fetch(API_ENDPOINT + "/auth/login", {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ nombreUsuario, contrasena })
    // });
    console.log('Respuesta de fetch:', respuestaInicioSesion);
    if(respuestaInicioSesion.ok){

      const data = await respuestaInicioSesion.json();
      console.log('Datos recibidos del servidor:', data);
      if (data.success) {
        return data;
      } else {
        throw new Error('Error en el inicio de sesión: ' + (data.message || 'Credenciales inválidas.'));  
      }
    } else {
      throw new Error(`HTTP error: ${respuestaInicioSesion.status} - ${respuestaInicioSesion.statusText}`);
    }

}

// Carga de usuarios para el perfil admin
async function cargarUsuarios() {

  const LOCAL_ROUTE = "/users"

  const usuariosCargadosDesdeServidor = await fetch(API_ENDPOINT + LOCAL_ROUTE, {
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
  });
  if (usuariosCargadosDesdeServidor.ok) {
    const usuariosJson = await usuariosCargadosDesdeServidor.json();
    console.log('Usuarios cargados desde el servidor (JSON):', usuariosJson);
    if (usuariosJson.success) {
      return usuariosJson.users; // Devolver el array de usuarios para su procesamiento posterior
    } else {
      throw new Error('Error al cargar los usuarios: ' + usuariosJson.message);
    }
  } else {
    throw new Error(`HTTP error: ${usuariosCargadosDesdeServidor.status} - ${usuariosCargadosDesdeServidor.statusText}`);
  }
}

async function putUsuarioActualizado(datosActualizados) {

  const LOCAL_ROUTE = "/users"

  const response = await fetch(API_ENDPOINT + LOCAL_ROUTE + '/' + datosActualizados.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    },
    body: JSON.stringify(datosActualizados)
  });
  if (response.ok) {
    const result = await response.json();
    if (result.success) {
    console.log('Usuario actualizado desde el servidor (JSON):', result);
      return result.usuario; // Devolver el usuario actualizado para su procesamiento posterior
    } else {
      throw new Error('Error en la actualización del usuario: ' + result.message);
    }
  } else {
    throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
  }
}
