import { ProjectStore, Project, Task } from "../client/ProjectStore"

describe("Project", () => {
  it("create new Project", () => {
    const store = new ProjectStore
    const p1 = new Project(store,'project1','description1')
    expect(p1.name).toBe('project1')
    expect(p1.description).toBe('description1')
  });
  it("update project", () => {
    const store = new ProjectStore
    const p1 = new Project(store,'project1','description1')
    expect(p1.name).toBe('project1')
    expect(p1.description).toBe('description1')
    p1.updateName('projectNew')
    p1.updateDescription('descriptionNew')
    expect(p1.name).toBe('projectNew')
    expect(p1.description).toBe('descriptionNew')
  })
  it("add tasks to project", () => {
    const store = new ProjectStore
    const p1 = new Project(store,'project1','description1')
    const t1 = new Task('task1','description1')
    const t2 = new Task('task2','description2')
    p1.addTask(t1)
    expect(p1.taskList.length).toBe(1)
    expect(p1.taskList[0].name).toBe('task1')
    expect(p1.taskList[0].description).toBe('description1')
    p1.addTask(t2)
    expect(p1.taskList.length).toBe(2)
    expect(p1.taskList[1].name).toBe('task2')
    expect(p1.taskList[1].description).toBe('description2')
  })
  it("delete task from project", () => {
    const store = new ProjectStore
    const p1 = new Project(store,'project1','description1')
    const t1 = new Task('task1','description1')
    const t2 = new Task('task2','description2')
    const t3 = new Task('task3','description3')
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
});
describe("Task", () => {
  it("create new Task", () => {
    const t1 = new Task('task1','description1')
    expect(t1.name).toBe('task1')
    expect(t1.description).toBe('description1')
  });
  it("update task", () => {
    const t1 = new Task('task1','description1')
    expect(t1.name).toBe('task1')
    expect(t1.description).toBe('description1')
    t1.updateName('taskNew')
    t1.updateDescription('descriptionNew')
    expect(t1.name).toBe('taskNew')
    expect(t1.description).toBe('descriptionNew')
  })
});
describe("ProjectStore", () => {
  it("creates new Projects", () => {
    const store = new ProjectStore
    store.createProject("Project1")
    store.createProject("Project2")
    expect(store.projectList.length).toBe(2)
    expect(store.projectList[0].name).toBe("Project1")
    expect(store.projectList[1].name).toBe("Project2")
  });
  it("deletes a project", () => {
    const store = new ProjectStore
    store.createProject("Project1")
    const p2 = store.createProject("Project2")
    store.createProject("Project3")
    expect(store.projectList.length).toBe(3)
    store.removeProject(p2)
    expect(store.projectList.length).toBe(2)
    expect(store.projectList[0].name).toBe("Project1")
    expect(store.projectList[1].name).toBe("Project3")
  })
});
