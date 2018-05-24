import {Injectable} from '@angular/core';
import {RequestServices} from './request.services';

@Injectable()
export class ModuleServices {
  constructor(private _req: RequestServices) {}

  getModulesList(): Promise<any> {
    return this._req.get('v1/service/account', true);
  }

}