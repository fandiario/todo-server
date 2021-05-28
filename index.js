const express = require ("express")
const cors = require ("cors")

// Import Router
const userRouter = require ("./routers/UserRouter")
const taskRouter = require ("./routers/TaskRouter")
const workspaceRouter = require ("./routers/WorkspaceRouter")

// Init Cors
const app = express()
app.use (cors())

// Init Body Parser
app.use (express.json ())

// Init Port
const PORT = 5000

// Router
// Home
app.get ("/", (req, res) => {
    res.send ("Hello from todo-list server")
})

// Route
app.use ("/user", userRouter)
app.use ("/workspace", workspaceRouter)
app.use ("/task", taskRouter)


app.listen (PORT, () => console.log (`App is listening on port: ${PORT}`))



