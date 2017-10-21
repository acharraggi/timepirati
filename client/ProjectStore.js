import {observable, computed, action, reaction} from 'mobx'
import {v4} from 'uuid'

export class ProjectStore {
  rootStore = null
  transportLayer = null
  @observable projectList = []
  @observable isLoading = true
  /**
   * Indicates whether changes in this object
   * should be submitted to the server
   */
  autoSave = true
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

  constructor (rootStore, transportLayer, autoSave = true, localSave = true) {
    this.autoSave = autoSave
    this.localSave = localSave
    this.rootStore = rootStore
    this.transportLayer = transportLayer // Thing that can make server requests for us
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
          // this.transportLayer.saveProject(json)
          this.transportLayer.insertUser(this.rootStore)
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
        this.isLoading = true
        // this.updateProjectFromServer(savedValue.projectList[0])
        savedValue.projectList.forEach(function (p) { this.updateProjectFromServer(p) }, this)
        this.isLoading = false
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
      p = new Project(this, '', '', json.id)  // project is restored, then updateFromJson will be called below
      p.updateFromJson(json)
      this.projectList.push(p)
    }
    if (json.isDeleted) {
      this.removeProject(p)
    } else {
      p.updateFromJson(json)
      console.log('project id restored:' + p.id)
    }
  }

  toJSON (nm) { // arg: object name
    // alert(nm); obj
    let o = {}
    for (let prop in this) {
      if (prop === 'autoSave' || prop === 'localSave' || prop === 'saveHandler' || prop === 'rootStore' ||
        prop === 'transportLayer' || prop === 'isLoading') {
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
  @action createProject (name = '', desc = '') {
    const p = new Project(this, name, desc)
    this.projectList.push(p)
    return p
  }

  @computed get asJson () {
    return JSON.stringify(this)
    // return JSON.stringify(this, ['id', 'myUserName', 'myIsAuthenticated', 'myRememberMe', 'myToken'])
  }

  /**
   * A Project was somehow deleted, clean it from the client memory
   */
  @action removeProject (project) {
    this.projectList.splice(this.projectList.indexOf(project), 1)
    project.dispose()
  }

  @action updateProject (project, newProject) {
    this.projectList.splice(this.projectList.indexOf(project), 1, newProject)
  }
}

export class Project {
  /**
   * unique id of this Project, immutable.
   */
  id = null

  @observable pName = ''
  @observable pDescription = ''
  @observable pLastUpdate = 0
  @observable pArchived = false
  @observable pTaskList = []

  store = null

  /**
   * Indicates whether changes in this object
   * should be submitted to the server
   */
  // autoSave = false
  /**
   * Indicates whether changes in this object
   * should be saved in localStorage
   */
  // localSave = true
  /**
   * Disposer for the side effect that automatically
   * stores this Project, see @dispose.
   */
  // saveHandler = null

  constructor (store, name = '', description = '', id = v4(), createdTime = Date.now()) {
    this.store = store
    this.id = id
    this.pName = name
    this.pDescription = description
    this.pLastUpdate = createdTime
    this.pArchived = false
    this.pTaskList = []
  }

  @computed get name () {
    return this.pName
  }
  @action updateName (name) {
    this.pName = name
    this.pLastUpdate = Date.now()
  }
  @computed get description () {
    return this.pDescription
  }
  @action updateDescription (description) {
    this.pDescription = description
    this.pLastUpdate = Date.now()
  }
  @action archive (value = true) {
    this.pArchived = value
    this.pLastUpdate = Date.now()
  }
  @computed get isArchived () {
    return this.pArchived
  }
  @computed get lastUpdate () {
    return this.pLastUpdate
  }
  // @action taskUpdated (updateTime) {
  //   this.pLastUpdate = updateTime
  // }
  @computed get taskList () {
    return this.pTaskList
  }
  @action addTask (task) {
    this.pTaskList.push(task)
    this.pLastUpdate = Date.now()
  }
  @action updateTaskName (idx, name) {
    this.pTaskList[idx].updateName(name)
    this.pLastUpdate = Date.now()
  }
  @action updateTaskDescription (idx, desc) {
    this.pTaskList[idx].updateDescription(desc)
    this.pLastUpdate = Date.now()
  }
  @action archiveTask (idx, value) {
    this.pTaskList[idx].archive(value)
    this.pLastUpdate = Date.now()
  }
  /**
   * Remove this Project from the client and server
   */
  @action delete () {
    // this.store.transportLayer.deleteProject(this.id);
    this.store.removeProject(this)
  }

  @computed get asJson () {
    return JSON.stringify(this, ['id', 'pName', 'pDescription', 'pLastUpdate', 'pArchived', 'pTaskList', 'tName', 'tDescription', 'tArchived'])
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
    this.pName = json.pName
    this.pDescription = json.pDescription
    this.pLastUpdate = json.pLastUpdate
    this.pArchived = json.pArchived
    if (json.pTaskList.length > 0) {
      json.pTaskList.forEach((t) => { let tsk = new Task('', '', t.id); tsk.updateFromJson(t); this.addTask(tsk) })
    }
  }
}

export class Task {
  /**
   * unique id of this Task, immutable.
   */
  id = null
  @observable tName
  @observable tDescription
  @observable tArchived

  constructor (name = '', description = '', id = v4()) {
    this.id = id
    this.tName = name
    this.tDescription = description
    this.tArchived = false
  }

  @action updateName (name) {
    this.tName = name
  }
  @computed get name () {
    return this.tName
  }

  @action updateDescription (description) {
    this.tDescription = description
  }
  @computed get description () {
    return this.tDescription
  }

  @action archive (value = true) {
    this.tArchived = value
  }
  @computed get isArchived () {
    return this.tArchived
  }

  @computed get asJson () {
    return JSON.stringify(this, ['id', 'tName', 'tDescription'])
  }

  /**
   * Update this task with information from the server or local storage
   */
  updateFromJson (json) {
    this.tName = json.tName
    this.tDescription = json.tDescription
    this.tArchived = json.tArchived
  }
}
