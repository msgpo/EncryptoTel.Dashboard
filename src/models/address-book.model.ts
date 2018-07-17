import {BaseItemModel, PageInfoModel} from "./base.model";
import {CountryModel} from "./country.model";
import {plainToClass} from "class-transformer";

export class AddressBookModel extends PageInfoModel {
    items: AddressBookItem[];
    countries: CountryModel[];
    types: TypesModel;
}

export class AddressBookItem extends BaseItemModel {
    firstname: string;
    lastname: string;
    contactPhone: ContactValueModel[] = [];
    contactEmail: ContactValueModel[] = [];
    countryId: number;
    company: string;
    department: string;
    address: string;

    protected _country: CountryModel;

    constructor(response?) {
        super();
        if (response) {
            this.id = response.id;
            this.firstname = response.firstname;
            this.lastname = response.lastname;
            this.countryId = response.countryId;
            this.company = response.company;
            this.department = response.department;
            this.address = response.address;
            if (response.contactPhone) {
                for (let i = 0; i < response.contactPhone.length; i++) {
                    let item: ContactValueModel = response.contactPhone[i];
                    this.addContactPhone(plainToClass(ContactValueModel, item));
                }
            }
            if (response.contactEmail) {
                for (let i = 0; i < response.contactEmail.length; i++) {
                    let item: ContactValueModel = response.contactEmail[i];
                    this.addContactEmail(plainToClass(ContactValueModel, item));
                }
            }
        }
    }

    get phone() {
        return this.contactPhone.length > 0 ? this.contactPhone[0].value : null;
    }

    get email() {
        return this.contactEmail.length > 0 ? this.contactEmail[0].value : null;
    }

    get country() {
        return this._country;
    }

    set country(value) {
        this._country = value;
        this.countryId = value ? value.id : null;
    }

    addContactPhone(item: ContactValueModel) {
        // item.setParentObject(this);
        this.contactPhone.push(item);
    }

    addContactEmail(item: ContactValueModel) {
        // item.setParentObject(this);
        this.contactEmail.push(item);
    }

}

export class ContactValueModel extends BaseItemModel {
    value: string;
    typeId: number;
    types: TypesModel;
    protected _type;

    get type() {
        return this._type;
        // let item = this.types.contactPhone.find(item => item.id === this.typeId);
        // console.log('type', item);
        // return item;
    }

    set type(value) {
        this._type = value;
        this.typeId = value ? value.id : null;
    }

    resetType() {
        this._type = null;
    }

}

export class TypesModel {
    contactEmail: TypeItem[] = [];
    contactPhone: TypeItem[] = [];
}

export class TypeItem {
    id: number;
    value: string;
}
