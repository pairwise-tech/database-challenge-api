/**
 * Wait helper.
 */
export const wait = async (time: number = 1000) => {
  await new Promise((_: any) => setTimeout(_, time));
};

/**
 * Only one can run queries at a time...
 */
class DATABASE_LOCK_CLASS {
  locked = false;

  isLocked() {
    return this.locked;
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }
}

export const POSTGRES_LOCK = new DATABASE_LOCK_CLASS();
export const MONGO_LOCK = new DATABASE_LOCK_CLASS();
