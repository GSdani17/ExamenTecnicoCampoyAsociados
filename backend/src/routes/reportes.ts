import { Router } from "express";
import { getEmpleadosActivos, getEmpleadosPorProyecto, getProyectosActivos } from "../controller/reportesController";
import { verifyToken } from "../middleware/authenticateJWT";


const router = Router();


router.get("/empleadosActivos",/*verifyToken,*/getEmpleadosActivos);

router.get("/empleadosPorProyecto",/*verifyToken,*/getEmpleadosPorProyecto);

router.get("/proyectosActivos",/*verifyToken,*/ getProyectosActivos);


export default router;