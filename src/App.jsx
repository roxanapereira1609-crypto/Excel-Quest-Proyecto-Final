
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

  const validarNombre = (nombre) => {
    const palabras = nombre.trim().split(/\s+/).filter(Boolean)

    return (
      palabras.length >= 2 &&
      palabras.every((palabra) =>
        /^[\p{L}]+(?:[-'][\p{L}]+)*$/u.test(palabra)
      )
    )
  }

  const ingresar = (evento) => {
    evento.preventDefault()

    if (!validarNombre(nombreCompleto)) {
      setErrorNombre(
        'Escribe tu nombre y al menos un apellido, utilizando solamente letras.'
      )
      return
    }

    const datosParticipante = {
      nombre: nombreCompleto.trim().replace(/\s+/g, ' '),
      rol
    }

    setParticipante(datosParticipante)
    setErrorNombre('')
    setPantalla('mundos')
  }

  const cambiarParticipante = () => {
    setParticipante(null)
    setNombreCompleto('')
    setRol('Estudiante')
    setErrorNombre('')
    setPantalla('identificacion')
  }

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
            <p>
              <strong>Curso:</strong> TACs
            </p>

            <p>
              <strong>Nivel:</strong> Tercero Básico
            </p>

            <p>
              <strong>Tema:</strong> Funciones básicas de Excel
            </p>
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
              setPantalla(participante ? 'mundos' : 'identificacion')
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
                  Tu nombre y al menos un apellido
                </label>

                <input
                  id="nombreCompleto"
                  type="text"
                  value={nombreCompleto}
                  onChange={(evento) => {
                    setNombreCompleto(evento.target.value)
                    setErrorNombre('')
                  }}
                  placeholder="Ejemplo: María López"
                  autoComplete="name"
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
                  onChange={(evento) => setRol(evento.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                    fontSize: '16px'
                  }}
                >
                  <option value="Estudiante">
                    Estudiante
                  </option>

                  <option value="Docente">
                    Docente
                  </option>
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
              disabled={!validarNombre(nombreCompleto)}
            >
              Ingresar a Excel Quest
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

          <div className="informacion">
            <h3>Mundos educativos</h3>

            <div className="lista-mundos">
              <motion.button
                className="boton-aventura"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.88 }}
                transition={{ duration: 0.2 }}
                onClick={() => setPantalla('mundo1')}
              >
                Mundo 1: Exploradores de Excel
              </motion.button>

              <motion.button
                className="boton-aventura"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.88 }}
                transition={{ duration: 0.2 }}
                onClick={() => setPantalla('mundo2')}
              >
                Mundo 2: El Reino de las Funciones
              </motion.button>

              <motion.button
                className="boton-aventura"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.88 }}
                transition={{ duration: 0.2 }}
                onClick={() => setPantalla('mundo3')}
              >
                Mundo 3: El Desafío Final
              </motion.button>
            </div>
          </div>

          <button
            className="boton-aventura"
            onClick={() => setPantalla('bienvenida')}
          >
            Volver al inicio
          </button>

          <button
            className="boton-aventura"
            onClick={cambiarParticipante}
          >
            Cambiar participante
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

          <MundoUno />
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

          <MundoDos />
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

          <MundoTres />
        </motion.div>
      )}
    </main>
  )
}

export default App
