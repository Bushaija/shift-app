import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

// Users table for healthcare workers
export const usersTable = sqliteTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  licenseType: text("license_type").notNull(), // RN, LPN, CNA, etc.
  licenseNumber: text("license_number"),
  specialties: text("specialties"), // JSON array of specialties
  hourlyRate: real("hourly_rate"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Healthcare facilities
export const facilitiesTable = sqliteTable("facilities", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone"),
  facilityType: text("facility_type").notNull(), // Hospital, Nursing Home, Clinic, etc.
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Available shifts
export const shiftsTable = sqliteTable("shifts", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull(),
  facilityId: text("facility_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  department: text("department").notNull(),
  licenseType: text("license_type").notNull(),
  shiftDate: text("shift_date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  hourlyRate: real("hourly_rate").notNull(),
  totalHours: real("total_hours").notNull(),
  isUrgent: integer("is_urgent", { mode: "boolean" }).default(false),
  status: text("status").default("open"), // open, filled, cancelled
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Shift bookings
export const bookingsTable = sqliteTable("bookings", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull(),
  userId: text("user_id").notNull(),
  shiftId: text("shift_id").notNull(),
  status: text("status").default("pending"), // pending, confirmed, completed, cancelled
  bookedAt: text("booked_at").default(sql`(CURRENT_TIMESTAMP)`),
  confirmedAt: text("confirmed_at"),
  completedAt: text("completed_at"),
  cancelledAt: text("cancelled_at"),
  notes: text("notes"),
});

// Payments
export const paymentsTable = sqliteTable("payments", {
  id: text("id")
    .$defaultFn(() => createId())
    .notNull(),
  userId: text("user_id").notNull(),
  bookingId: text("booking_id").notNull(),
  amount: real("amount").notNull(),
  status: text("status").default("pending"), // pending, paid, failed
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  paidAt: text("paid_at"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Create schemas for type safety
export const UserSchema = createSelectSchema(usersTable);
export const FacilitySchema = createSelectSchema(facilitiesTable);
export const ShiftSchema = createSelectSchema(shiftsTable);
export const BookingSchema = createSelectSchema(bookingsTable);
export const PaymentSchema = createSelectSchema(paymentsTable);

// Export types
export type User = z.infer<typeof UserSchema>;
export type Facility = z.infer<typeof FacilitySchema>;
export type Shift = z.infer<typeof ShiftSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
