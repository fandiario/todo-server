const db = require ("../connection/Connection")

// Create
const onCreateCategory = (req, res) => {
    try {
        const data = req.body
        const dataToken = req.dataToken

        if (!data.category || !data.idWorkspace) throw ({message: "Empty data field detected"})

        let querySearch = `SELECT * FROM users WHERE uid = '${dataToken.uid}'`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                // console.log (result[0])

                let dataToSend = {
                    category : data.category,
                    category_at_workspaces_id: data.idWorkspace
                }

                let queryInsert = `INSERT INTO category_tasks SET ?`
                db.query (queryInsert, dataToSend, (err, result) => {
                    try {
                        if (err) throw err

                        res.status (200).send ({
                            error: false,
                            id: result.insertId,
                            category: data.category,
                            message: "Data has been created successfully"
                        })


                    } catch (error) {
                        console.log (error)
                        res.status (500).send ({
                            error: true, 
                            message: error.message
                        }) 
                    }
                })
                
            } catch (error) {
                console.log (error)
                res.status (500).send ({
                    error: true,
                    message: error.message
                })
            }
        })
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

const onCreateTask = (req, res) => {
    try {
        const data = req.body
        const dataToken = req.dataToken

        if (!data.title || !data.description || !data.date_start || !data.date_end || !data.category_tasks_id || !data.idWorkspace) throw ({message: "Empty data field detected."})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                // console.log (result[0])

                let dataToSend = {
                    title : data.title,
                    description : data.description,
                    date_start: data.date_start,
                    date_end : data.date_end,
                    category_tasks_id: data.category_tasks_id,
                    category_tasks_category_at_workspaces_id: data.category_tasks_category_at_workspaces_id,
                    users_id: result[0].id,
                    workspaces_id: data.idWorkspace
                }

                let queryInsert = `INSERT INTO tasks SET ?`
                db.query (queryInsert, dataToSend, (err, result1) => {
                    try {
                        if (err) throw err

                        res.status (200).send ({
                            error: false,
                            id: result1.insertId,
                            title: data.title,
                            description: data.description,
                            date: data.date,
                            category_tasks_id: data.category_tasks_id,
                            created_by: result[0].email,
                            workspaces_id: data.workspaces_id
                        })

                    } catch (error) {
                        console.log (error)
                        res.status (500).send ({
                            error: true, 
                            message: error.message
                        })
                    }
                })

                
            } catch (error) {
                console.log (error)
                res.status (500).send ({
                    error: true,
                    message: error.message
                })
            }
        })
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

const onCreateTaskAssigned = (req, res) => {

    try {

        let dataTask = req.params
        let dataToken = req.dataToken
        let data = req.body

        if (!data.assignee_users_id) throw ({message: "Empty data field detected"})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                // console.log (result[0])

                let querySearch = `SELECT * FROM tasks WHERE id = ${dataTask.idTask}`
                db.query(querySearch, (err, result1) => {
                    try {
                        if (err) throw err

                        // console.log (result1[0])

                        let dataToSend = {
                            tasks_id: dataTask.idTask,
                            tasks_users_id: result[0].id,
                            tasks_category_tasks_id: result1[0].category_tasks_id,
                            tasks_category_tasks_category_at_workspaces_id: result1[0].category_tasks_category_at_workspaces_id,
                            tasks_workspaces_id: result1[0].workspaces_id,
                            assignee_users_id: data.assignee_users_id
                        }

                        let queryInsert = `INSERT INTO task_assignee SET ?`
                        db.query (queryInsert, dataToSend, (err, result2) => {
                            try {
                                if (err) throw err

                                res.status (200).send ({
                                    error: false,
                                    task: result1[0].title,
                                    assignee_users_id: data.assignee_users_id,
                                    message: `User with id ${data.assignee_users_id} has been assigned for this task successfully.`
                                })

                            } catch (error) {
                                console.log (error)
                                res.status (500).send ({
                                    error: true,
                                    message: error.message
                                })
                            }
                        })
                        
                    } catch (error) {
                        console.log (error)
                        res.status (500).send ({
                            error: true,
                            message: error.message
                        })
                    }
                })
                
            } catch (error) {
                console.log (error)
                res.status (500).send ({
                    error: true,
                    message: error.message
                })
            }
        })
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
   
}

// Read
const getCategoryByWorkspace = (req, res) => {

    try {
        let dataToken = req.dataToken
        let data = req.body

        if (!data.idWorkspace) throw ({message: "Empty data field detected."})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let queryGet = 
                `
                    SELECT category_tasks.id, category_tasks.category, category_tasks.is_default, category_tasks.created_at, category_tasks.category_at_workspaces_id FROM category_tasks 
                    JOIN workspaces ON category_at_workspaces_id = workspaces.id
                    WHERE workspaces.id = ${data.idWorkspace} OR category_tasks.is_default = 1;
                `
                db.query (queryGet, (err, result1) => {
                    try {
                        if (err) throw err
                        // console.log (result1)

                        res.status (200). send ({
                            error: false,
                            data: result1
                        })
                        
                    } catch (error) {
                        console.log (error)
                        res.status (500).send ({
                            error: true,
                            message: error.message
                        })
                    }
                })

            } catch (error) {
                console.log (error)
                res.status (500).send ({
                    error: true,
                    message: error.message
                })
            }
        })

    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

const getTaskbyId = (req, res) => {
    let data = req.body
    // console.log (data.idTask)

    let queryGet = 
    `
        SELECT tasks.id, title, description, date_start, date_end,  tasks.created_at, email, category FROM tasks
        JOIN users ON users.id = users_id
        JOIN category_tasks ON category_tasks.id = category_tasks_id
        WHERE tasks.id = ${data.idTask}
    `

    db.query (queryGet, (err, result) => {
        try {
            if (err) throw err

            // console.log (result[0])

            if (result.length === 1) {

                res.status (200).send ({
                    error: false,
                    id: result[0].id,
                    title: result[0].title,
                    description: result[0].description,
                    date_start: result[0].date_start,
                    date_end: result[0].date_end,
                    user: result[0].email,
                    category: result[0].category,
                    created_at: result[0].created_at,
                })


            } else {
                res.status (200).send ({
                    error: true,
                    message: "Data not found"
                })
            }
            
        } catch (error) {
            console.log (error)
            res.status (500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

const getTaskbyWorkspace = (req, res) => {
    try {
        let data = req.body
        let dataToken = req.dataToken

        if (!data.idWorkspace) throw ({message: "Empty data field detected."})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let queryGet = `SELECT * FROM tasks WHERE workspaces_id = ${data.idWorkspace}`
                db.query (queryGet, (err, result1) => {
                    if (result1.length === 0) {
                        res.status (200).send ({
                            error: false,
                            message: "No task yet."
                        })

                    } else {
                        res.status (200).send ({
                            error: false,
                            data: result1
                        })
                    }
                })
                
            } catch (error) {
                console.log (error)
                res.status (500).send ({
                    error: true,
                    message: error.message
                })
            }
        })        
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

const getAssigneeFromTask = (req, res) => {
    let data = req.body

    let querySearch = 
    `
        SELECT users.id, users.email FROM users
        JOIN task_assignee ON assignee_users_id = users.id
        JOIN tasks ON tasks_id = tasks.id
        WHERE tasks.id = ${data.idTask};
    `
    db.query (querySearch, (err, result) => {
        try {
            if (err) throw err

            if (result.length === 0) {
                res.status (200).send ({
                    error: false,
                    message: "You haven't assigned anyone for this task."
                })

            } else {
                res.status (200).send ({
                    error: false,
                    data: result
                })
            }
            
        } catch (error) {
            console.log (error)
            res.status (500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

// Update
const onUpdateTask = (req, res) => {
    // let data = req.body
    // let dataTask = req.params
    // let dataToken = req.dataToken

    // console.log (data)
    // console.log (dataToken)

    try {
        const data = req.body
        // const dataTask = req.params
        const dataToken = req.dataToken

        // console.log (data)
        // console.log (dataTask)
        // console.log (data.category_tasks_category_at_workspaces_id)

        if (!data.title || !data.description || !data.date_start ||!data.date_end || !data.category_tasks_id || !data.idWorkspace || !data.category_tasks_category_at_workspaces_id) throw ({message: "Empty data field detected."})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                // console.log (result)

                let queryGet = 
                `
                    SELECT * FROM tasks WHERE id = ${data.idTask}
                `
                db.query (queryGet, (err, result1) => {
                    try {
                        if (err) throw err

                        // console.log (result1)

                        if (result1.length === 1) {

                            let dataToSend = {
                                title: data.title,
                                description: data.description,
                                date_start: data.date_start,
                                date_end: data.date_end,
                                category_tasks_id: data.category_tasks_id,
                                category_tasks_category_at_workspaces_id: data.category_tasks_category_at_workspaces_id,
                                workspaces_id: data.idWorkspace
                            }

                            let queryEdit = `UPDATE tasks SET ? WHERE id = ?`
                            db.query (queryEdit, [dataToSend, data.idTask], (err, result2) => {
                                try {
                                    if (err) throw err

                                    res.status (200).send ({
                                        error: false,
                                        id: data.idTask,
                                        title: data.title,
                                        description: data.description,
                                        date_start: data.date_start,
                                        date_end: data.date_end,
                                        category_tasks_id: data.category_tasks_id,
                                        message: "Data has been updated"
                                    })
                                    
                                } catch (error) {
                                    console.log (error)
                                    res.status (500).send ({
                                        error: true,
                                        message: error.message
                                    }) 
                                }
                            })

                            // if (result1[0].users_id === result[0].id && data.category_tasks_id !== 3 && data.category_tasks_id !== 4) {
                            //     // console.log (result1)

                            //     let dataToSend = {
                            //         title: data.title,
                            //         description: data.description,
                            //         date_start: data.date_start,
                            //         date_end: data.date_end,
                            //         category_tasks_id: data.category_tasks_id,
                            //         category_tasks_category_at_workspaces_id: data.category_tasks_category_at_workspaces_id,
                            //         workspaces_id: data.idWorkspace
                            //     }

                            //     let queryEdit = `UPDATE tasks SET ? WHERE id = ?`
                            //     db.query (queryEdit, [dataToSend, data.idTask], (err, result2) => {
                            //         try {
                            //             if (err) throw err

                            //             res.status (200).send ({
                            //                 error: false,
                            //                 id: data.idTask,
                            //                 title: data.title,
                            //                 description: data.description,
                            //                 date_start: data.date_start,
                            //                 date_end: data.date_end,
                            //                 category_tasks_id: data.category_tasks_id,
                            //                 message: "Data has been updated"
                            //             })
                                        
                            //         } catch (error) {
                            //             console.log (error)
                            //             res.status (500).send ({
                            //                 error: true,
                            //                 message: error.message
                            //             }) 
                            //         }
                            //     })

                            // } else {
                            //     res.status (401).send ({
                            //         error: true,
                            //         message: "Unauthorized account"
                            //     })
                            // }

                        } else {
                            res.status (200).send ({
                                error: true,
                                message: "Data not found"
                            })
                        }
                        
                    } catch (error) {
                        console.log (error)
                        res.status (500).send ({
                            error: true,
                            message: error.message
                        }) 
                    }
                })
                
            } catch (error) {
                console.log (error)
                res.status (500).send ({
                    error: true,
                    message: error.message
                }) 
            }
        })
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

// Delete
const onDeleteCategory = (req, res) => {
    try {
        let data = req.body
        let dataToken = req.dataToken

        if (!data.idCategory) throw ({message: "Empty data field detected"})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let querySelect = 
                `
                    SELECT * FROM category_tasks
                    JOIN workspace_owners ON category_at_workspaces_id = workspaces_id
                    JOIN users ON created_by_users_id = users.id
                    WHERE users.id = ${result[0].id} AND category_tasks.id = ${data.idCategory};
                `
                db.query (querySelect, (err, result1) => {
                    try {
                        if (err) throw err

                        // console.log (result1)
                        if (result1[0].created_by_users_id === result[0].id) {

                            // Delete Task assignee

                            let queryDelete = `DELETE FROM task_assignee WHERE tasks_category_tasks_id = ${data.idCategory}`
                            db.query (queryDelete, (err, result2) => {
                                try {
                                    if (err) throw err
                                    
                                    // Delete Task
                                    let queryDelete = `DELETE FROM tasks WHERE category_tasks_id = ${data.idCategory}`
                                    db.query (queryDelete, (err, result3) => {
                                        try {
                                            if (err) throw err

                                            // Delete Category
                                            let queryDelete = `DELETE FROM category_tasks WHERE id = ${data.idCategory}`
                                            db.query (queryDelete, (err, result4) => {
                                                try {
                                                    if (err) throw err

                                                    res.status (200).send ({
                                                        error: false,
                                                        message: "Data has been deleted successfully."
                                                    })
                                                    
                                                } catch (error) {
                                                    console.log (error)
                                                    res.status (500).send ({
                                                        error: true,
                                                        message: error.message
                                                    }) 
                                                }
                                            })
                                            
                                        } catch (error) {
                                            console.log (error)
                                            res.status (500).send ({
                                                error: true,
                                                message: error.message
                                            }) 
                                        }
                                    })

                                } catch (error) {
                                    console.log (error)
                                    res.status (500).send ({
                                        error: true,
                                        message: error.message
                                    }) 
                                }
                            }) 

                        } else {
                            res.status (401).send ({
                                error: true,
                                message: "Unauthorized account"
                            })
                        }
                        
                    } catch (error) {
                        console.log (error)
                        res.status (500).send ({
                            error: true,
                            message: error.message
                        }) 
                    }
                })
                
            } catch (error) {
                console.log (error)
                res.status (500).send ({
                    error: true,
                    message: error.message
                })  
            }
        })
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        }) 
    }
}


const onDeleteTask = (req, res) => {
    try {
        // let data = req.body
        let dataTask = req.params
        let dataToken = req.dataToken

        // if (!data.idTask) throw ({message: "Empty data field detected"})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let queryGet = `SELECT * FROM tasks WHERE id = ${dataTask.idTask}`
                db.query (queryGet, (err, result1) => {
                    try {
                        if (err) throw err

                        // console.log (result1)

                        if (result1.length === 1) {
                            if (result1[0].users_id === result[0].id && result1[0].category_tasks_id !== 3 && result1[0].category_tasks_id !== 4){

                                let queryDelete = `DELETE FROM task_assignee WHERE tasks_id = ${dataTask.idTask}`
                                db.query (queryDelete, (err, result2) => {
                                    try {
                                        if (err) throw err

                                        let queryDelete = `DELETE FROM tasks WHERE id = ${dataTask.idTask}`
                                        db.query (queryDelete, (err, result3) => {
                                            try {
                                                if (err) throw err

                                                res.status (200).send ({
                                                    error: false,
                                                    id: result1[0].id,
                                                    title: result1[0].title,
                                                    description: result1[0].description,
                                                    date_start: result1[0].date_start,
                                                    date_end: result1[0].date_end,
                                                    message: "Data has been deleted"

                                                })
                                                
                                            } catch (error) {
                                                console.log (error)
                                                res.status (500).send ({
                                                    error: true,
                                                    message: error.message
                                                }) 
                                            }
                                        })

                                    } catch (error) {
                                        console.log (error)
                                        res.status (500).send ({
                                            error: true,
                                            message: error.message
                                        }) 
                                    }
                                })

                            } else {
                                res.status (401).send ({
                                    error: true,
                                    message: "Unauthorized account"
                                })
                            }

                        } else {
                            res.status (200).send ({
                                error: true,
                                message: "Data not found"
                            })
                        }
                        
                    } catch (error) {
                        console.log (error)
                        res.status (500).send ({
                            error: true,
                            message: error.message
                        }) 
                    }
                })

            } catch (error) {
                console.log (error)
                res.status (500).send ({
                    error: true,
                    message: error.message
                }) 
            }
        })

    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

const onDeleteAssignee = (req, res) => {
    try {
        let data = req.body
        let dataTask = req.params
        let dataToken = req.dataToken

        if (!data.idUser) throw ({message: 'Empty data field detected.'})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query(querySearch, (err, result) => {
            try {
                if (err) throw err

                let querySelect = `SELECT * FROM task_assignee WHERE tasks_id = ${dataTask.idTask} AND assignee_users_id = ${data.idUser}`
                db.query (querySelect, (err, result1) => {
                    try {
                        if (err) throw err
                        
                        if (result[0].id === result1[0].tasks_users_id) {

                            let queryDelete = `DELETE FROM task_assignee WHERE tasks_id = ${dataTask.idTask} AND assignee_users_id = ${data.idUser}`
                            db.query (queryDelete, (err, result2) => {
                                try {
                                    if (err) throw err

                                    res.status (200).send ({
                                        error: false,
                                        message: `User with id: ${data.idUser} has been removed from this task.`
                                    })
                                    
                                } catch (error) {
                                    console.log (error)
                                    res.status (500).send ({
                                        error: true,
                                        message: error.message
                                    }) 
                                }
                            })

                        } else {
                            res.status (401).send ({
                                error: true,
                                message: "Unauthorized account"
                            })
                        }

                    } catch (error) {
                        console.log (error)
                        res.status (500).send ({
                            error: true,
                            message: error.message
                        }) 
                    }
                })
                
            } catch (error) {
                console.log (error)
                res.status (500).send ({
                    error: true,
                    message: error.message
                }) 
            }
        })
        
    } catch (error) {
        console.log (error)
        res.status (406).send ({
            error: true,
            message: error.message
        })  
    }
}

 
module.exports = {
    onCreateCategory,
    onCreateTask,
    onCreateTaskAssigned,
    getCategoryByWorkspace,
    getTaskbyWorkspace,
    getTaskbyId,
    getAssigneeFromTask,
    onUpdateTask,
    onDeleteCategory,
    onDeleteTask,
    onDeleteAssignee
}