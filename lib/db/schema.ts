import { pgTable, text, integer, timestamp, serial } from "drizzle-orm/pg-core"

export const userProfiles = pgTable("user_profiles", {
  walletAddress: text("wallet_address").primaryKey(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  serviceTitle: text("service_title").notNull(),
  serviceDescription: text("service_description").notNull(),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const chains = pgTable("chains", {
  id: serial("id").primaryKey(),
  originWallet: text("origin_wallet").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const chainNodes = pgTable("chain_nodes", {
  id: serial("id").primaryKey(),
  chainId: integer("chain_id").notNull(),
  position: integer("position").notNull(),
  giverWallet: text("giver_wallet").notNull(),
  receiverWallet: text("receiver_wallet").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // pending | confirmed
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const chainMessages = pgTable("chain_messages", {
  id: serial("id").primaryKey(),
  nodeId: integer("node_id").notNull(),
  senderWallet: text("sender_wallet").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const onBalances = pgTable("on_balances", {
  walletAddress: text("wallet_address").primaryKey(),
  balance: integer("balance").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const onTransactions = pgTable("on_transactions", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  chainId: integer("chain_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  requesterWallet: text("requester_wallet"),
  requesterEmail: text("requester_email"),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open | resolved
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  scheduledAt: timestamp("scheduled_at"),
  status: text("status").notNull().default("requested"), // requested | confirmed | completed
  notes: text("notes"),  // 面談URL・メモ
})
