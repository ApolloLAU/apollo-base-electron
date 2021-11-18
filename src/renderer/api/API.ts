import * as Parse from 'parse';

const parse = require('parse');

class Patient extends Parse.Object {
  // first name
  // last name
  // home address
  // current loc?
  // cell nb
  // dob
  // blood type
  // height
  // weight
  // allergies
  // previous medical conditions?

  constructor() {
    super('Patient');
  }

  static createEmptyPatient() {
    const p = new Patient();
    p.setFirstName('');
    p.setHeight(-1.0);
    p.setHomeAddress('');
    p.setAllergies('');
    p.setBloodType('');
    p.setPrevConditions(false);
    p.setCellNbr('');
    p.setDOB(new Date(0));
    p.setEmergencyNbr('');
    p.setLastName('');
    p.setWeight(-1.0);
    return p;
  }

  getAbnormalities() {
    return this.get('abnormalities') || [];
  }

  setAbnormalities(abns: []) {
    this.set('abnormalities', abns);
  }

  static getById(id: string): Promise<Patient | undefined> {
    return new Parse.Query(Patient).equalTo('objectId', id).first();
  }

  getSex(): string {
    return this.get('sex');
  }

  setSex(sex: string) {
    this.set('sex', sex);
  }

  getEmergencyNbr(): string {
    return this.get('emergency_nbr');
  }

  setEmergencyNbr(nbr: string) {
    this.set('emergency_nbr', nbr);
  }

  static getAllPatients(): Promise<Array<Patient>> {
    return new Parse.Query(Patient).find();
  }

  getFirstName(): string {
    return this.get('first_name');
  }

  setFirstName(name: string) {
    this.set('first_name', name);
  }

  getLastName(): string {
    return this.get('last_name');
  }

  setLastName(name: string) {
    this.set('first_name', name);
  }

  getHomeAddress(): string {
    return this.get('address');
  }

  setHomeAddress(addr: string) {
    this.set('address', addr);
  }

  getCellNbr() {
    return this.get('phoneNb');
  }

  setCellNbr(nbr: string) {
    return this.set('phoneNb', nbr);
  }

  getDOB(): Date {
    return this.get('dob');
  }

  setDOB(dob: Date) {
    this.set('dob', dob);
  }

  getBloodType(): string {
    return this.get('blood_type');
  }

  setBloodType(bloodType: string) {
    this.set('blood_type', bloodType);
  }

  getHeight(): number {
    return this.get('height');
  }

  setHeight(height: number) {
    this.set('height', height);
  }

  getWeight(): number {
    return this.get('weight');
  }

  setWeight(weight: number) {
    this.set('weight', weight);
  }

  getAllergies(): string {
    return this.get('allergies');
  }

  setAllergies(allergies: string) {
    this.set('allergies', allergies);
  }

  getPrevConditions(): boolean {
    return this.get('prev_conditions');
  }

  setPrevConditions(prevConditions: boolean) {
    this.set('prev_conditions', prevConditions);
  }

  getFormattedName() {
    return `${this.getFirstName() || ''} ${this.getLastName() || ''}`;
  }
}

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
  constructor() {
    super('ChatMessage');
    this.setMessage('');
    this.set('image', undefined);
  }

  static getMessageForMissionQuery(
    missionId: string
  ): Parse.Query<ChatMessage> {
    return new Parse.Query(ChatMessage)
      .equalTo('for_mission', missionId)
      .ascending('createdAt');
  }

  static getMessagesForMissionId(
    missionId: string
  ): Promise<Array<ChatMessage>> {
    return this.getMessageForMissionQuery(missionId).find();
  }

  setSender(w: MWorker) {
    this.set('sender', w);
  }

  getSender(): MWorker {
    return this.get('sender');
  }

  isSenderBase(): boolean {
    // todo: maybe make this better?
    return this.getSender().getRole() === 'base_worker';
  }

  setMission(missionId: string) {
    this.set('for_mission', missionId);
  }

  setMessage(msg: string) {
    this.set('message', msg);
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

  static createDeployableMission(): Mission {
    const m = new Mission();
    m.set('base_workers', []);
    m.set('field_workers', []);
    m.set('patients', []);
    m.setStatus('deployable');
    m.setInitialDesc('');
    m.setFinalDesc('');
    return m;
  }

  static getDeployableMissions(): Promise<Array<Mission>> {
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

  static getWorkerActiveMissionQuery(
    currentWorker: MWorker
  ): Parse.Query<Mission> {
    return new Parse.Query(Mission)
      .equalTo('status', 'active')
      .equalTo('base_workers', currentWorker);
  }

  static getMissionsForCivilian(civ: Patient): Promise<Array<Mission>> {
    return new Parse.Query(Mission)
      .equalTo('status', 'complete')
      .equalTo('patients', civ)
      .find();
  }

  static getCompletedMissionsForWorker(w: MWorker): Promise<Array<Mission>> {
    return new Parse.Query(Mission)
      .equalTo('status', 'complete')
      .equalTo(
        w.getRole() === 'base_worker' ? 'base_workers' : 'field_workers',
        w
      )
      .find();
  }

  static getWorkerActiveMission(
    currentWorker: MWorker
  ): Promise<Mission | null> {
    return this.getWorkerActiveMissionQuery(currentWorker)
      .find()
      .then((missions: Array<Mission>) => {
        console.log('active missions:', missions);
        if (missions.length !== 0) {
          return missions[0];
        }
        return null;
      });
  }

  getBaseWorkers(): Array<MWorker> {
    return this.get('base_workers');
  }

  getFieldWorkers(): Array<MWorker> {
    return this.get('field_workers');
  }

  getPatients(): Array<Patient> {
    return this.get('patients');
  }

  addBaseWorker(worker: MWorker) {
    this.add('base_workers', worker);
  }

  removeBaseWorker(worker: MWorker) {
    this.remove('base_workers', worker);
  }

  addFieldWorker(worker: MWorker) {
    this.add('field_workers', worker);
  }

  addPatient(patient: string | Patient) {
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

  setFinalDesc(desc: string) {
    this.set('final_description', desc);
  }

  getFinallDesc(): string {
    return this.get('final_description');
  }

  setFormattedLocation(l: string) {
    this.set('formatted_loc', l);
  }

  getFormattedLocation() {
    return this.get('formatted_loc');
  }

  setStatus(status: string) {
    this.set('status', status);
  }

  getStatus(): string {
    return this.get('status');
  }

  formatPatientNames() {
    const patients = this.getPatients();
    if (patients.length === 1) {
      return patients[0].getFormattedName();
    }
    if (patients.length > 1) {
      return 'Multiple Patients';
    }
    return 'No patients';
  }

  getQueryForPatients() {
    const patients = this.getPatients();
    const pIds = patients.map((p) => p.id);
    return new Parse.Query(Patient).containedIn('objectId', pIds);
  }
}

class MWorker extends Parse.Object {
  constructor() {
    super('Worker');
  }

  static getWorkerQueryForRole(
    role: string,
    district: District
  ): Parse.Query<MWorker> {
    return new Parse.Query(MWorker)
      .equalTo('role', role)
      .equalTo('district', district);
  }

  private static getWorkersWithRole(
    role: string,
    district: District
  ): Promise<Array<MWorker>> {
    return this.getWorkerQueryForRole(role, district).find();
  }

  static getDistrictChiefs(district: District): Promise<Array<MWorker>> {
    return this.getWorkersWithRole('district_chief', district);
  }

  static getFieldWorkers(district: District): Promise<Array<MWorker>> {
    return this.getWorkersWithRole('field_worker', district);
  }

  static getFieldWorkerQuery(district: District): Parse.Query<MWorker> {
    return this.getWorkerQueryForRole('field_worker', district);
  }

  static getBaseWorkers(district: District): Promise<Array<MWorker>> {
    return this.getWorkersWithRole('base_worker', district);
  }

  static getById(id: string): Promise<MWorker | undefined> {
    return new Parse.Query(MWorker).equalTo('objectId', id).first();
  }

  getFormattedName(): string {
    return `${this.getFirstName()} ${this.getLastName()}`;
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
    const apiUrl = 'https://apollo-frs-backend.herokuapp.com/parse';
    // const apiUrl = 'http://localhost:1337/parse';
    Parse.initialize('frsAppID');
    parse.serverURL = apiUrl;

    Parse.Object.registerSubclass('Worker', MWorker);
    Parse.Object.registerSubclass('Mission', Mission);
    Parse.Object.registerSubclass('ChatMessage', ChatMessage);
    Parse.Object.registerSubclass('MedicalData', MedicalDataPt);
    Parse.Object.registerSubclass('District', District);
    Parse.Object.registerSubclass('Patient', Patient);
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
      .then(() => Parse.User.logOut())
      .catch(() => Parse.User.logOut());
  }
}

export { API, MWorker, Mission, ChatMessage, MedicalDataPt, District, Patient };
