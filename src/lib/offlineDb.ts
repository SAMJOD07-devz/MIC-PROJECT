import Dexie, { Table } from "dexie";

export interface OutboxScan {
  id?: number;
  idempotencyKey: string;
  qrToken: string;
  deviceId: string;
  offlineCapturedAt: string;
  syncStatus: "PENDING" | "SYNCED" | "CONFLICT_DUPLICATE" | "INVALID";
  serverResponse?: string;
  syncedAt?: string;
}

export class OrbitCheckOfflineDatabase extends Dexie {
  scansOutbox!: Table<OutboxScan, number>;

  constructor() {
    super("OrbitCheckOfflineDB");
    this.version(1).stores({
      scansOutbox: "++id, idempotencyKey, qrToken, syncStatus, offlineCapturedAt",
    });
  }
}

export const offlineDb = new OrbitCheckOfflineDatabase();

// Helper to queue an offline scan into IndexedDB outbox
export async function queueOfflineScan(
  qrToken: string,
  deviceId: string = "web-scanner"
): Promise<OutboxScan> {
  const scanRecord: OutboxScan = {
    idempotencyKey: `IDEM-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    qrToken,
    deviceId,
    offlineCapturedAt: new Date().toISOString(),
    syncStatus: "PENDING",
  };

  const id = await offlineDb.scansOutbox.add(scanRecord);
  return { ...scanRecord, id };
}

// Helper to fetch pending items
export async function getPendingOutboxScans(): Promise<OutboxScan[]> {
  return offlineDb.scansOutbox
    .where("syncStatus")
    .equals("PENDING")
    .toArray();
}

// Helper to update scan status post-sync
export async function updateOutboxScanStatus(
  id: number,
  status: "SYNCED" | "CONFLICT_DUPLICATE" | "INVALID",
  serverResponse?: string
) {
  await offlineDb.scansOutbox.update(id, {
    syncStatus: status,
    serverResponse,
    syncedAt: new Date().toISOString(),
  });
}
