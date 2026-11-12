
import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import MundoUno from './components/MundoUno'
import MundoDos from './components/MundoDos'
import MundoTres from './components/MundoTres'

function App() {
  const [pantalla, setPantalla] = useState('bienvenida')
  const [nombreCompleto, setNombreCompleto] = useState('')
  const [rol, setRol] = useState('Estudiante')
  const [participante, setParticipante] = useState(null)
  const [errorNombre, setErrorNombre] = useState('')
  const [mundosCompletados, setMundosCompletados] = useState([])
  const [consultando, setConsultando] = useState(false)
  const [errorConsulta, setErrorConsulta] = useState('')
  const [estadoGuardado, setEstadoGuardado] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mundoPendiente, setMundoPendiente] = useState(null)

  const validarNombre = (nombre) => {
    const palabras = nombre.trim().split(/\s+/).filter(Boolean)

    return (
      palabras.length >= 3 &&
      nombre.trim().length <= 150 &&
      palabras.every((palabra) =>
        /^[\p{L}]+(?:[-'][\p{L}]+)*$/u.test(palabra)
      )
    )
  }

  const consultarProgreso = async (datosParticipante) => {
    setConsultando(true)
    setErrorConsulta('')

    try {
      const parametros = new URLSearchParams({
        nombre: datosParticipante.nombre,
        rol: datosParticipante.rol
      })

      const respuesta = await fetch(
        `/api/progreso?${parametros.toString()}`
      )

      if (!respuesta.ok) {
        throw new Error('No fue posible consultar el progreso')
      }

      const datos = await respuesta.json()

      const mundos = Array.isArray(datos.mundosCompletados)
        ? datos.mundosCompletados
            .map(Number)
            .filter((mundo) => [1, 2, 3].includes(mundo))
        : []

      setMundosCompletados([...new Set(mundos)])
      return true
    } catch {
      setErrorConsulta(
        'No pudimos recuperar tus avances. Puedes volver a intentarlo.'
      )
      return false
    } finally {
      setConsultando(false)
    }
  }

  const ingresar = async (evento) => {
    evento.preventDefault()

    if (!validarNombre(nombreCompleto)) {
      setErrorNombre(
        'Escribe tus nombres y apellidos completos (al menos tres palabras), utilizando solamente letras.'
      )
      return
    }

    const datosParticipante = {
      nombre: nombreCompleto.trim().replace(/\s+/g, ' '),
      rol
    }

    setErrorNombre('')
    setEstadoGuardado('')
    setMundoPendiente(null)
    setMundosCompletados([])
    setParticipante(datosParticipante)
    setPantalla('mundos')

    await consultarProgreso(datosParticipante)
  }

  const guardarProgreso = async (mundo) => {
    if (!participante || guardando) {
      return
    }

    if (mundosCompletados.includes(mundo)) {
      setEstadoGuardado(
        '¡Este mundo ya está registrado como completado!'
      )
      setMundoPendiente(null)
      return
    }

    setGuardando(true)
    setEstadoGuardado('Guardando tu progreso...')
    setMundoPendiente(mundo)

    try {
      const respuesta = await fetch('/api/progreso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: participante.nombre,
          rol: participante.rol,
          mundo,
          resultado: 'Completado'
        })
      })

      if (!respuesta.ok) {
        throw new Error('No fue posible guardar el progreso')
      }

      const datos = await respuesta.json()

      if (Array.isArray(datos.mundosCompletados)) {
        setMundosCompletados(
          [...new Set(
            datos.mundosCompletados
              .map(Number)
              .filter((numero) => [1, 2, 3].includes(numero))
          )]
        )
      } else {
        setMundosCompletados((anteriores) =>
          [...new Set([...anteriores, mundo])]
        )
      }

      setEstadoGuardado(
        '¡Tu progreso se guardó correctamente en Excel Quest!'
      )
      setMundoPendiente(null)
    } catch {
      setEstadoGuardado(
        'No se pudo guardar tu progreso. Comprueba tu conexión y vuelve a intentarlo.'
      )
    } finally {
      setGuardando(false)
    }
  }

  const abrirMundo = (numero) => {
    setEstadoGuardado('')
    setMundoPendiente(null)
    setPantalla(`mundo${numero}`)
  }

  const cerrarSesion = () => {
    setParticipante(null)
    setNombreCompleto('')
    setRol('Estudiante')
    setErrorNombre('')
    setMundosCompletados([])
    setErrorConsulta('')
    setEstadoGuardado('')
    setMundoPendiente(null)
    setPantalla('identificacion')
  }

  const nombresMundos = [
    'Exploradores de Excel',
    'El Reino de las Funciones',
    'El Desafío Final'
  ]

  const mensajeGuardado = (
    <>
      {estadoGuardado && (
        <p role="status" className="mensaje">
          {estadoGuardado}
        </p>
      )}

      {mundoPendiente !== null && !guardando && (
        <button
          type="button"
          className="boton-aventura"
          onClick={() => guardarProgreso(mundoPendiente)}
        >
          Reintentar guardar progreso
        </button>
      )}
    </>
  )

  return (
    <main className="contenedor">
      {pantalla === 'bienvenida' && (
        <motion.section
          className="bienvenida"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="etiqueta">Proyecto Integrador</span>

          <h1>Excel Quest</h1>
          <h2>Aprendizaje Interactivo de Excel</h2>

          <p className="descripcion">
            Bienvenido a un espacio educativo donde aprenderemos
            a utilizar Microsoft Excel de manera práctica,
            dinámica e interactiva.
          </p>

          <div className="informacion">
            <p><strong>Curso:</strong> TACs</p>
            <p><strong>Nivel:</strong> Tercero Básico</p>
            <p><strong>Tema:</strong> Funciones básicas de Excel</p>
          </div>

          <p className="mensaje">
            Prepárate para explorar nuevos conocimientos,
            superar desafíos y fortalecer tus habilidades.
          </p>

          <motion.button
            className="boton-aventura"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.88 }}
            onClick={() =>
              setPantalla(
                participante ? 'mundos' : 'identificacion'
              )
            }
          >
            Comenzar aventura
          </motion.button>

          <footer>
            Proyecto desarrollado con React y Vite
          </footer>
        </motion.section>
      )}

      {pantalla === 'identificacion' && (
        <motion.section
          className="bienvenida"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="etiqueta">
            Bienvenido a Excel Quest
          </span>

          <h1>¡Comienza tu aventura!</h1>
          <h2>Identificación del participante</h2>

          <p className="descripcion">
            Antes de explorar nuestros mundos educativos,
            queremos conocerte un poco.
          </p>

          <form onSubmit={ingresar}>
            <div className="informacion">
              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="nombreCompleto"
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold'
                  }}
                >
                  Nombre completo
                </label>

                <input
                  id="nombreCompleto"
                  type="text"
                  value={nombreCompleto}
                  onChange={(evento) => {
                    setNombreCompleto(evento.target.value)
                    setErrorNombre('')
                  }}
                  placeholder="Ejemplo: María Fernanda López García"
                  autoComplete="name"
                  maxLength={150}
                  required
                  aria-invalid={Boolean(errorNombre)}
                  aria-describedby={
                    errorNombre ? 'error-nombre' : undefined
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                    fontSize: '16px'
                  }}
                />

                {errorNombre && (
                  <p
                    id="error-nombre"
                    role="alert"
                    style={{ color: '#c62828' }}
                  >
                    {errorNombre}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="rol"
                  style={{
                    display: 'block',
                    marginBottom: '10px',
                    fontWeight: 'bold'
                  }}
                >
                  ¿Cuál es tu rol?
                </label>

                <select
                  id="rol"
                  value={rol}
                  onChange={(evento) =>
                    setRol(evento.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                    fontSize: '16px'
                  }}
                >
                  <option value="Estudiante">Estudiante</option>
                  <option value="Docente">Docente</option>
                </select>
              </div>
            </div>

            <p className="mensaje">
              ¡Prepárate para aprender, practicar y superar
              nuevos desafíos!
            </p>

            <motion.button
              type="submit"
              className="boton-aventura"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.88 }}
              disabled={
                !validarNombre(nombreCompleto) || consultando
              }
            >
              {consultando
                ? 'Consultando avances...'
                : 'Ingresar a Excel Quest'}
            </motion.button>
          </form>

          <button
            type="button"
            className="boton-aventura"
            onClick={() => setPantalla('bienvenida')}
          >
            Volver al inicio
          </button>
        </motion.section>
      )}

      {pantalla === 'mundos' && participante && (
        <motion.section
          className="bienvenida"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="etiqueta">
            Selecciona tu aventura
          </span>

          <h1>Los mundos de Excel Quest</h1>

          <h2>
            ¡Bienvenido/a, {participante.nombre}!
          </h2>

          <p className="descripcion">
            Participas como {participante.rol.toLowerCase()}.
            Cada mundo te permitirá aprender y practicar
            diferentes conocimientos de Excel.
          </p>

          {consultando ? (
            <p className="mensaje" role="status">
              Recuperando tus avances...
            </p>
          ) : errorConsulta ? (
            <>
              <p className="mensaje" role="alert">
                {errorConsulta}
              </p>

              <button
                type="button"
                className="boton-aventura"
                onClick={() => consultarProgreso(participante)}
              >
                Reintentar recuperar avances
              </button>
            </>
          ) : (
            <div className="informacion">
              <h3>Tu progreso</h3>

              <p>
                Has completado {mundosCompletados.length} de 3 mundos.
              </p>

              <progress
                value={mundosCompletados.length}
                max={3}
                aria-label="Progreso general de Excel Quest"
              />
            </div>
          )}

          <div className="informacion">
            <h3>Mundos educativos</h3>

            <div className="lista-mundos">
              {nombresMundos.map((nombre, indice) => {
                const numero = indice + 1
                const completado =
                  mundosCompletados.includes(numero)

                return (
                  <div key={numero}>
                    <motion.button
                      className="boton-aventura"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => abrirMundo(numero)}
                    >
                      Mundo {numero}: {nombre}
                    </motion.button>

                    {completado && (
                      <p className="mensaje">
                        ✓ Mundo completado
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            className="boton-aventura"
            onClick={() => setPantalla('bienvenida')}
          >
            Volver al inicio
          </button>

          <button
            type="button"
            className="boton-aventura"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </motion.section>
      )}

      {pantalla === 'mundo1' && participante && (
        <motion.div
          className="pantalla-mundo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <button
            className="boton-volver"
            onClick={() => setPantalla('mundos')}
          >
            ← Volver a los mundos
          </button>

          <MundoUno onCompletar={guardarProgreso} />

          {mensajeGuardado}
        </motion.div>
      )}

      {pantalla === 'mundo2' && participante && (
        <motion.div
          className="pantalla-mundo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <button
            className="boton-volver"
            onClick={() => setPantalla('mundos')}
          >
            ← Volver a los mundos
          </button>

          <MundoDos onCompletar={guardarProgreso} />

          {mensajeGuardado}
        </motion.div>
      )}

      {pantalla === 'mundo3' && participante && (
        <motion.div
          className="pantalla-mundo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <button
            className="boton-volver"
            onClick={() => setPantalla('mundos')}
          >
            ← Volver a los mundos
          </button>

          <MundoTres onCompletar={guardarProgreso} />

          {mensajeGuardado}
        </motion.div>
      )}
    </main>
  )
}

export default App
