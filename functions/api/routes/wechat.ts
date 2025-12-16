import { Hono } from 'hono';
import type { Env } from '../types';

const wechat = new Hono<{ Bindings: Env }>();

export default wechat;
