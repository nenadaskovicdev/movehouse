import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import router from "./routes";
import { logger } from "./lib/logger";
import { seedProviders } from "./lib/seed";

const PgStore = connectPgSimple(session);

const pgPool = new pg.Pool({ connectionString: process.env["DATABASE_URL"] });

pgPool.on("error", (err) => {
  logger.error({ err }, "Unexpected error on idle PostgreSQL client");
});

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PgStore({
      pool: pgPool,
      tableName: "session",
      createTableIfMissing: false,
    }),
    secret: process.env["SESSION_SECRET"] ?? "moveeasy-dev-secret-please-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    },
  }),
);

app.use("/api", router);

seedProviders().catch((err) => logger.error({ err }, "Failed to seed providers"));

export default app;
