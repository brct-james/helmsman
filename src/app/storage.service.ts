import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  DEBUG: boolean = true;
  storage: Map<string, StorableObject> = new Map<string, StorableObject>();
  categories: string[] = [];

  constructor(private ls: LocalStorageService) {
    this.initialize();
  }

  initialize() {
    this.DEBUG && console.log('[storage-service] Initializing');
    this.categories = Object.values(StorageService.Category);
    this.DEBUG &&
      console.log('[storage-service] Loaded Categories:', this.categories);
    for (let category of this.categories) {
      let retrieved = this.ls.retrieve(category);
      if (retrieved == undefined) {
        console.warn('storage-service] Loaded null for category:', category);
        continue;
      }
      let obj: StorableObject = {
        data: JSON.parse(retrieved.data, mapReviver),
        timestamp: retrieved.timestamp,
      };
      this.storage.set(category, obj);
      this.DEBUG && console.log('[storage-service] Loaded', category);
    }
    this.DEBUG && console.log('[storage-service] Finished Initialization');
  }

  store(key: string, data: Map<string, any>) {
    this.DEBUG && console.log('[storage-service] Storing:', key, data);
    let obj: StorableObject = {
      data: data,
      timestamp: new Date().toISOString(),
    };
    this.storage.set(key, obj);

    let stringifiedObj: { data: string; timestamp: string } = {
      data: JSON.stringify(data, mapReplacer),
      timestamp: new Date().toISOString(),
    };
    this.ls.store(key, stringifiedObj);
  }

  retrieve(key: string): StorableObject | undefined {
    let retrieved = this.storage.get(key);
    this.DEBUG &&
      console.log('[storage-service] Retrieving:', key, ':', retrieved);
    return retrieved;
  }

  delete(key: string) {
    return this.ls.clear(key);
  }

  clearAllLocalStorage(): void {
    this.ls.clear();
    window.location.reload();
  }
}

function mapReplacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}
function mapReviver(key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

export interface StorableObject {
  data: Map<string, any>;
  timestamp: string;
}

export namespace StorageService {
  export enum Category {
    Fleet = 'fleet',
    Systems = 'systems',
    Waypoints = 'waypoints',
    UserInfo = 'userInfo',
    AgentInfo = 'agentInfo',
    Contracts = 'contracts',
  }
}
