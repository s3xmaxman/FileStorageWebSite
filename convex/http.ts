import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

// httpRouterを使用してHTTPルーターを作成
const http = httpRouter();

// "/clerk"パスにPOSTメソッドを設定
http.route({
 path: "/clerk",
 method: "POST",
 handler: httpAction(async (ctx, request) => {
   // リクエストの本文(payload)を文字列として取得
   const payloadString = await request.text();
   // リクエストヘッダーを取得
   const headerPayload = request.headers;

   try {
     // internal.clerk.fulfillアクションを実行し、結果を取得
     const result = await ctx.runAction(internal.clerk.fulfill, {
       payload: payloadString,
       headers: {
         "svix-id": headerPayload.get("svix-id")!,
         "svix-timestamp": headerPayload.get("svix-timestamp")!,
         "svix-signature": headerPayload.get("svix-signature")!,
       },
     });

     // 結果のタイプに応じて処理を分岐
     switch (result.type) {
       case "user.created":
         // ユーザーを作成する mutation を実行
         await ctx.runMutation(internal.users.createUser, {
           tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
        //    name: `${result.data.first_name ?? ""} ${result.data.last_name ?? ""}`,
        //    image: result.data.image_url,
         });
         break;
    //    case "user.updated":
    //      // ユーザーを更新する mutation を実行
    //      await ctx.runMutation(internal.users.updateUser, {
    //        tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
    //        name: `${result.data.first_name ?? ""} ${result.data.last_name ?? ""}`,
    //        image: result.data.image_url,
    //      });
    //      break;
       case "organizationMembership.created":
         // ユーザーに組織IDを追加する mutation を実行
         await ctx.runMutation(internal.users.addOrgIdToUser, {
           tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
           orgId: result.data.organization.id,
           role: result.data.role === "org:admin" ? "admin" : "member",
         });
         break;
       case "organizationMembership.updated":
         // ユーザーの組織内の役割を更新する mutation を実行
         await ctx.runMutation(internal.users.updateRoleInOrgForUser, {
           tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
           orgId: result.data.organization.id,
           role: result.data.role === "org:admin" ? "admin" : "member",
         });
         break;
     }

     // 成功時に200レスポンスを返す
     return new Response(null, {
       status: 200,
     });
   } catch (err) {
     // エラー時に400レスポンスを返す
     return new Response("Webhook Error", {
       status: 400,
     });
   }
 }),
});

// httpルーターをエクスポート
export default http;