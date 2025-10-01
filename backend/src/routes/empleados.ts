import { Router } from "express";
import { deleteEmpleado, getAllEmpleados, getEmpleadoById, insertEmpleado, updateEmpleado } from "../controller/empleadosController";
import { verifyToken } from "../middleware/authenticateJWT";

const router = Router();

router.get("/",/*verifyToken,*/getAllEmpleados);
router.get("/:id",/*verifyToken,*/getEmpleadoById);
router.post("/", /*verifyToken,*/insertEmpleado);
router.put("/:id",/*verifyToken,*/updateEmpleado);
router.delete("/:id", /*verifyToken,*/deleteEmpleado);

export default router;