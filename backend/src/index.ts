import express from "express";
import empleadosRoutes from "./routes/empleados";
import proyectosRoutes from "./routes/proyectos";
import reporteRoutes from "./routes/reportes";
import loginRoutes from "./routes/login";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/empleados", empleadosRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/login", loginRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
