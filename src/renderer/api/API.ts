// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Parse } from 'parse';

export default class API {
  static initAPI() {
    Parse.initialize('frsAppID');
    Parse.serverURL = 'http://localhost:1337/parse';
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
