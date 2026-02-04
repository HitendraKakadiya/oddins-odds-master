/**
 * PostgreSQL advisory lock management for job execution
 */

import { PoolClient } from 'pg';
import { logger } from '../logger';

// Simple hash function to convert job name to integer for pg_advisory_lock
function hashJobName(jobName: string): number {
  let hash = 0;
  for (let i = 0; i < jobName.length; i++) {
    const char = jobName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export class JobLock {
  private client: PoolClient;
  private lockId: number;
  private jobName: string;
  private acquired: boolean = false;

  constructor(client: PoolClient, jobName: string) {
    this.client = client;
    this.jobName = jobName;
    this.lockId = hashJobName(jobName);
  }

  async acquire(): Promise<boolean> {
    try {
      const result = await this.client.query(
        'SELECT pg_try_advisory_lock($1) as acquired',
        [this.lockId]
      );
      
      this.acquired = result.rows[0].acquired;

      if (this.acquired) {
        logger.info(`Advisory lock acquired for job`, { 
          job: this.jobName, 
          lockId: this.lockId 
        });
      } else {
        logger.warn(`Could not acquire advisory lock - job may already be running`, { 
          job: this.jobName, 
          lockId: this.lockId 
        });
      }

      return this.acquired;
    } catch (error) {
      logger.error('Failed to acquire advisory lock', error, { 
        job: this.jobName 
      });
      return false;
    }
  }

  async release(): Promise<void> {
    if (!this.acquired) {
      return;
    }

    try {
      await this.client.query(
        'SELECT pg_advisory_unlock($1)',
        [this.lockId]
      );
      
      logger.info(`Advisory lock released for job`, { 
        job: this.jobName, 
        lockId: this.lockId 
      });
      
      this.acquired = false;
    } catch (error) {
      logger.error('Failed to release advisory lock', error, { 
        job: this.jobName 
      });
    }
  }
}

export async function withLock<T>(
  client: PoolClient,
  jobName: string,
  fn: () => Promise<T>
): Promise<T | null> {
  const lock = new JobLock(client, jobName);
  
  const acquired = await lock.acquire();
  
  if (!acquired) {
    logger.warn(`Skipping job execution - lock not acquired`, { job: jobName });
    return null;
  }

  try {
    return await fn();
  } finally {
    await lock.release();
  }
}

