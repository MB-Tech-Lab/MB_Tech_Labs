/**
 * GET /api/hr/stats — HR dashboard stats (real database data, zeros if empty)
 */
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/modules/backend/middlewares/auth";
import { apiResponse, apiError } from "@/modules/backend/utils/ApiError";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const [
      activeJobPosts,
      applicationsReceived,
      pendingResumeReviews,
      interviewsScheduled,
      offersSent,
      activeInterns,
      employees,
      trainingBatches,
      certificatesIssued,
    ] = await Promise.all([
      db.internshipPosition.count({ where: { status: "PUBLISHED" } }),
      db.application.count(),
      db.application.count({ where: { status: "APPLIED" } }),
      db.interview.count({ where: { status: "SCHEDULED", scheduledAt: { gte: new Date() } } }),
      db.application.count({ where: { status: "OFFER_SENT" } }),
      db.trainingRecord.count({ where: { status: { in: ["ORIENTATION", "TRAINING", "INTERNAL_PROJECT", "CLIENT_PROJECT", "EVALUATION"] } } }),
      db.user.count({ where: { role: "DEVELOPER", isActive: true } }),
      db.trainingBatch.count({ where: { status: "ACTIVE" } }),
      db.certificate.count(),
    ]);

    return apiResponse({
      activeJobPosts,
      applicationsReceived,
      pendingResumeReviews,
      interviewsScheduled,
      offersSent,
      activeInterns,
      employees,
      trainingBatches,
      certificatesIssued,
    });
  } catch (err) {
    return apiError(err);
  }
}
