import { ProjectStore, Project, Task } from '../client/ProjectStore'
import {observer} from 'mobx-react'

describe('ProjectStore', () => {
  it('creates new Projects', () => {
    const store = new ProjectStore(null, null, false, false)
    store.createProject('Project1')
    store.createProject('Project2')
    expect(store.projectList.length).toBe(2)
    expect(store.projectList[0].name).toBe('Project1')
    expect(store.projectList[1].name).toBe('Project2')
  })
  it('delete a project', () => {
    const store = new ProjectStore(null, null, false, false)
    store.createProject('Project1')
    const p2 = store.createProject('Project2')
    store.createProject('Project3')
    expect(store.projectList.length).toBe(3)
    store.removeProject(p2)
    expect(store.projectList.length).toBe(2)
    expect(store.projectList[0].name).toBe('Project1')
    expect(store.projectList[1].name).toBe('Project3')
  })
})

describe('Project', () => {
  it('create new Project', () => {
    const store = new ProjectStore(null, null, false, false)
    const p1 = new Project(store, 'project1', 'description1')
    expect(p1.name).toBe('project1')
    expect(p1.description).toBe('description1')
  })
  it('update project', () => {
    Date.now = jest.genMockFunction().mockReturnValue(1)
    const store = new ProjectStore(null, null, false, false)
    const p1 = new Project(store, 'project1', 'description1')
    let p1SaveUpdate = p1.lastUpdate
    console.log('p1SaveUpdate ' + p1SaveUpdate)
    expect(p1.name).toBe('project1')
    expect(p1.description).toBe('description1')
    Date.now = jest.genMockFunction().mockReturnValue(2)
    p1.updateName('projectNew')
    console.log('after name update ' + p1.lastUpdate)
    console.log('after name update Date.now()' + Date.now())
    expect(p1.lastUpdate).toBeGreaterThan(p1SaveUpdate)
    p1SaveUpdate = p1.lastUpdate
    Date.now = jest.genMockFunction().mockReturnValue(3)
    p1.updateDescription('descriptionNew')
    console.log('after description update ' + p1.lastUpdate)
    console.log('after description update Date.now()' + Date.now())
    expect(p1.name).toBe('projectNew')
    expect(p1.description).toBe('descriptionNew')
    expect(p1.lastUpdate).toBeGreaterThan(p1SaveUpdate)
  })
  it('add tasks to project', () => {
    const store = new ProjectStore(null, null, false, false)
    Date.now = jest.genMockFunction().mockReturnValue(1)
    const p1 = new Project(store, 'project1', 'description1')
    const t1 = new Task('task1', 'description1')
    const t2 = new Task('task2', 'description2')
    let p1SaveUpdate = p1.lastUpdate
    Date.now = jest.genMockFunction().mockReturnValue(2)
    p1.addTask(t1)
    expect(p1.taskList.length).toBe(1)
    expect(p1.taskList[0].name).toBe('task1')
    expect(p1.taskList[0].description).toBe('description1')
    expect(p1.lastUpdate).toBeGreaterThan(p1SaveUpdate)
    p1SaveUpdate = p1.lastUpdate
    Date.now = jest.genMockFunction().mockReturnValue(3)
    p1.addTask(t2)
    expect(p1.taskList.length).toBe(2)
    expect(p1.taskList[1].name).toBe('task2')
    expect(p1.taskList[1].description).toBe('description2')
    expect(p1.lastUpdate).toBeGreaterThan(p1SaveUpdate)
  })
  it('delete task from project', () => {
    const store = new ProjectStore(null, null, false, false)
    const p1 = new Project(store, 'project1', 'description1')
    const t1 = new Task('task1', 'description1')
    const t2 = new Task('task2', 'description2')
    const t3 = new Task('task3', 'description3')
    p1.addTask(t1)
    p1.addTask(t2)
    p1.addTask(t3)
    expect(p1.taskList.length).toBe(3)
    p1.removeTask(t2)
    expect(p1.taskList.length).toBe(2)
    expect(p1.taskList[0].name).toBe('task1')
    expect(p1.taskList[0].description).toBe('description1')
    expect(p1.taskList[1].name).toBe('task3')
    expect(p1.taskList[1].description).toBe('description3')
  })
  it('format project as JSON', () => {
    const createdTime = Date.now()
    const store = new ProjectStore(null, null, false, false)
    const p1 = new Project(store, 'project1', 'description1', 'key1', createdTime)
    const p1Json = {
      id: 'key1',
      pName: 'project1',
      pDescription: 'description1',
      pLastUpdate: createdTime,
      pTaskList: []
    }
    expect(p1.asJson).toEqual(JSON.stringify(p1Json))
  })
  it('format project with tasks as JSON', () => {
    Date.now = jest.genMockFunction().mockReturnValue(1)
    const store = new ProjectStore(null, null, false, false)
    const p1 = new Project(store, 'project1', 'description1', 'key1')
    const p1Json = {
      id: 'key1',
      pName: 'project1',
      pDescription: 'description1',
      pLastUpdate: Date.now(),
      pTaskList: [
        {id: 'tKey1', tName: 'task1', tDescription: 'description1'},
        {id: 'tKey2', tName: 'task2', tDescription: 'description2'}]
    }
    const t1 = new Task('task1', 'description1', 'tKey1')
    const t2 = new Task('task2', 'description2', 'tKey2')
    p1.addTask(t1)
    p1.addTask(t2)
    expect(p1.asJson).toEqual(JSON.stringify(p1Json))
  })
  it('restore project with tasks from JSON', () => {
    Date.now = jest.genMockFunction().mockReturnValue(1)
    const store = new ProjectStore(null, null, false, false)
    const p1 = new Project(store, 'project1', 'description1', 'key1')
    const t1 = new Task('task1', 'description1', 'tKey1')
    const t2 = new Task('task2', 'description2', 'tKey2')
    p1.addTask(t1)
    p1.addTask(t2)
    const p2 = new Project(store, '', '', 'key1')
     console.log('p1.asJson = ' + p1.asJson)
    p2.updateFromJson(JSON.parse(p1.asJson))
     console.log('p2.asJson = ' + p2.asJson)
    expect(p1).toEqual(p2)
  })
})

describe('Task', () => {
  it('create new Task', () => {
    Date.now = jest.genMockFunction().mockReturnValue(1)
    const store = new ProjectStore(null, null, false, false)
    const p1 = new Project(store, 'project1', 'description1', 'key1')
    const t1 = new Task('task1', 'description1')
    expect(t1.name).toBe('task1')
    expect(t1.description).toBe('description1')
  })
  it('update task', () => {
    Date.now = jest.genMockFunction().mockReturnValue(1)
    const store = new ProjectStore(null, null, false, false)
    const p1 = new Project(store, 'project1', 'description1', 'key1')
    const t1 = new Task('task1', 'description1')
    expect(t1.name).toBe('task1')
    expect(t1.description).toBe('description1')
    t1.updateName('taskNew')
    t1.updateDescription('descriptionNew')
    expect(t1.name).toBe('taskNew')
    expect(t1.description).toBe('descriptionNew')
  })
})
