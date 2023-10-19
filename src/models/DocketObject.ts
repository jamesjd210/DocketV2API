import { ObjectId } from "mongodb";

export default class DocketObject {
    constructor(public companyName : string, public currApiForm: Object, public currApiRequest: Object, public codeTranslations: Object, public response : Object,  public id?: ObjectId) {}
}