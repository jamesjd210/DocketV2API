import { ObjectId } from "mongodb";

export default class DocketObject {
    constructor(public currApiForm: Object, currApiRequest: Object, public codeTranslations: Object, public id?: ObjectId) {}
}