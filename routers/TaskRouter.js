const express = require ("express")
const Router = express.Router ()

const jwtVerify = require ("../middlewares/jwtVerify")
const taskController = require ("../controllers/TaskController")

Router.post ("/create-category",jwtVerify, taskController.onCreateCategory)
Router.post ("/create-task",jwtVerify, taskController.onCreateTask)
Router.post ("/:idTask/assign-task",jwtVerify, taskController.onCreateTaskAssigned)

Router.post ("/get-category-by-workspace", jwtVerify, taskController.getCategoryByWorkspace)
Router.post ("/get-task-by-workspace", jwtVerify, taskController.getTaskbyWorkspace)
Router.post ("/get-data-task", taskController.getTaskbyId)
Router.post ("/get-assignee-from-task", taskController.getAssigneeFromTask)

Router.patch ("/edit-task", jwtVerify, taskController.onUpdateTask)

Router.post ("/delete-category", jwtVerify, taskController.onDeleteCategory)
Router.post ("/:idTask/delete-task", jwtVerify, taskController.onDeleteTask)
Router.post ("/:idTask/delete-assignee", jwtVerify, taskController.onDeleteAssignee)

module.exports = Router