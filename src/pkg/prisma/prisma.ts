import { PrismaClient, Prisma } from "@prisma/client";
import { env } from "$utils/config.utils";
import Logger from "$pkg/logger";
import * as sqlFormatter from "sql-formatter";

const prismaLogOptsNonProd: Prisma.LogDefinition[] = [
  {
    emit: "event",
    level: "query",
  },
  {
    emit: "event",
    level: "error",
  },
  {
    emit: "event",
    level: "info",
  },
  {
    emit: "event",
    level: "warn",
  },
];

const prismaLogOptsProd: Prisma.LogDefinition[] = [
  {
    emit: "event",
    level: "error",
  },
  {
    emit: "event",
    level: "warn",
  },
];

const prismaLogOpts: Prisma.LogDefinition[] =
  env.NODE_ENV === "production" ? prismaLogOptsProd : prismaLogOptsNonProd;

const formatQuery = (query: string, params: string) => {
  try {
    return sqlFormatter.format(
      query.replace(/\$(\d+)/g, (_, n) => {
        const value = params[Number(n) - 1];
        if (typeof value === "string") return `'${value}'`;
        if (value === null || value === undefined) return "NULL";
        return value;
      }),
      { language: "postgresql" }
    );
  } catch (error) {
    return query;
  }
};

export class PrismaInstance {
  private static instance: PrismaInstance;
  private readonly prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: prismaLogOpts,
    });

    // Setup event listeners for Prisma logs
    this.prisma.$on("query" as never, (e: any) => {
      Logger.debug({
        prisma: "query",
        query: formatQuery(e.query, e.params),
        params: e.params,
        duration: `${e.duration}ms`,
        timestamp: e.timestamp,
      });
    });

    this.prisma.$on("error" as never, (e: any) => {
      Logger.error({
        prisma: "error",
        message: e.message,
        target: e.target,
        timestamp: e.timestamp,
      });
    });

    this.prisma.$on("warn" as never, (e: any) => {
      Logger.warn({
        prisma: "warn",
        message: e.message,
        target: e.target,
        timestamp: e.timestamp,
      });
    });

    this.prisma.$on("info" as never, (e: any) => {
      Logger.info({
        prisma: "info",
        message: e.message,
        target: e.target,
        timestamp: e.timestamp,
      });
    });
  }

  public static getInstance(): PrismaInstance {
    if (!PrismaInstance.instance) {
      PrismaInstance.instance = new PrismaInstance();
    }
    return PrismaInstance.instance;
  }

  public getPrismaClient(): PrismaClient {
    return this.prisma;
  }
}

export const prisma: PrismaClient =
  PrismaInstance.getInstance().getPrismaClient();
