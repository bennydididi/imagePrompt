import { Resend } from "resend";
import { env } from "./env.mjs";

export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : undefined;

export async function safeSendEmail(params: any) {
  if (!resend) {
    console.log("Resend not configured; skipping email send");
    return;
  }
  return resend.emails.send(params);
}