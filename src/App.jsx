
import './App.css'

function App() {
  return (
    <main className="contenedor">
      <section className="bienvenida">
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
          Próximamente encontrarás desafíos, ejercicios
          y actividades para fortalecer tus conocimientos.
        </p>

        <footer>
          Proyecto desarrollado con React y Vite
        </footer>
      </section>
    </main>
  )
}

export default App
