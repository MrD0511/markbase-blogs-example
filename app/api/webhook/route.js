import crypto from "crypto";
import { revalidatePath } from "next/cache";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(request) {
    try {
        const body = await request.text();

        console.log("Received webhook payload:", body);

        const signature = request.headers.get("x-signature");

        if (!signature) {
            return Response.json(
                { error: "Missing signature" },
                { status: 401 }
            );
        }

        const expectedSignature = crypto
            .createHmac("sha256", WEBHOOK_SECRET)
            .update(body)
            .digest("hex");

        if (signature !== expectedSignature) {
            console.error("Invalid signature");
            return Response.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }

        const payload = JSON.parse(body);

        console.log("Parsed webhook payload:", payload);

        const { type, data } = payload;
        const { slug } = data;

        console.log(`Processing webhook of type: ${type} for slug: ${slug}`);

        if (!slug) {
            return Response.json(
                { error: "Missing slug" },
                { status: 400 }
            );
        }

        switch (type) {
            case "create":
                console.log(`Revalidating path: /blogs/${slug}`);
                revalidatePath(`/blogs/${slug}`);
                revalidatePath(`/blogs`);
                break;
            case "update":
                console.log(`Revalidating path: /blogs/${slug}`);
                revalidatePath(`/blogs/${slug}`);
                revalidatePath(`/blogs`);
                break;
            case "delete":
                console.log(`Revalidating path: /blogs/${slug}`);
                revalidatePath(`/blogs/${slug}`);
                revalidatePath(`/blogs`);
                break;

            default:
                return Response.json(
                    { error: `Unknown event type: ${type}` },
                    { status: 400 }
                );
        }

        return Response.json({
            success: true,
            revalidated: `/blogs/${slug}`,
        });

    } catch (error) {
        console.error("Webhook error:", error);

        return Response.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}