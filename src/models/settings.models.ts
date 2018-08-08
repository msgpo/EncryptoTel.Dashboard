import {BaseItemModel, PageInfoModel} from "./base.model";
import {Type} from "class-transformer";
import {formatDateTime} from "../shared/shared.functions";

export class SessionsModel extends PageInfoModel {
    items: SessionItem[] = [];
}

export class SessionItem extends BaseItemModel {
    country: string;
    ip: string;
    userAgent: string;
    userToken: string;
    session: string;
    @Type(() => Date)
    expires: Date;
    active: boolean;

    get displayExpires() {
        return formatDateTime(this.expires);
    }

}