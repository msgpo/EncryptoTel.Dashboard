import {Type} from "class-transformer";
import {formatDate} from "../shared/shared.functions";

export class DashboardModel {
    balance: BalanceModel;
    tariffPlan: TariffPlanModel;
    numbers: NumberModel[];
    storage: StorageModel;
    callDetail: CallDetailModel[];

    get outersCount() {
        return this.numbers.length;
    }

    get innersCount() {
        let result = 0;
        this.numbers.map((item: NumberModel) => {
            result += item.innerCount;
        });
        return result;
    }

}

export class BalanceModel {
    value: number;
    currency: CurrencyModel;
    ett: number;
}

export class CurrencyModel {
    code: string;
    name: string;
    shortName: string;
}

export class TariffPlanModel {
    title: string = '';
    @Type(() => Date)
    expired: Date;
    sum: number = 0;

    get displayExpired() {
        return formatDate(this.expired);
    }
}

export class NumberModel {
    phoneNumber: string;
    innerCount: number;
    innerOnlineCount: number;
}

export class StorageModel {
    totalSize: number;
    usedSize: number;
    // availableSize: number;
    measure: string;

    get availableSize(): number {
        return Math.round((this.totalSize - this.usedSize) * 100) / 100;
    }
}


export class CallDetailItem {
    @Type(() => Date)
    callDate: Date;
    direction: number;
    source: string;
    destination: string;
    duration: number;
    status: number;
    isSms: number;
    name: string;
    loading: number = 0;

    get calculateDuration(): string {
        const sec = this.duration % 60;
        const min = ((this.duration - sec) / 60) % 60;
        const hr = ((this.duration - (sec + (min * 60))) / 60) / 60;
        return hr ? `${hr}h ${min}m ${sec}s` : min ? `${min}m ${sec}s` : sec ? `${sec}s` : null;
    }
}

export class CallDetailModel {
    @Type(() => Date)
    date: Date;
    @Type(() => CallDetailItem)
    list: CallDetailItem[] = [];

    get analyzeDate(): string {
        return formatDate(this.date);
    }
}
