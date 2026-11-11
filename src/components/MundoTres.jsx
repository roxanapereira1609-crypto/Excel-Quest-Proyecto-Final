
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const desafios = [
  {
    titulo: 'El presupuesto escolar',
    instruccion:
      'Calcula el gasto total de los materiales escolares. Escribe una fórmula en la celda B6.',
    columnas: ['Material', 'Costo (Q)'],
    filas: [
      ['Cuadernos', 125],
      ['Lápices', 250],
      ['Cartulinas', 175],
      ['Marcadores', 150]
    ],
    celda: 'B6',
    funcion: 'SUMA',
    rango: 'B2:B5',
    resultado: 700,
    explicacion:
      'La función SUMA permite calcular el total de los gastos escolares.'
  },
  {
    titulo: 'El registro de calificaciones',
    instruccion:
      'Calcula el promedio de las cuatro calificaciones. Escribe una fórmula en la celda B6.',
    columnas: ['Evaluación', 'Nota'],
    filas: [
      ['Evaluación 1', 70],
      ['Evaluación 2', 80],
      ['Evaluación 3', 90],
      ['Evaluación 4', 100]
    ],
    celda: 'B6',
    funcion: 'PROMEDIO',
    rango: 'B2:B5',
    resultado: 85,
    explicacion:
      'La función PROMEDIO permite calcular la media aritmética de las calificaciones.'
  },
  {
    titulo: 'Las ventas del emprendimiento',
    instruccion:
      'Identifica la venta más alta. Escribe una fórmula en la celda B6.',
    columnas: ['Día', 'Venta (Q)'],
    filas: [
      ['Lunes', 350],
      ['Martes', 580],
      ['Miércoles', 420],
      ['Jueves', 290]
    ],
    celda: 'B6',
    funcion: 'MAX',
    rango: 'B2:B5',
    resultado: 580,
    explicacion:
      'La función MAX permite encontrar el valor más alto de una lista.'
  },
  {
    titulo: 'El registro de la biblioteca',
    instruccion:
      'Identifica la menor cantidad de libros prestados. Escribe una fórmula en la celda B7.',
    columnas: ['Día', 'Libros prestados'],
    filas: [
      ['Lunes', 25],
      ['Martes', 18],
      ['Miércoles', 32],
      ['Jueves', 14],
      ['Viernes', 27]
    ],
    celda: 'B7',
    funcion: 'MIN',
    rango: 'B2:B6',
    resultado: 14,
    explicacion:
      'La función MIN permite encontrar el valor más pequeño de una lista.'
  }
]

const animacionMensaje = {
  initial: { opacity: 0, y: 20, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.96 },
  transition: { duration: 0.4, ease: 'easeOut' }
}

function MundoTres() {
  const [indice, setIndice] = useState(0)
  const [formula, setFormula] = useState('')
  const [verificado, setVerificado] = useState(false)
  const [finalizado, setFinalizado] = useState(false)

  const desafio = desafios[indice]
  const formulaEsperada = `=${desafio.funcion}(${desafio.rango})`

  const normalizarFormula = (valor) =>
    valor.replace(/\s/g, '').toUpperCase()

  const esCorrecta =
    normalizarFormula(formula) === formulaEsperada

  const comprobarFormula = () => {
    if (formula.trim()) {
      setVerificado(true)
    }
  }

  const siguienteDesafio = () => {
    if (!verificado || !esCorrecta) {
      return
    }

    if (indice === desafios.length - 1) {
      setFinalizado(true)
      return
    }

    setIndice((anterior) => anterior + 1)
    setFormula('')
    setVerificado(false)
  }

  const reiniciar = () => {
    setIndice(0)
    setFormula('')
    setVerificado(false)
    setFinalizado(false)
  }

  return (
    <section className="bienvenida simulador-contenedor">
      <span className="etiqueta">Mundo 3</span>

      <h1>El Desafío Final</h1>
      <h2>Laboratorio interactivo de Excel</h2>

      {!finalizado ? (
        <>
          <p className="descripcion">
            Utiliza tus conocimientos para resolver
            problemas escribiendo fórmulas de Excel.
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
          >
            <div className="informacion">
              <h3>{desafio.titulo}</h3>
              <p>{desafio.instruccion}</p>
            </div>

            <div className="excel-simulador">
              <div className="excel-barra-formulas">
                <span className="excel-celda-activa">
                  {desafio.celda}
                </span>

                <span className="excel-fx">fx</span>

                <input
                  type="text"
                  value={formula}
                  onChange={(e) => {
                    setFormula(e.target.value)
                    setVerificado(false)
                  }}
                  placeholder="Escribe tu fórmula aquí"
                  aria-label={`Fórmula para la celda ${desafio.celda}`}
                />
              </div>

              <div className="excel-tabla-contenedor">
                <table className="excel-tabla">
                  <thead>
                    <tr>
                      <th></th>
                      <th>A</th>
                      <th>B</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>{desafio.columnas[0]}</td>
                      <td>{desafio.columnas[1]}</td>
                    </tr>

                    {desafio.filas.map((fila, posicion) => (
                      <tr key={posicion}>
                        <th>{posicion + 2}</th>
                        <td>{fila[0]}</td>
                        <td>{fila[1]}</td>
                      </tr>
                    ))}

                    <tr>
                      <th>{desafio.filas.length + 2}</th>
                      <td>RESULTADO</td>
                      <td className="excel-resultado">
                        {verificado && esCorrecta
                          ? desafio.resultado
                          : formula}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="excel-pestanas">
                <span>Hoja 1</span>
              </div>
            </div>
          </motion.div>

          <motion.button
            className="boton-aventura"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.88 }}
            onClick={comprobarFormula}
            disabled={!formula.trim()}
          >
            Comprobar fórmula
          </motion.button>

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
                  Has aplicado correctamente la función{' '}
                  {desafio.funcion}.
                </p>

                <p>{desafio.explicacion}</p>

                <p>
                  <strong>
                    Resultado obtenido: {desafio.resultado}
                  </strong>
                </p>

                <strong>
                  ¡Excelente trabajo! Continúa aprendiendo.
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
                  Revisa el nombre de la función y el rango
                  de celdas que necesitas utilizar.
                </p>

                <strong>
                  ¡Tú puedes! Analiza los datos e inténtalo nuevamente.
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
              {indice === desafios.length - 1
                ? 'Finalizar Excel Quest'
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
            Has completado el laboratorio interactivo
            de Excel Quest.
          </p>

          <p>
            Aplicaste las funciones SUMA, PROMEDIO,
            MAX y MIN para resolver situaciones prácticas.
          </p>

          <strong>
            ¡Sigue practicando y fortaleciendo
            tus conocimientos de Excel!
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

export default MundoTres
