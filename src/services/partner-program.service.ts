import {BaseService} from "./base.service";
import {PageInfoModel} from "../models/base.model";
import {PartnerProgramItem, PartnerProgramModel} from "../models/partner-program.model";

export class PartnerProgramService extends BaseService {

    save(id: number, name: string): Promise<any> {
        if (id) {
            return this.putById(id, {name: name});
        } else {
            return this.post('', {name: name});
        }
    }

    getItems(pageInfo: PageInfoModel, filter = null): Promise<PartnerProgramModel> {
        return super.getItems(pageInfo, filter).then((res: PartnerProgramModel) => {
            let pageInfo = this.plainToClassEx(PartnerProgramModel, PartnerProgramItem, res);
            return Promise.resolve(pageInfo);
        });
    }

    onInit() {
        this.url = 'v1/partner';
    }

}
