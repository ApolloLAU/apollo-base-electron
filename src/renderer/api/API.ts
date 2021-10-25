import * as Parse from 'parse';

const parse = require('parse');

class District extends Parse.Object {
  constructor() {
    super('District');
  }

  setName(name: string) {
    this.set('name', name);
  }

  setLoc(loc: Parse.GeoPoint) {
    this.set('location', loc);
  }

  getLoc() {
    return this.get('location');
  }

  static createDistrict(
    name: string,
    loc: { lng: number; lat: number }
  ): Promise<District> {
    const district = new District();
    const pt = new Parse.GeoPoint({ latitude: loc.lat, longitude: loc.lng });
    district.setName(name);
    district.setLoc(pt);
    return district.save();
  }
}

class MedicalDataPt extends Parse.Object {
  constructor() {
    super('MedicalData');
  }

  getDataType(): string {
    return this.get('datatype');
  }

  getDataValue(): string {
    return this.get('value');
  }

  getRelatedMission(): Mission {
    return this.get('mission_record');
  }

  static async getMedicalDataForMission(
    missionId: string
  ): Promise<Array<MedicalDataPt>> {
    return new Parse.Query(MedicalDataPt)
      .equalTo('mission_record', missionId)
      .limit(10000) // do we need more than 10,000 values??Í
      .ascending('createdAt')
      .find();
  }

  // getRelatedPatient(): FRSPatient {

  // }
}

class ChatMessage extends Parse.Object {
  createdAt: any;

  constructor() {
    super('ChatMessage');
  }

  static getMessagesForMissionId(
    misionId: string
  ): Promise<Array<ChatMessage>> {
    return new Parse.Query(ChatMessage)
      .equalTo('for_mission', misionId)
      .ascending('createdAt')
      .find();
  }

  getSender(): MWorker {
    return this.get('sender');
  }

  isSenderBase(): boolean {
    // todo: maybe make this better?
    return this.getSender().getRole() === 'base_worker';
  }

  getMessage() {
    return this.get('message');
  }

  getImage() {
    const img = this.get('image');
    if (img !== undefined) return img.url();
    return null;
  }
}

class Mission extends Parse.Object {
  constructor() {
    super('Mission');
  }

  static getActiveMissions(): Promise<Array<Mission>> {
    return Parse.Cloud.run('getActiveMissions');
  }

  static getCompletedMissions(): Promise<Array<Mission>> {
    return new Parse.Query(Mission)
      .equalTo('status', 'complete')
      .includeAll()
      .find();
  }

  static getByID(id: string): Promise<Mission | undefined> {
    return new Parse.Query(Mission)
      .equalTo('objectId', id)
      .includeAll()
      .first();
  }

  getBaseWorkers(): Array<MWorker> {
    return this.get('base_workers');
  }

  getFieldWorkers(): Array<MWorker> {
    return this.get('field_workers');
  }

  getPatients(): Array<Parse.Object> {
    return this.get('patients');
  }

  addBaseWorker(worker: MWorker) {
    this.add('base_workers', worker);
  }

  addFieldWorker(worker: MWorker) {
    this.add('field_workers', worker);
  }

  addPatient(patient: Parse.Object) {
    this.add('patients', patient);
  }

  getLocation() {
    this.get('location');
  }

  setLocation(loc: Parse.GeoPoint) {
    this.set('location', loc);
  }

  setInitialDesc(desc: string) {
    this.set('initial_description', desc);
  }

  getInitialDesc(): string {
    return this.get('initial_description');
  }
}

class MWorker extends Parse.Object {
  constructor() {
    super('Worker');
  }

  private static getWorkersWithRole(
    role: string,
    district: District
  ): Promise<Array<MWorker>> {
    return new Parse.Query(MWorker)
      .equalTo('role', role)
      .equalTo('district', district)
      .find();
  }

  static getDistrictChiefs(district: District): Promise<Array<MWorker>> {
    return this.getWorkersWithRole('district_chief', district);
  }

  static getFieldWorkers(district: District): Promise<Array<MWorker>> {
    return this.getWorkersWithRole('field_responder', district);
  }

  static getBaseWorkers(district: District): Promise<Array<MWorker>> {
    return this.getWorkersWithRole('base_worker', district);
  }

  static getById(id: string): Promise<MWorker | undefined> {
    return new Parse.Query(MWorker).equalTo('objectId', id).first();
  }

  getFirstName() {
    return this.get('firstname');
  }

  setFirstName(fName: string) {
    this.set('firstname', fName);
  }

  getLastName() {
    return this.get('lastname');
  }

  setLastName(lName: string) {
    this.set('lastname', lName);
  }

  getImgURL() {
    if (this.get('image_file')) return this.get('image_file').url();
    return '';
  }

  setImg(base64Img: string, imgName: string) {
    const f = new Parse.File(imgName, { base64: base64Img });
    return f.save().then(() => this.set('image_file', f));
  }

  getCellNbr() {
    return this.get('phoneNb');
  }

  setCellNbr(nbr: string) {
    return this.set('phoneNb', nbr);
  }

  getUserID() {
    return this.get('user_id');
  }

  setUserID(id: string) {
    return this.set('user_id', id);
  }

  getUsername(): Promise<string | undefined> {
    return new Parse.Query(Parse.User)
      .equalTo('objectId', this.getUserID())
      .first()
      .then((user: Parse.User | undefined) => {
        if (user) return user.getUsername();
        return '';
      });
  }

  getDistrict(): District {
    return this.get('district');
  }

  setDistrict(district: District) {
    this.set('district', district);
  }

  getRole(): string {
    return this.get('role');
  }

  setRole(role: string) {
    this.set('role', role);
  }

  getStatus(): string {
    return this.get('status');
  }

  setStatus(status: string) {
    this.set('status', status);
  }
}

class API {
  static initAPI() {
    Parse.initialize('frsAppID');
    parse.serverURL = 'http://localhost:1337/parse';

    Parse.Object.registerSubclass('Worker', MWorker);
    Parse.Object.registerSubclass('Mission', Mission);
    Parse.Object.registerSubclass('ChatMessage', ChatMessage);
    Parse.Object.registerSubclass('MedicalData', MedicalDataPt);
    Parse.Object.registerSubclass('District', District);
    console.log('API Initialized');
  }

  static getWorkerForUser(user: Parse.User): Promise<MWorker | undefined> {
    return new Parse.Query(MWorker).equalTo('user_id', user.id).first();
  }

  static async login(username: string, pass: string) {
    console.log(Parse);
    return Parse.User.logIn(username, pass);
  }

  static getLoggedInUser(): Parse.User | undefined {
    return Parse.User.current();
  }

  static logOut() {
    const currentUser = API.getLoggedInUser();
    if (!currentUser) return Promise.resolve();
    return API.getWorkerForUser(currentUser)
      .then((worker) => {
        if (worker) {
          worker.setStatus('offline');
          return worker.save();
        }
        throw new Error('Worker was undefined');
      })
      .then(() => Parse.User.logOut());
  }
}

export { API, MWorker, Mission, ChatMessage, MedicalDataPt, District };
