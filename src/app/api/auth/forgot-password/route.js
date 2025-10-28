import { NextResponse } from "next/server";
import { sendForgotPasswordEmail } from "../../../../../lib/email";

export async function POST(request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const result = await sendForgotPasswordEmail(username);

    if (result.success) {
      return NextResponse.json({
        message: "Password reset request sent to administrator",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
