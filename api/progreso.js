
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')

    return res.status(405).json({
      error: 'Método no permitido'
    })
  }

  const { nombre, rol, mundo, resultado } = req.body || {}

  const nombreValido =
    typeof nombre === 'string' &&
    nombre.trim().split(/\s+/).length >= 2 &&
    nombre.trim().length <= 150

  if (
    !nombreValido ||
    !['Estudiante', 'Docente'].includes(rol) ||
    ![1, 2, 3].includes(mundo) ||
    resultado !== 'Completado'
  ) {
    return res.status(400).json({
      error: 'Los datos del participante no son válidos'
    })
  }

  const token = process.env.NOCODB_TOKEN
  const baseId = process.env.NOCODB_BASE_ID
  const tablaId = process.env.NOCODB_TABLE_ID
  const baseUrl = (
    process.env.NOCODB_URL || 'https://app.nocodb.com'
  ).replace(/\/$/, '')

  if (!token || !baseId || !tablaId) {
    return res.status(500).json({
      error: 'La conexión con NocoDB no está configurada'
    })
  }

  try {
    const respuesta = await fetch(
      `${baseUrl}/api/v3/data/${baseId}/${tablaId}/records`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xc-token': token
        },
        body: JSON.stringify({
          fields: {
            'Nombre Estudiante': nombre.trim(),
            Rol: rol,
            'Mundo Completado': mundo,
            Resultado: resultado,
            Fecha: new Date().toISOString().slice(0, 10)
          }
        })
      }
    )

    if (!respuesta.ok) {
      console.error(
        'Error de NocoDB:',
        respuesta.status
      )

      return res.status(502).json({
        error: 'No fue posible guardar el progreso en NocoDB'
      })
    }

    return res.status(201).json({
      mensaje: 'Progreso registrado correctamente'
    })
  } catch (error) {
    console.error('Error de conexión con NocoDB:', error)

    return res.status(500).json({
      error: 'Ocurrió un error al registrar el progreso'
    })
  }
}
