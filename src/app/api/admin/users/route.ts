import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAdmin } from "@/lib/auth";
import { serverError, forbidden, badRequest } from "@/lib/api-error";
import { z } from "zod";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const UpdateSchema = z.object({
  id: z.string().min(1, "User id is required"),
  role: z.enum(["USER", "ADMIN"]).optional(),
  membershipTier: z.enum(["VOYAGER", "STRATOSPHERE", "APEX"]).optional(),
});

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().slice(0, 60);

    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (search) {
      const regex = new RegExp(escapeRegExp(search), "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const users = await User.find(query).select("-passwordHash").sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ users });
  } catch (error: unknown) {
    return serverError("Admin users error", error);
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return forbidden("Admin access required");

    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);
    const { id, role, membershipTier } = parsed.data;
    if (!role && !membershipTier) return badRequest("Nothing to update");

    // Prevent self-demotion lockout: admins cannot remove their own ADMIN role.
    if (id === admin._id.toString() && role && role !== "ADMIN") {
      return NextResponse.json({ error: "You cannot remove your own admin role." }, { status: 400 });
    }

    await connectDB();
    const updated = await User.findByIdAndUpdate(
      id,
      { ...(role ? { role } : {}), ...(membershipTier ? { membershipTier } : {}) },
      { new: true }
    ).select("-passwordHash");
    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, user: updated });
  } catch (error: unknown) {
    return serverError("Admin user update error", error);
  }
}
