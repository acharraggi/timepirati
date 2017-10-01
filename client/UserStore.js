import {observable, computed, action, reaction} from 'mobx'
import {v4} from 'uuid'

export class User {
  id = null;
  @observable myUserName
  @observable myIsAuthenticated
  @observable myRememberMe
  @observable myToken

  /**
   * Indicates whether changes in this object
   * should be submitted to the server
   */
  autoSave = false
  /**
   * Indicates whether changes in this object
   * should be saved in localStorage
   */
  localSave = true
  /**
   * Disposer for the side effect that automatically
   * stores this counter, see @dispose.
   */
  saveHandler = null

  constructor (userName = '', id = v4()) {
    this.id = id
    this.myUserName = userName
    this.myIsAuthenticated = false
    this.myToken = ''
    this.myRememberMe = false
    console.log('new user with id = ' + id)
    this.saveHandler = reaction(
        // observe everything that is used in the JSON:
        () => this.asJson,
        // if autoSave is on, send json to server
        (json) => {
          if (this.autoSave) {
            // this.store.transportLayer.saveCounter(json)
          }
          if (this.localSave) {
            localStorage.user = json
          }
        }
    )
  }

  @action setUser (userName) {
    this.myUserName = userName
  }
  @action setRememberUser (b) {
    this.myRememberMe = b
  }
  @action userHasAuthenticated (authenticated, token) {
    this.myIsAuthenticated = authenticated
    if (authenticated) {
      this.myToken = token
    } else {
      this.myToken = ''
    }
  }
  @computed get userName () {
    return this.myUserName
  }
  get userId () {
    return this.id
  }
  @computed get isAuthenticated () {
    return this.myIsAuthenticated
  }
  @computed get rememberUser () {
    return this.myRememberMe
  }
  @computed get getIdToken () {
    return this.myToken
  }
  @computed get asJson () {
    return JSON.stringify(this, ['id', 'myUserName', 'myIsAuthenticated', 'myRememberMe', 'myToken'])
  }

  /**
   * Update this Counter with information from the server
   */
  @action updateFromJson (json) {
    this.myUserName = json.myUserName
    this.myIsAuthenticated = json.myIsAuthenticated
    this.myRememberMe = json.myRememberMe
    this.myToken = json.myToken
  }

  dispose () {
    // clean up the observer
    this.saveHandler()
  }
}

export class UserStore {
  @observable myUser

  constructor (rootStore) {
    this.rootStore = rootStore
    this.loadCounter()
  }

  loadCounter () {
    if (typeof (Storage) !== 'undefined') {
      // Code for localStorage/sessionStorage.
      if (localStorage.user) {
        const savedValue = JSON.parse(localStorage.user)
        this.myUser = new User('', savedValue.id)
        this.myUser.updateFromJson(savedValue)
      } else {
        // no user stored, create new
        this.myUser = new User()
        // but don't save it yet
      }
    } else {
      // Sorry! No Web Storage support.. Just create user
      this.myUser = new User()
    }
  }
  @action setUser (userName) {
    this.myUser.setUser(userName)
  }
  @action userHasAuthenticated (authenticated, token = '') {
    this.myUser.userHasAuthenticated(authenticated, token)
  }
  @action setRememberUser (b) {
    this.myUser.setRememberUser(b)
  }
  @computed get userName () {
    return this.myUser.userName
  }
  get userId () {
    return this.myUser.userId
  }
  @computed get isAuthenticated () {
    return this.myUser.isAuthenticated
  }
  @computed get rememberUser () {
    return this.myUser.rememberUser
  }
  @computed get getIdToken () {
    return this.myUser.getIdToken
  }
}
