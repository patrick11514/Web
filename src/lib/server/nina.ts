import { NINA_BASE_URL, UPDATE_THRESHOLD_COUNT } from './variables';

interface NinaResponse<T> {
  Response: T;
  Success: boolean;
  Error: string;
}

interface ImageHistoryItem {
  ExposureTime: number;
  Temperature: number;
  CameraName: string;
  TargetName: string;
  Gain: number;
  Date: string;
  TelescopeName: string;
  FocalLength: number;
}

interface MountInfo {
  RightAscensionString: string;
  DeclinationString: string;
}

interface SequenceItem {
  Status: string;
  Items?: SequenceItem[];
  Name?: string;
  Triggers?: SequenceItem[];
}

export type LiveStatus = {
  active: boolean;
  imageInfo?: ImageHistoryItem;
  mountInfo?: MountInfo;
  currentAction?: string;
};

export class NinaClient {
  private baseUrl: string;
  private updateThreshold: number;
  private lastUpdate: number = 0;

  private cachedLiveStatus: LiveStatus | undefined;

  private cachedLiveImage: Buffer | undefined;

  constructor() {
    this.baseUrl = NINA_BASE_URL ?? 'http://10.10.10.211:1888/';
    this.updateThreshold = parseInt(UPDATE_THRESHOLD_COUNT || '30'); // Default 30 seconds
  }

  private async fetch<T>(endpoint: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.baseUrl}/v2/${endpoint}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching ${endpoint}:`, e);
      return null;
    }
  }

  private mapRunningAction(name: string): string {
    const map: Record<string, string> = {
      'Meridian Flip_Trigger': 'Meridian flip',
      'Smart Exposure': 'Exposing',
      'Slew and center': 'Slewing',
      'Start Guiding': 'Start Guiding',
      'Center After Drift_Trigger': 'Slewing',
      'Restore Guiding_Trigger': 'Start Guiding',
      'AF After HFR Increase_Trigger': 'Focusing',
      'Cool Camera': 'Cooling Camera',
      'Wait for Time': 'Waiting',
      'Wait for Time Span': 'Waiting'
    };

    return map[name] || name;
  }

  // Helper to actually implement the recursive search properly aligned with logic
  private getDeepestRunningName(items: SequenceItem[]): string | undefined {
    for (const item of items) {
      // Check if this item is RUNNING
      if (item.Status === 'RUNNING') {
        // 1. Check Triggers for this item
        if (item.Triggers && Array.isArray(item.Triggers)) {
          const runningTrigger = item.Triggers.find((t) => t.Status === 'RUNNING');
          if (runningTrigger) return runningTrigger.Name;
        }

        // 2. Check Children Items
        if (item.Items && item.Items.length > 0) {
          const deepName = this.getDeepestRunningName(item.Items);
          if (deepName) return deepName;
        }

        // 3. If no children/triggers running, this is the deepest running item
        return item.Name;
      }
    }
    return undefined;
  }

  // Re-write of isSequenceRunning to use getDeepestRunningName logic or keep simple?
  // We need both active check AND name extraction.

  async getLiveStatus() {
    const now = Date.now();

    // Check threshold with time (seconds * 1000)
    // Actually prompt said updateThreshold is in seconds.
    const timeDiff = (now - this.lastUpdate) / 1000;

    if (this.cachedLiveStatus && timeDiff < this.updateThreshold) {
      return this.cachedLiveStatus;
    }

    // Always check sequence status first
    const sequenceData =
      await this.fetch<NinaResponse<SequenceItem[]>>('api/sequence/json');

    const deepestName =
      sequenceData?.Success && sequenceData.Response
        ? this.getDeepestRunningName(sequenceData.Response)
        : undefined;
    const isRunning = !!deepestName;

    if (!isRunning) {
      this.cachedLiveStatus = { active: false };
      this.cachedLiveImage = undefined;
      return this.cachedLiveStatus;
    }

    // Sequence is running
    const mountData = await this.fetch<NinaResponse<MountInfo>>(
      'api/equipment/mount/info'
    );

    let imageInfo = this.cachedLiveStatus?.imageInfo;

    // Update Image Info only if threshold reached or not cached
    // NOTE: This logic assumes 'getLiveStatus' is called ~every 30s.
    // If we rely on timeDiff for image update:
    if (!imageInfo || timeDiff >= this.updateThreshold) {
      const imageCount = await this.fetch<NinaResponse<number>>(
        'api/image-history?count=true'
      );
      if (imageCount?.Success) {
        const imageData = await this.fetch<NinaResponse<ImageHistoryItem[]>>(
          'api/image-history?index=' + (imageCount.Response - 1)
        );
        if (imageData?.Success && imageData.Response?.length > 0) {
          imageInfo = imageData.Response[0];
        }
      }

      // Update Buffer
      this.updateImageBuffer();

      this.lastUpdate = now;
    }

    this.cachedLiveStatus = {
      active: true,
      mountInfo: mountData?.Response,
      imageInfo,
      currentAction: this.mapRunningAction(deepestName!)
    };

    return this.cachedLiveStatus;
  }

  async updateImageBuffer() {
    try {
      const res = await fetch(`${this.baseUrl}/v2/api/prepared-image`);
      if (!res.ok) return;
      this.cachedLiveImage = Buffer.from(await res.arrayBuffer());
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error updating image buffer:', e);
    }
  }

  async getLiveImage() {
    if (!this.cachedLiveImage) {
      await this.updateImageBuffer();
    }
    return this.cachedLiveImage;
  }
}

export const nina = new NinaClient();
