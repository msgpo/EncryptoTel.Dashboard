import {BaseItemModel, PageInfoModel, PlayerModel, RecordModel} from "./base.model";
import {Type} from "class-transformer";
import {formatDate, formatDateTime} from "../shared/shared.functions";

export class CdrModel extends PageInfoModel {
    items: CdrItem[];
}

export class CdrItem extends BaseItemModel {
    public accountFile: AccountFileItem;
    public duration: number = 0;
    public source: string;
    public destination: string;
    public status: number;
    public statusName: string;
    public type: number;
    public tag: string;
    @Type(() => Date)
    public created: Date;
    public price: number;
    public contactId: number;

    public player: PlayerModel;
    public record: RecordModel;

    // public hover: boolean = false;
    // dropdown state vars
    public ddShow: boolean = false;
    public play: boolean = false;

    get displayDate() {
        return formatDate(this.created);
    }

    get displayDateTime() {
        return formatDateTime(this.created);
    }

    get displayDuration() {
        const sec_num = parseInt(`${this.duration}`, 10);
        const hours = Math.floor(sec_num / 3600) % 24;
        const minutes = Math.floor(sec_num / 60) % 60;
        const seconds = sec_num % 60;
        return [hours, minutes, seconds]
            .map(v => v < 10 ? '0' + v : v)
            .filter((v, i) => v !== '00 ' || i > 0)
            .join(':');
    }

    get displayStatus() {
        return this.statusName.toLowerCase();
    }

    get displayPrice() {
        return `$${this.price}`;
    }

    constructor() {
        super();
        this.player = new PlayerModel();
        this.record = new RecordModel();
    }
}

export class AccountFileItem {
    public id: number;
    public accountId: number;
    @Type(() => Date)
    public created: Date;
    public description: string;
    public duration: number;
    public externalId: number;
    public fileName: string;
    public fileNameMd5: string;
    public fileSize: number;
    public md5: string;
    public originalFileName: string;
    public type: string;
}

export class CdrMediaInfo {
    id: number;
    accountId: number;
    @Type(() => Date)
    created: Date;
    description: string;
    downloadHash: string;
    duration: number;
    externalId: number;
    fileLink: string;
    fileName: string;
    fileNameMd5: string;
    fileSize: number;
    md5: string;
    originalFileName: string;
    type: string;
}

export enum MediaState {
    LOADING = 'loading',
    PLAYING = 'playing',
    PAUSED = 'paused',
    ENDED = 'ended'
}