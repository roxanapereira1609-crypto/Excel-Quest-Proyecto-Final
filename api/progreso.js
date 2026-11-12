
const normalizarNombre = (nombre) =>
  nombre.trim().replace(/\s+/g, ' ')

const validarParticipante = (nombre, rol) => {
  if (typeof nombre !== 'string') {
    return false
  }

  const nombreLimpio = normalizarNombre(nombre)
  const palabras = nombreLimpio.split(' ')

  return (
    palabras.length >= 3 &&
    nombreLimpio.length <= 150 &&
    palabras.every((palabra) =>
      /^[\p{L}]+(?:[-'][\p{L}]+)*$/u.test(palabra)
    ) &&
    ['Estudiante', 'Docente'].includes(rol)
  )
}

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
    url: `${baseUrl}/api/v3/data/${encodeURIComponent(baseId)}/${encodeURIComponent(tablaId)}/records`
  }
}

const consultarRegistros = async (configuracion) => {
  const registros = []
  const pageSize = 100
  let page = 1
  const maxPaginas = 100

  while (page <= maxPaginas) {
    const url = new URL(configuracion.url)

    url.searchParams.set('pageSize', String(pageSize))
    url.searchParams.set('page', String(page))

    const respuesta = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'xc-token': configuracion.token,
        Accept: 'application/json'
      }
    })

    if (!respuesta.ok) {
      const detalle = await respuesta.text()

      console.error('Error de consulta NocoDB:', {
        estado: respuesta.status,
        detalle: detalle.slice(0, 500)
      })

      throw new Error(
        `Error al consultar NocoDB: ${respuesta.status}`
      )
    }

    const datos = await respuesta.json()

    const pagina = Array.isArray(datos)
      ? datos
      : Array.isArray(datos.records)
        ? datos.records
        : Array.isArray(datos.list)
          ? datos.list
          : null

    if (!pagina) {
      throw new Error(
        'La respuesta de NocoDB no contiene una lista de registros'
      )
    }

    registros.push(...pagina)

    if (pagina.length < pageSize) {
      return registros
    }

    page += 1
  }

  throw new Error(
    'Se alcanzó el límite de páginas al consultar NocoDB'
  )
}

const obtenerMundos = (registros, nombre, rol) => {
  const nombreBuscado = normalizarNombre(nombre).toLowerCase()

  const mundos = registros
    .filter((registro) => {
      const campos = registro.fields || registro
      const nombreRegistrado = campos['Nombre Estudiante']

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

  return [...new Set(mundos)].sort((a, b) => a - b)
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
  } catch (error) {
    console.error('Error de configuración:', error.message)

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
        'xc-token': configuracion.token,
        Accept: 'application/json'
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
      const detalle = await respuesta.text()

      console.error('Error al guardar en NocoDB:', {
        estado: respuesta.status,
        detalle: detalle.slice(0, 500)
      })

      return res.status(502).json({
        error: 'No fue posible guardar el progreso'
      })
    }

    const mundosActualizados = [
      ...new Set([...mundos, datos.mundo])
    ].sort((a, b) => a - b)

    return res.status(201).json({
      mensaje: 'Progreso registrado correctamente',
      mundosCompletados: mundosActualizados
    })
  } catch (error) {
    console.error('Error de NocoDB:', error.message)

    return res.status(502).json({
      error: 'No fue posible conectar con NocoDB'
    })
  }
}