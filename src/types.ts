import { Request, Response } from "express";
import { Redis } from "ioredis";
import { Stream } from "stream";
import { Connection } from "typeorm";

export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis;
  conn: Connection;
};

export type Upload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: ()=> Stream;
};