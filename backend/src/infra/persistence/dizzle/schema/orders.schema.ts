import {
  pgTable,
  integer,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { $User } from './users.schema';

export const $Order = pgTable('orders', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 256 }).notNull(),
  userId: integer('user_id').references(() => $User.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
