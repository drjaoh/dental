# React

A modern React-based project utilizing the latest frontend technologies and tools for building responsive web applications.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 📁 Project Structure

```
react_app/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── styles/         # Global styles and Tailwind configuration
│   ├── App.jsx         # Main application component
│   ├── Routes.jsx      # Application routes
│   └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by React and Vite
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new

## 📊 Patrones de Asistencia (Panel de Control)

El Panel de Control (`/doctor-dashboard`) incluye un resumen mensual de los días y horarios en que asisten los pacientes:

- Selector de mes (flechas o lista) para recorrer el historial mes con mes.
- Indicadores: asistencias del mes (vs. mes anterior; si el mes está en curso, vs. el mismo periodo), día más frecuente, horario pico e inasistencias.
- Gráficas por día de la semana y por hora, mapa de calor día × hora y distribución por franja (mañana / mediodía / tarde).
- Resumen automático en texto con los hallazgos del mes.

Solo las citas con estado `completed` cuentan como asistencia; `no-show` y `cancelled` se reportan aparte.

Archivos:
- `src/pages/doctor-dashboard/utils/attendanceAnalytics.js` — cálculo del resumen (funciones puras).
- `src/pages/doctor-dashboard/components/MonthlyAttendanceSummary.jsx` — interfaz.
- `src/pages/doctor-dashboard/data/appointmentHistory.js` — historial de ejemplo (6 meses). Reemplázalo por la consulta real cuando haya backend; solo necesita citas con `{ date: 'YYYY-MM-DD', time: 'HH:MM', status }`.
