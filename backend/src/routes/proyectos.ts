import { Router } from "express";
import { getAllProyectos, getProyectoById, insertProyecto, updateProyecto, deleteProyecto } from "../controller/proyectosController";
import { verifyToken } from "../middleware/authenticateJWT";


const router = Router();

router.get("/",/*verifyToken,*/ getAllProyectos);
router.get("/:id",/*verifyToken,*/ getProyectoById);
router.post("/", /*verifyToken,*/insertProyecto);
router.put("/:id",/*verifyToken,*/updateProyecto);
router.delete("/:id", /*verifyToken,*/deleteProyecto);

export default router;