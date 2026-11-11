
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const desafios = [
  {
    titulo: 'Desafío 1: Las ventas de la tienda',
    situacion:
      'Una tienda registró ventas de Q150, Q200 y Q100 durante tres días.',
    pregunta:
      '¿Qué fórmula permite calcular el total de las ventas si los valores están en las celdas B2, B3 y B4?',
    opciones: [
      '=PROMEDIO(B2:B4)',
      '=SUMA(B2:B4)',
      '=MAX(B2:B4)',
      '=MIN(B2:B4)'
    ],
    correcta: '=SUMA(B2:B4)',
    explicacion:
      'La función SUMA permite obtener el total de las ventas. En este caso, Q150 + Q200 + Q100 = Q450.'
  },
  {
    titulo: 'Desafío 2: Las calificaciones',
    situacion:
      'Una estudiante obtuvo las calificaciones 80, 90 y 100 en tres evaluaciones.',
    pregunta:
      '¿Qué fórmula permite calcular el promedio si las notas están en C2, C3 y C4?',
    opciones: [
      '=SUMA(C2:C4)',
      '=MAX(C2:C4)',
      '=PROMEDIO(C2:C4)',
      '=MIN(C2:C4)'
    ],
    correcta: '=PROMEDIO(C2:C4)',
    explicacion:
      'La función PROMEDIO calcula la media de las calificaciones. El resultado es 90.'
  },
  {
    titulo: 'Desafío 3: La venta más alta',
    situacion:
      'Una tienda obtuvo ventas de Q250, Q480, Q320 y Q150.',
    pregunta:
      '¿Qué fórmula permite encontrar la venta más alta si los datos están en D2 hasta D5?',
    opciones: [
      '=MIN(D2:D5)',
      '=PROMEDIO(D2:D5)',
      '=SUMA(D2:D5)',
      '=MAX(D2:D5)'
    ],
    correcta: '=MAX(D2:D5)',
    explicacion:
      'La función MAX identifica el valor más alto de una lista. En este caso, la venta más alta fue Q480.'
  },
  {
    titulo: 'Desafío 4: La calificación más baja',
    situacion:
      'Un grupo obtuvo las calificaciones 75, 95, 60 y 85.',
    pregunta:
      '¿Qué fórmula permite encontrar la calificación más baja si los datos están en E2 hasta E5?',
    opciones: [
      '=MAX(E2:E5)',
      '=SUMA(E2:E5)',
      '=MIN(E2:E5)',
      '=PROMEDIO(E2:E5)'
    ],
    correcta: '=MIN(E2:E5)',
    explicacion:
      'La función MIN identifica el valor más pequeño de una lista. En este caso, la calificación más baja es 60.'
  }
]

const animacionMensaje = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.96 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

function MundoDos() {
  const [indice, setIndice] = useState(0)
  const [respuesta, setRespuesta] = useState('')
  const [verificado, setVerificado] = useState(false)
  const [finalizado, setFinalizado] = useState(false)

  const desafioActual = desafios[indice]
  const esCorrecta = respuesta === desafioActual.correcta
  const esUltimo = indice === desafios.length - 1

  const comprobarRespuesta = () => {
    if (respuesta !== '') {
      setVerificado(true)
    }
  }

  const siguienteDesafio = () => {
    if (!verificado || !esCorrecta) {
      return
    }

    if (esUltimo) {
      setFinalizado(true)
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
      <span className="etiqueta">Mundo 2</span>

      <h1>El Reino de las Funciones</h1>

      <h2>Aplica tus conocimientos de Excel</h2>

      {!finalizado ? (
        <>
          <p className="descripcion">
            Resuelve situaciones de la vida cotidiana
            utilizando las funciones básicas de Excel.
          </p>

          <div className="progreso-desafio">
            <p>
              Desafío {indice + 1} de {desafios.length}
            </p>

            <progress
              value={indice + 1}
              max={desafios.length}
              aria-label="Progreso de los desafíos"
            />
          </div>

          <motion.div
            key={`desafio-${indice}`}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="informacion"
          >
            <h3>{desafioActual.titulo}</h3>

            <p>{desafioActual.situacion}</p>

            <p>
              <strong>{desafioActual.pregunta}</strong>
            </p>

            <div className="opciones">
              {desafioActual.opciones.map((opcion) => (
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
                  Has seleccionado la fórmula correcta.
                </p>

                <p>{desafioActual.explicacion}</p>

                <strong>
                  ¡Excelente trabajo! Sigue fortaleciendo
                  tus conocimientos de Excel.
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
                <h3>¡Sigue intentando!</h3>

                <p>
                  La fórmula seleccionada no es la correcta.
                  Observa nuevamente los datos y piensa
                  qué función necesitas utilizar.
                </p>

                <strong>
                  ¡No te rindas! Cada intento te ayuda a aprender.
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
              {esUltimo
                ? 'Finalizar Mundo 2'
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
            Has completado el Mundo 2:
            El Reino de las Funciones.
          </p>

          <p>
            Ahora sabes aplicar las funciones SUMA,
            PROMEDIO, MAX y MIN para resolver
            situaciones prácticas.
          </p>

          <strong>
            ¡Confía en tus capacidades y continúa aprendiendo!
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

export default MundoDos
