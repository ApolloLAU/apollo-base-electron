// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Parse } from 'parse';

class FRSWorker extends Parse.Object {
  constructor() {
    super('Worker');
  }

  private static getWorkersWithRole(role: string): Promise<Array<FRSWorker>> {
    return new Parse.Query(Parse.Role)
      .equalTo('name', role)
      .first()
      .then((roleObj: Parse.Role) => {
        return roleObj.getUsers().query().find();
      })
      .then((users: Array<Parse.User>) => {
        return Promise.all(
          users.map((u) =>
            new Parse.Query(FRSWorker).equalTo('user_id', u.id).first()
          )
        );
      });
  }

  static getFieldWorkers(): Promise<Array<FRSWorker>> {
    return this.getWorkersWithRole('field_responder');
  }

  static getBaseWorkers(): Promise<Array<FRSWorker>> {
    return this.getWorkersWithRole('base_worker');
  }

  static getById(id: string): Promise<FRSWorker> {
    return new Parse.Query(FRSWorker).equalTo('objectId', id).first();
  }

  getFirstName() {
    return this.get('firstname');
  }

  getLastName() {
    return this.get('lastname');
  }

  getImgURL() {
    return this.get('image_file').url();
  }

  getStatus() {
    return this.get('status');
  }

  getCellNbr() {
    return this.get('phoneNb');
  }

  getUserID() {
    return this.get('user_id');
  }

  getUsername(): Promise<string> {
    return new Parse.Query(Parse.User)
      .equalTo('objectId', this.getUserID())
      .first()
      .then((user: Parse.User) => {
        return user.getUsername();
      });
  }

  getRole(): Promise<string> {
    return this.getUsername().then((username) => {
      // eslint-disable-next-line promise/no-nesting
      return new Parse.Query(Parse.Role)
        .findAll()
        .then(async (roles: Parse.Role[]) => {
          for (let i = 0; i < roles.length; i++) {
            const r = roles[i];
            // eslint-disable-next-line no-await-in-loop
            const count = await r
              .getUsers()
              .query()
              .equalTo('username', username)
              .count();
            if (count === 1) return r.getName();
          }
          return '';
        });
    });
  }
}

class API {
  static initAPI() {
    Parse.initialize('frsAppID');
    Parse.serverURL = 'http://localhost:1337/parse';

    Parse.Object.registerSubclass('Worker', FRSWorker);
    console.log('API Initialized');
  }

  static async login(username: string, pass: string) {
    console.log(Parse);
    return Parse.User.logIn(username, pass);
  }

  static logout() {
    Parse.User.logOut();
  }

  static getLoggedInUser(): Parse.User | null {
    return Parse.User.current();
  }

  static getRoleForUser(user: Parse.User): Promise<string> {
    const query = new Parse.Query(Parse.Role);
    return query.find().then(async (roles: Array<Parse.Role>) => {
      let finalRole = '';
      for (const r of roles) {
        // eslint-disable-next-line no-await-in-loop
        const count = await r
          .getUsers()
          .query()
          .equalTo('username', user.getUsername())
          .count();
        if (count === 1) finalRole = r.getName();
      }
      return finalRole;
    });
    // for (ParseRole r : roles) {
    //   if(r.getUsers().getQuery().whereEqualTo("username", this.getUsername()).count() == 1) {
    //     return r.getName();
    //   }
    // }
  }

  static logOut() {
    Parse.User.logOut();
  }
}

export { API, FRSWorker };
