import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import providersRouter from "./providers";
import movesRouter from "./moves";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(providersRouter);
router.use(movesRouter);

export default router;
