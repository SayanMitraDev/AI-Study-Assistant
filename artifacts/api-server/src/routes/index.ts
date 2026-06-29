import { Router, type IRouter } from "express";
import healthRouter from "./health";
import subjectsRouter from "./subjects";
import decksRouter from "./decks";
import cardsRouter from "./cards";
import studySessionsRouter from "./studySessions";
import dashboardRouter from "./dashboard";
import openaiRouter from "./openai/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use(subjectsRouter);
router.use(decksRouter);
router.use(cardsRouter);
router.use(studySessionsRouter);
router.use(dashboardRouter);
router.use(openaiRouter);

export default router;
