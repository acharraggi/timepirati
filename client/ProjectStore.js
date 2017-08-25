import {observable, computed, action} from 'mobx'
import {v4} from 'uuid'

export class ProjectStore {
  // transportLayer;
  @observable projectList = []
  // @observable isLoading = true

  constructor (/* transportLayer */) {
    // this.transportLayer = transportLayer; // Thing that can make server requests for us
    // this.transportLayer.onReceiveProjectUpdate(updatedProject => this.updateProjectFromServer(updatedProject));
    this.loadProjects()
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
  }

  /**
   * Update a Project with information from the server. Guarantees a Project
   * only exists once. Might either construct a new Project, update an existing one,
   * or remove an Project if it has been deleted on the server.
   */
  updateProjectFromServer (json) {
    var Project = this.projectList.find(Project => Project.id === json.id)
    if (!Project) {
      Project = new Project(this, json.id)
      this.projectList.push(Project)
    }
    if (json.isDeleted) {
      this.removeProject(Project)
    } else {
      Project.updateFromJson(json)
    }
  }

  /**
   * Creates a fresh Project on the client and server
   */
  @action createProject (name, desc = '') {
    const p = new Project(this, name, desc)
    this.projectList.push(p)
    return p
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
  id = null;

  @observable name = '';
  @observable description = '';
  @observable taskList = [];

  store = null;

  /**
   * Indicates whether changes in this object
   * should be submitted to the server
   */
  autoSave = true;

  /**
   * Disposer for the side effect that automatically
   * stores this Project, see @dispose.
   */
  saveHandler = null;

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
    //     }
    // );
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

  /**
   * Update this Project with information from the server
   */
  @action updateFromJson (json) {
    // make sure our changes aren't send back to the server
    this.autoSave = false
    this.completed = json.completed
    // this.task = json.task;
    this.autoSave = true
  }

  dispose () {
    // clean up the observer
    // this.saveHandler();
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

  @computed get asJson () {
    return {
      id: this.id,
      name: this.name,
      description: this.description
    }
  }

  /**
   * Update this Project with information from the server
   */
  // updateFromJson(json) {
  //   // make sure our changes aren't send back to the server
  //   this.autoSave = false;
  //   this.completed = json.completed;
  //   this.task = json.task;
  //   this.autoSave = true;
  // }
  //
  dispose () {
    // clean up the observer
    // this.saveHandler();
  }
}
