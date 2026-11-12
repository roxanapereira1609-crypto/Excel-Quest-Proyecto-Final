
const normalizarNombre = (nombre) =>
  nombre.trim().replace(/\s+/g, ' ')

const validarParticipante = (nombre, rol) =>
  typeof nombre === 'string' &&
  normalizarNombre(nombre).split(' ').length >= 3 &&
  normalizarNombre(nombre).length <= 150 &&
  ['Estudiante', 'Docente'].includes(rol)

const obtenerConfiguracion = () => {
  const token = process.env.NOCODB_TOKEN
  const baseId = process.env.NOCODB_BASE_ID
  const tablaId = process.env.NOCODB_TABLE_ID
  const baseUrl = (
    process.env.NOCODB_URL || 'https://app.nocodb.com'
  ).replace(/\/+$/, '')

  if (!token || !baseId || !tablaId) {
    throw new Error('Configuración incompleta de NocoDB')
  }

  return {
    token,
    url: `${baseUrl}/api/v3/data/${baseId}/${tablaId}/records`
  }
}

const consultarRegistros = async (configuracion) => {
  const registros = []
  let offset = 0
  const pageSize = 100

  while (true) {
    const url = new URL(configuracion.url)
    url.searchParams.set('pageSize', String(pageSize))
    url.searchParams.set('offset', String(offset))

    const respuesta = await fetch(url, {
      headers: {
        'xc-token': configuracion.token
      }
    })

    if (!respuesta.ok) {
      throw new Error(
        `Error al consultar NocoDB: ${respuesta.status}`
      )
    }

    const datos = await respuesta.json()

    const pagina = Array.isArray(datos)
      ? datos
      : datos.records || datos.list || []

    if (!Array.isArray(pagina)) {
      throw new Error('Formato de respuesta no reconocido')
    }

    registros.push(...pagina)

    if (pagina.length < pageSize) {
      break
    }

    offset += pageSize
  }

  return registros
}

const obtenerMundos = (registros, nombre, rol) => {
  const nombreBuscado = normalizarNombre(nombre).toLowerCase()

  return [
    ...new Set(
      registros
        .filter((registro) => {
          const campos = registro.fields || registro

          const nombreRegistrado =
            campos['Nombre Estudiante']

          return (
            typeof nombreRegistrado === 'string' &&
            normalizarNombre(nombreRegistrado).toLowerCase() ===
              nombreBuscado &&
            campos.Rol === rol &&
            campos.Resultado === 'Completado'
          )
        })
        .map((registro) => {
          const campos = registro.fields || registro

          return Number(campos['Mundo Completado'])
        })
        .filter((mundo) => [1, 2, 3].includes(mundo))
    )
  ].sort((a, b) => a - b)
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST')

    return res.status(405).json({
      error: 'Método no permitido'
    })
  }

  const datos =
    req.method === 'GET' ? req.query : req.body || {}

  const { nombre, rol } = datos

  if (!validarParticipante(nombre, rol)) {
    return res.status(400).json({
      error: 'Ingresa un nombre completo y un rol válido'
    })
  }

  if (req.method === 'POST') {
    if (
      ![1, 2, 3].includes(datos.mundo) ||
      datos.resultado !== 'Completado'
    ) {
      return res.status(400).json({
        error: 'Los datos del mundo no son válidos'
      })
    }
  }

  let configuracion

  try {
    configuracion = obtenerConfiguracion()
  } catch {
    return res.status(500).json({
      error: 'La conexión con NocoDB no está configurada'
    })
  }

  try {
    const registros = await consultarRegistros(configuracion)
    const mundos = obtenerMundos(registros, nombre, rol)

    if (req.method === 'GET') {
      return res.status(200).json({
        nombre: normalizarNombre(nombre),
        rol,
        mundosCompletados: mundos
      })
    }

    if (mundos.includes(datos.mundo)) {
      return res.status(200).json({
        mensaje: 'Este mundo ya estaba registrado',
        mundosCompletados: mundos
      })
    }

    const respuesta = await fetch(configuracion.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': configuracion.token
      },
      body: JSON.stringify({
        fields: {
          'Nombre Estudiante': normalizarNombre(nombre),
          Rol: rol,
          'Mundo Completado': datos.mundo,
          Resultado: 'Completado',
          Fecha: new Date().toISOString().slice(0, 10)
        }
      })
    })

    if (!respuesta.ok) {
      console.error(
        'Error al guardar en NocoDB:',
        respuesta.status
      )

      return res.status(502).json({
        error: 'No fue posible guardar el progreso'
      })
    }

    return res.status(201).json({
      mensaje: 'Progreso registrado correctamente',
      mundosCompletados: [...mundos, datos.mundo].sort(
        (a, b) => a - b
      )
    })
  } catch (error) {
    console.error('Error de NocoDB:', error)

    return res.status(502).json({
      error: 'No fue posible conectar con NocoDB'
    })
  }
}
