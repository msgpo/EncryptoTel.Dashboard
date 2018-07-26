import {BaseItemModel, PageInfoModel} from "./base.model";

export class PhoneNumberModel extends PageInfoModel {
    items: PhoneNumberItem[];
}

export class PhoneNumberItem extends BaseItemModel {
    phoneNumber: string;
    status: number;
    providerId: number;
    sipInners: SipInnerModel[] = [];

    get innersCount() {
        return this.sipInners.length;
    }

    get defaultInner() {
        let result = 'Not defined'
        this.sipInners.map((item: SipInnerModel) => {
            if (item.default) {
                result = `#${item.phoneNumber}`;
            }
        });
        return result;
    }

    get statusName() {
        return !!this.status ? 'Enabled' : 'Disabled';
    }

    get typeName() {
        return this.providerId === 1 ? 'Internal' : 'External';
    }

}

export class SipInnerModel extends BaseItemModel {
    phoneNumber: string;
    default: boolean;
}