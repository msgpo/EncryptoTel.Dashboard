import {Injectable} from '@angular/core';
import {RequestServices} from './request.services';
import {
    CallDetailItem,
    CallDetailModel,
    DashboardModel,
    StorageModel,
    TariffPlanModel
} from "../models/dashboard.model";
import {plainToClass} from 'class-transformer';
import {dateComparison} from '../shared/shared.functions';
import {WsServices} from "./ws.services";

@Injectable()
export class DashboardServices {

    constructor(private req: RequestServices,
                private ws: WsServices) {
    }

    dashboard: DashboardModel;

    // getDashboard(): Promise<any> {
    //     return this._req.get(`v1/dashboard`, true);
    // }

    getDashboard(): Promise<DashboardModel> {
        return this.req.get('v1/dashboard').then((res: DashboardModel) => {
            this.dashboard = plainToClass(DashboardModel, res);
            this.dashboard.storage = plainToClass(StorageModel, res['storage']);
            this.dashboard.tariffPlan = plainToClass(TariffPlanModel, res['tariffPlan']);
            this.ws.balance.balance = res.balance.value;
            const list = plainToClass(CallDetailItem, res['callDetail']);
            const dates: string[] = [];
            if (list) {
                list.forEach(item => {
                    const date = new Date(item.callDate);
                    const dateObj = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('.');
                    if (dates.indexOf(dateObj) === -1) {
                        dates.push(dateObj);
                    } else {
                        return;
                    }
                });
            }
            if (this.dashboard.callDetail) {
                this.dashboard.callDetail = [];
                dates.forEach(date => {
                    this.dashboard.callDetail.push(plainToClass(CallDetailModel, {
                        date: new Date(date),
                        list: []
                    }));
                });
            }
            if (list) {
                list.map((item: CallDetailItem) => {
                    this.dashboard.callDetail.find(historyItem => {
                        return dateComparison(historyItem.date, new Date(item.callDate));
                    }).list.push(plainToClass(CallDetailItem, item));
                });
            }
            // this._storage.writeItem('pbx_history', this.history);
            // this.touchHistory();
            return Promise.resolve(this.dashboard);
        });
    }

}
