import {observable, computed, action, reaction} from 'mobx'
import {v4} from 'uuid'

export class ProjectStore {
  // transportLayer;
  @observable projectList = []
  // @observable isLoading = true
  /**
   * Indicates whether changes in this object
   * should be submitted to the server
   */
  autoSave = false
  /**
   * Indicates whether changes in this object
   * should be saved in local storage
   */
  localSave = true
  /**
   * Disposer for the side effect that automatically
   * stores this Project, see @dispose.
   */
  saveHandler = null

  constructor (/* transportLayer */) {
    // this.transportLayer = transportLayer; // Thing that can make server requests for us
    // this.transportLayer.onReceiveProjectUpdate(updatedProject => this.updateProjectFromServer(updatedProject));
    if (typeof (Storage) === 'undefined') {
      this.localSave = false
    }
    this.loadProjects()
    this.saveHandler = reaction(
      // observe everything that is used in the JSON:
      () => this.asJson,
      // if autoSave is on, send json to server
      (json) => {
        if (this.autoSave) {
          this.store.transportLayer.saveProject(json)
        }
        if (this.localSave) {
          localStorage.projectList = json
        }
      }
    )
  }

  /**
   * Fetches all Project's from the server
   */
  loadProjects () {
    // this.isLoading = true;
    // this.transportLayer.fetchProjects().then(fetchedProjects => {
    //   fetchedProjects.forEach(json => this.updateProjectFromServer(json));
    //   this.isLoading = false;
    // })
    if (typeof (Storage) !== 'undefined') {
      // Code for localStorage/sessionStorage.
      if (localStorage.projectList) {
        // restore stored project list
        console.log('localStorage found for projectList')
        const savedValue = JSON.parse(localStorage.projectList)
        console.log('number of projects: ' + savedValue.projectList.length)
        // this.updateProjectFromServer(savedValue.projectList[0])
        savedValue.projectList.forEach(function (p) { this.updateProjectFromServer(p) }, this)
      } else {
        // no projectList stored, just use empty projectList
      }
    } else {
      // Sorry! No Web Storage support.. Just use empty projectList
    }
  }

  /**
   * Update a Project with information from the server. Guarantees a Project
   * only exists once. Might either construct a new Project, update an existing one,
   * or remove an Project if it has been deleted on the server.
   */
  updateProjectFromServer (json) {
    console.log('restoring project.id = ' + json.id)
    let p = this.projectList.find(Proj => Proj.id === json.id)
    if (!p) {
      p = new Project(this, json.id)
      json.taskList.forEach(function (t) { let tsk = new Task(t.id); tsk.updateFromJson(t); p.addTask(tsk) })
      this.projectList.push(p)
    }
    if (json.isDeleted) {
      this.removeProject(p)
    } else {
      p.updateFromJson(json)
    }
  }

  toJSON (nm) { // arg: object name
    // alert(nm); obj
    let o = {}
    for (let prop in this) {
      if (prop === 'autoSave' || prop === 'localSave' || prop === 'saveHandler') {
        continue // don't send to stringify
      } else { // to pass value unchanged
        o[prop] = this[prop]
      }
    }
    return o // passed to stringify
  }

  /**
   * Creates a fresh Project on the client and server
   */
  @action createProject (name, desc = '') {
    const p = new Project(this, name, desc)
    this.projectList.push(p)
    return p
  }

  @computed get asJson () {
    return JSON.stringify(this)
  }

  /**
   * A Project was somehow deleted, clean it from the client memory
   */
  @action removeProject (Project) {
    this.projectList.splice(this.projectList.indexOf(Project), 1)
    Project.dispose()
  }
}

export class Project {
  /**
   * unique id of this Project, immutable.
   */
  id = null

  @observable name = ''
  @observable description = ''
  @observable taskList = []

  store = null

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
   * stores this Project, see @dispose.
   */
  saveHandler = null

  constructor (store, name, description = '', id = v4()) {
    this.store = store
    this.id = id
    this.name = name
    this.description = description
    this.taskList = []

    // this.saveHandler = reaction(
    //     // observe everything that is used in the JSON:
    //     () => this.asJson,
    //     // if autoSave is on, send json to server
    //     (json) => {
    //       if (this.autoSave) {
    //         this.store.transportLayer.saveProject(json);
    //       }
    //       if (this.localSave) {
    //         localStorage.project = json
    //       }
    //     }
    // )
  }

  @action addTask (task) {
    this.taskList.push(task)
  }
  @action removeTask (task) {
    this.taskList.splice(this.taskList.indexOf(task), 1)
  }

  @action updateName (name) {
    this.name = name
  }
  @action updateDescription (description) {
    this.description = description
  }

  /**
   * Remove this Project from the client and server
   */
  @action delete () {
    // this.store.transportLayer.deleteProject(this.id);
    this.store.removeProject(this)
  }

  @computed get asJson () {
    return JSON.stringify(this, ['id', 'name', 'description', 'taskList'])
  }

  toJSON (nm) { // arg: object name
    // alert(nm); obj
    let o = {}
    for (let prop in this) {
      if (prop === 'store' || prop === 'autoSave' || prop === 'localSave' || prop === 'saveHandler') {
        continue // don't send to stringify
      } else { // to pass value unchanged
        o[prop] = this[prop]
      }
    }
    return o // passed to stringify
  }

  /**
   * Update this Project with information from the server
   */
  @action updateFromJson (json) {
    // make sure our changes aren't send back to the server
    this.autoSave = false
    this.name = json.name
    this.description = json.description
    this.autoSave = true
  }

  dispose () {
    // clean up the observer
    // this.saveHandler()
  }
}

export class Task {
  /**
   * unique id of this Task, immutable.
   */
  id = null
  @observable name = ''
  @observable description = ''

  constructor (name, description = '', id = v4()) {
    this.id = id
    this.name = name
    this.description = description
  }

  @action updateName (name) {
    this.name = name
  }
  @action updateDescription (description) {
    this.description = description
  }

  // using JSON.stringify at the project level
  // @computed get asJson () {
  //   return {
  //     id: this.id,
  //     name: this.name,
  //     description: this.description
  //   }
  // }

  /**
   * Update this task with information from the server or local storage
   */
  updateFromJson (json) {
    // make sure our changes aren't send back to the server
    // this.autoSave = false
    this.name = json.name
    this.description = json.description
    // this.autoSave = true
  }

  // dispose () {
  //   // clean up the observer
  //   this.saveHandler()
  // }
}
