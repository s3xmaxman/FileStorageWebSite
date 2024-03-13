"use node";

import type { WebhookEvent } from "@clerk/nextjs/server";
import { v } from "convex/values";
import { Webhook } from "svix";

import { internalAction } from "./_generated/server";


const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

// internalActionを使用して内部アクションを定義
export const fulfill = internalAction({
 // argsの型定義
 args: { headers: v.any(), payload: v.string() },
 // ハンドラー関数
 handler: async (ctx, args) => {
   // Webhookクラスのインスタンスを作成し、シークレットを渡す
   const wh = new Webhook(webhookSecret);
   // ペイロードとヘッダーを検証し、WebhookEventオブジェクトを取得
   const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
   // 検証されたペイロードを返す
   return payload;
 },
});