
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const preguntas = [
  {
    pregunta: '¿Qué función de Excel permite sumar varios números?',
    opciones: ['PROMEDIO', 'SUMA', 'MAX', 'MIN'],
    correcta: 'SUMA',
    explicacion:
      'La función SUMA permite sumar valores de varias celdas. Por ejemplo: =SUMA(A1:A5).'
  },
  {
    pregunta: '¿Qué función permite calcular el promedio de varias calificaciones?',
    opciones: ['SUMA', 'PROMEDIO', 'MAX', 'MIN'],
    correcta: 'PROMEDIO',
    explicacion:
      'La función PROMEDIO calcula la media aritmética de varios números. Por ejemplo: =PROMEDIO(B1:B5).'
  },
  {
    pregunta: '¿Qué función permite encontrar el valor más alto de una lista?',
    opciones: ['MIN', 'SUMA', 'MAX', 'PROMEDIO'],
    correcta: 'MAX',
    explicacion:
      'La función MAX identifica el número más grande de un conjunto de valores. Por ejemplo: =MAX(C1:C5).'
  },
  {
    pregunta: '¿Qué función permite identificar el valor más pequeño de una lista?',
    opciones: ['MAX', 'PROMEDIO', 'MIN', 'SUMA'],
    correcta: 'MIN',
    explicacion:
      'La función MIN identifica el número más pequeño de un conjunto de valores. Por ejemplo: =MIN(D1:D5).'
  }
]

const animacionMensaje = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.96 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

function MundoUno({ onCompletar }) {
  const [indice, setIndice] = useState(0)
  const [respuesta, setRespuesta] = useState('')
  const [verificado, setVerificado] = useState(false)
  const [finalizado, setFinalizado] = useState(false)

  const preguntaActual = preguntas[indice]
  const esCorrecta = respuesta === preguntaActual.correcta
  const esUltima = indice === preguntas.length - 1

  const comprobarRespuesta = () => {
    if (respuesta !== '') {
      setVerificado(true)
    }
  }

  const siguienteDesafio = () => {
    if (!verificado || !esCorrecta) {
      return
    }

    if (esUltima) {
      setFinalizado(true)

      if (onCompletar) {
        onCompletar(1)
      }

      return
    }

    setIndice((anterior) => anterior + 1)
    setRespuesta('')
    setVerificado(false)
  }

  const reiniciar = () => {
    setIndice(0)
    setRespuesta('')
    setVerificado(false)
    setFinalizado(false)
  }

  return (
    <section className="bienvenida">
      <span className="etiqueta">Mundo 1</span>

      <h1>Exploradores de Excel</h1>
      <h2>Descubre el poder de las funciones</h2>

      {!finalizado ? (
        <>
          <p className="descripcion">
            Aprende a utilizar las funciones básicas de Excel
            mediante desafíos interactivos.
          </p>

          <div className="progreso-desafio">
            <p>
              Desafío {indice + 1} de {preguntas.length}
            </p>

            <progress
              value={indice + 1}
              max={preguntas.length}
              aria-label="Progreso de los desafíos"
            />
          </div>

          <motion.div
            key={`pregunta-${indice}`}
            className="informacion"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Tu desafío</h3>

            <p>{preguntaActual.pregunta}</p>

            <div className="opciones">
              {preguntaActual.opciones.map((opcion) => (
                <label
                  key={opcion}
                  className="opcion"
                >
                  <input
                    type="radio"
                    name="respuesta"
                    value={opcion}
                    checked={respuesta === opcion}
                    disabled={verificado && esCorrecta}
                    onChange={() => {
                      setRespuesta(opcion)
                      setVerificado(false)
                    }}
                  />

                  <span>{opcion}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {!verificado && (
            <motion.button
              className="boton-aventura"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.88 }}
              onClick={comprobarRespuesta}
              disabled={!respuesta}
            >
              Comprobar respuesta
            </motion.button>
          )}

          <AnimatePresence mode="wait">
            {verificado && esCorrecta && (
              <motion.div
                key="correcto"
                className="mensaje-correcto"
                role="status"
                {...animacionMensaje}
              >
                <h3>¡Felicitaciones!</h3>

                <p>
                  ¡Excelente trabajo! Has respondido correctamente.
                </p>

                <p>{preguntaActual.explicacion}</p>

                <strong>
                  ¡Sigue adelante! Confía en tus capacidades.
                </strong>
              </motion.div>
            )}

            {verificado && !esCorrecta && (
              <motion.div
                key="incorrecto"
                className="mensaje-intento"
                role="status"
                {...animacionMensaje}
              >
                <h3>¡No te desanimes!</h3>

                <p>
                  Esta vez no fue la respuesta correcta.
                  Puedes intentarlo nuevamente.
                </p>

                <strong>
                  Equivocarse también es parte del aprendizaje.
                  ¡Tú puedes lograrlo!
                </strong>
              </motion.div>
            )}
          </AnimatePresence>

          {verificado && esCorrecta && (
            <motion.button
              className="boton-aventura"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.88 }}
              transition={{ duration: 0.3 }}
              onClick={siguienteDesafio}
            >
              {esUltima
                ? 'Finalizar Mundo 1'
                : 'Siguiente desafío →'}
            </motion.button>
          )}
        </>
      ) : (
        <motion.div
          className="mensaje-final"
          role="status"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h3>¡Felicitaciones!</h3>

          <p>
            Has completado el Mundo 1: Exploradores de Excel.
          </p>

          <p>
            Demostraste tus conocimientos sobre las funciones
            SUMA, PROMEDIO, MAX y MIN.
          </p>

          <strong>
            ¡Continúa aprendiendo y confía en tus capacidades!
          </strong>

          <motion.button
            className="boton-aventura"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.88 }}
            onClick={reiniciar}
          >
            Practicar nuevamente
          </motion.button>
        </motion.div>
      )}
    </section>
  )
}

export default MundoUno
