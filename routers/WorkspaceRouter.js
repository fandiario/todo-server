const express = require ("express")
const Router = express.Router ()

const jwtVerify = require ("../middlewares/jwtVerify")
const workspaceController = require ("../controllers/WorkspaceController")

Router.post ("/create-workspace",jwtVerify, workspaceController.onCreateWorkspace)
Router.post ("/:idWorkspace/assign-member",jwtVerify, workspaceController.onCreateMemberWorkspace)

Router.post ("/get-workspace-data", workspaceController.getDataWorkspace)
Router.post ("/get-workspace-by-owner", jwtVerify, workspaceController.getWorkspaceByOwner)
Router.post ("/get-workspace-by-member", jwtVerify, workspaceController.getWorkspaceByMember)
Router.post ("/get-members-from-workspace", jwtVerify, workspaceController.getMembersFromWorkspace)

Router.post ("/:idWorkspace/get-task-workspace", jwtVerify, workspaceController.getTaskByWorkspace)
Router.patch ("/:idWorkspace/set-default-workspace", jwtVerify, workspaceController.setDefaultWorkspace)
Router.patch ("/:idWorkspace/edit-workspace", jwtVerify, workspaceController.onEditWorkspace)

Router.post ("/:idWorkspace/delete-workspace", jwtVerify, workspaceController.onDeleteWorkspace)
Router.post ("/:idWorkspace/delete-member-from-workspace", jwtVerify, workspaceController.onDeleteMemberWorkspace)

module.exports = Router