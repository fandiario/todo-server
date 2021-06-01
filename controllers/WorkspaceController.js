const db = require ("../connection/Connection")


// Create
const onCreateWorkspace = (req, res) => {
    try {
        const data = req.body
        const dataToken = req.dataToken

        if (!data.title) throw ({message: "Empty data field detected."})
        
        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let dataToSend = {
                    title : data.title
                }

                // console.log (result[0].id)

                let queryInsert = `INSERT INTO workspaces SET ?`
                db.query (queryInsert, dataToSend, (err, result1) => {
                    try {
                        if (err) throw err

                        let dataToSend = {
                            workspaces_id : result1.insertId,
                            created_by_users_id : result[0].id
                        }

                        let queryInsert = `INSERT INTO workspace_owners SET ?`
                        db.query (queryInsert, dataToSend, (err, result2) => {
                            try {
                                if (err) throw err

                                res.status (200).send ({
                                    error: false,
                                    workspace: data.title,
                                    owner: result.email,
                                    message: `Workspace ${data.title} has been created successfully.` 
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

const onCreateMemberWorkspace = (req, res) => {
    try {
        const dataToken = req.dataToken
        const dataWorkspace = req.params
        const data = req.body

        // console.log (dataWorkspace)

        if (!data.email || !dataWorkspace.idWorkspace) throw ({message: "No user(s) or workspace(s) assigned."})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let querySearch = `SELECT * FROM users WHERE email = '${data.email}'`
                db.query (querySearch, (err, result1) => {
                    try {
                        if (err) throw err

                        if (result1[0] === undefined) {
                            // console.log ("undefined")
                            res.status (200).send ({
                                error: true,
                                message: "User is not exist or has not registered yet."
                            })

                        } else if (result1[0].id === result[0].id) {
                            res.status (200).send ({
                                error: true,
                                message: "User has been added to the workspace as creator of workspace."
                            })

                        } else if (result1.length === 1) {

                            let querySelect = `SELECT * FROM workspace_members WHERE workspaces_id = ${dataWorkspace.idWorkspace} AND members_users_id = ${result1[0].id}`
                            db.query (querySelect, (err, result2) => {
                                try {
                                    if (err) throw err

                                    if (result2.length === 0) {

                                        let dataToSend = {
                                            workspaces_id: dataWorkspace.idWorkspace,
                                            members_users_id: result1[0].id
                                        }

                                        let queryInsert = `INSERT INTO workspace_members SET ?`
                                        db.query (queryInsert, dataToSend, (err, result3) => {
                                            try {
                                                if (err) throw err

                                                res.status (200).send ({
                                                    error: false,
                                                    workspaces_id: data.workspaces_id,
                                                    members_users_id: result1[0].id,
                                                    message: `User ${data.email} has been added to workspace.`
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
                                        res.status (200).send ({
                                            error: true,
                                            message: "User has been added to the workspace as a member."
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

                        } else {
                            res.status (200).send ({
                                error: true,
                                message: "User is not found or has not registered yet."
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

// Read
const getDataWorkspace = (req, res) => {
    try {
        let data = req.body
        // let dataToken = req.dataToken

        if (!data.idWorkspace) throw ({message: "Empty data field detected"})
        
        let querySearch = 
        `
            SELECT * FROM workspaces
            JOIN workspace_owners ON workspace_owners.workspaces_id = workspaces.id
            JOIN users ON created_by_users_id = users.id
            WHERE workspaces.id = ${data.idWorkspace}
        `

        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                if (result.length === 1) {
                    // console.log (result[0])
                    res.status (200).send ({
                        error: false,
                        data: result[0]
                    })

                } else {
                    res.status (200).send ({
                        error: true,
                        message: "Data is not found."
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
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
    
}


const getWorkspaceByOwner = (req, res) => {
    let dataToken = req.dataToken
    let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
    
    db.query (querySearch, (err, result) => {
        try {
            if (err) throw err
            // console.log (result[0])
            
            let querySearch = 
            `
                SELECT * FROM workspaces
                JOIN workspace_owners ON workspaces_id = workspaces.id
                JOIN users ON created_by_users_id = users.id
                WHERE created_by_users_id = ${result[0].id};
            `
            db.query (querySearch, (err, result1) => {
                try {
                    if (err) throw err

                    if (result1.length === 0) {

                        res.status (200).send ({
                            error: false,
                            message: "This user has no workspace data"
                        })

                    } else {
                        res.status (200).send ({
                            error: false,
                            data: result1
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
}

const getWorkspaceByMember = (req, res) => {
    let dataToken = req.dataToken
    let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
    
    db.query (querySearch, (err, result) => {
        try {
            if (err) throw err
            // console.log (result[0])
            
            let querySearch = 
            `
                SELECT * FROM workspaces
                JOIN workspace_members ON workspaces_id = workspaces.id
                JOIN users ON members_users_id = users.id
                WHERE members_users_id = ${result[0].id};
            `
            db.query (querySearch, (err, result1) => {
                try {
                    if (err) throw err

                    if (result1.length === 0) {

                        res.status (200).send ({
                            error: false,
                            message: "This user has no workspace data"
                        })

                    } else {
                        res.status (200).send ({
                            error: false,
                            data: result1
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
}

const getMembersFromWorkspace = (req, res) => {
    try {
        let data = req.body
        let dataToken = req.dataToken

        if (!data.workspaces_id) throw ({message: "Empty data field detected"})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let querySearch = 
                `
                    SELECT users.id, users.email FROM users
                    JOIN workspace_members ON workspace_members.members_users_id = users.id
                    JOIN workspaces ON workspace_members.workspaces_id = workspaces.id
                    WHERE workspaces.id = ${data.workspaces_id};
                `

                db.query (querySearch, (err, result1) => {
                    try {
                        if (err) throw err

                        res.status (200).send ({
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

const getTaskByWorkspace = (req, res) => {
    try {
        let data = req.params
        let dataToken = req.dataToken

        if (!data.idWorkspace) throw ({message: "Workspace is not found."})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let querySearch = 
                `   
                    SELECT * FROM tasks 
                    WHERE workspaces_id = ${data.idWorkspace};
                `
                db.query (querySearch, (err, result1) => {
                    try {
                        if (err) throw err

                        if (result1.length === 0) {
                            res.status (200).send ({
                                error: false,
                                message: "No task yet"
                            })

                        } else {
                            res.status (200).send ({
                                error: false,
                                idWorkspace: data.idWorkspace,
                                created_by : result[0].email,
                                data: result1
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

// Update
const setDefaultWorkspace = (req, res) => {
    try {
        let data = req.params
        let dataToken = req.dataToken

        if (!data.idWorkspace) throw ({message: "Workspace is not found."})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                // search workspace owned by id
                let queryCheck  = 
                `
                    SELECT * FROM workspaces
                    JOIN workspace_owners ON workspaces_id = workspaces.id
                    JOIN users ON created_by_users_id = users.id
                    WHERE users.id = ${result[0].id} AND workspaces.is_default = 1;
                `

                db.query (queryCheck, (err, outcome) => {
                    try {
                        if (err) throw err

                        if (outcome.length === 0) {

                            let querySearch = `SELECT * FROM workspaces WHERE id = ${data.idWorkspace}`
                            db.query (querySearch, (err, result1) => {
                                try {
                                    if (err) throw err

                                    if (result1.length === 1) {
                                        
                                        let queryUpdate = `UPDATE workspaces SET is_default = 1 WHERE id = ${data.idWorkspace}`
                                        db.query (queryUpdate, (err, result2) => {
                                            try {
                                                if (err) throw err

                                                res.status (200).send ({
                                                    error: false,
                                                    id: result1[0].id,
                                                    title: result[0].title,
                                                    message: "Workspace has been updated to user's default workspace."
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
                                        res.status (200).send ({
                                            error: true,
                                            message: "Workspace is not exist."
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

                        } else {
                            res.status (200).send ({
                                error: true,
                                message: "Another workspace has been set as Default already.",
                                data: outcome
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

const onEditWorkspace = (req, res) => {
    try {
        let dataWorkspace = req.params
        let data = req.body
        let dataToken = req.dataToken

        if (!data.title) throw ({message: "Empty data field detected."})

        let querySearch = `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let queryCheck  = 
                `
                    SELECT * FROM workspaces
                    JOIN workspace_owners ON workspaces_id = workspaces.id
                    JOIN users ON created_by_users_id = users.id
                    WHERE users.id = ${result[0].id};
                `

                db.query (queryCheck, (err, result1) => {
                    try {
                        if (err) throw err

                        let dataToSend = 
                        {
                            title: data.title,
                            is_default: 0
                        }
        
                        let queryUpdate  = `UPDATE workspaces SET ? WHERE id = ${dataWorkspace.idWorkspace}`
                        db.query (queryUpdate, dataToSend, (err, result1) => {
                            try {
                                if (err) throw err
                                
                                res.status (200).send ({
                                    error: false,
                                    id: dataWorkspace.idWorkspace,
                                    title: data.title,
                                    message: "Data has been updated."
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

// Delete
const onDeleteWorkspace = (req, res) => {
    let dataWorkspace = req.params
    let dataToken = req.dataToken

    let querySearch =  `SELECT * FROM users WHERE uid = ${dataToken.uid}`
    db.query (querySearch, (err, result) => {
        try {
            if (err) throw err

            let querySearch = 
            `
                SELECT * FROM workspaces
                JOIN workspace_owners ON workspaces_id = workspaces.id
                WHERE workspaces.id = ${dataWorkspace.idWorkspace};
            `

            db.query (querySearch, (err, result1) => {
                try {
                    if (err) throw err

                    // console.log (result1)

                    if (result1.length === 1) {
                        if (result[0].id === result1[0].created_by_users_id) {

                            let queryDelete = `DELETE FROM workspace_owners WHERE workspaces_id = ${dataWorkspace.idWorkspace}`
                            db.query (queryDelete, (err, result2) => {
                                try {
                                    if (err) throw err

                                    let queryDelete = `DELETE FROM workspace_members WHERE workspaces_id = ${dataWorkspace.idWorkspace}`
                                    db.query (queryDelete, (err, result3) => {
                                        try {
                                            if (err) throw err

                                            let queryDelete = `DELETE FROM task_assignee WHERE tasks_category_tasks_category_at_workspaces_id = ${dataWorkspace.idWorkspace}`
                                            db.query (queryDelete, (err, result4) => {
                                                try {
                                                    if (err) throw err

                                                    let queryDelete = `DELETE FROM tasks WHERE workspaces_id = ${dataWorkspace.idWorkspace}`
                                                    db.query (queryDelete, (err, result5) => {
                                                        try {
                                                            if (err) throw err

                                                            let queryDelete = `DELETE FROM workspaces WHERE id = ${dataWorkspace.idWorkspace}`
                                                            db.query (queryDelete, (err, result6) => {
                                                                try {
                                                                    if (err) throw err

                                                                    res.status (200).send ({
                                                                        error: false,
                                                                        id: dataWorkspace.idWorkspace,
                                                                        title: result1[0].title,
                                                                        message: `Workspace ${result1[0].title} has been deleted.`
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
                            message: "Unknwon workspace id or data has been deleted."
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
}

const onDeleteMemberWorkspace = (req, res) => {
    try {
        let data = req.body
        let dataWorkspace = req.params
        let dataToken = req.dataToken

        if (!data.members_users_id) throw ({message: " Empty data field detected."})

        let querySearch =  `SELECT * FROM users WHERE uid = ${dataToken.uid}`
        db.query (querySearch, (err, result) => {
            try {
                if (err) throw err

                let querySearch = `SELECT * FROM workspace_members WHERE workspaces_id = ${dataWorkspace.idWorkspace} AND members_users_id = ${data.members_users_id}`

                db.query (querySearch, (err, result1) => {
                    try {
                        if (err) throw err

                        if (result1.length === 1) {

                            let queryDelete = `DELETE FROM workspace_members WHERE workspaces_id = ${dataWorkspace.idWorkspace} AND members_users_id = ${data.members_users_id}`
                            db.query (queryDelete, (err, result2) => {
                                try {
                                    if (err) throw err

                                    res.status (200).send ({
                                        error: false,
                                        idWorkspace : dataWorkspace.idWorkspace,
                                        idUser: data.members_users_id,
                                        message: `User has been deleted from this workspace's membership.`

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
                            res.status (200).send ({
                                error: true,
                                message: "Undefined user or data has been deleted."
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
    onCreateWorkspace,
    onCreateMemberWorkspace,
    getDataWorkspace,
    getWorkspaceByOwner,
    getWorkspaceByMember,
    getMembersFromWorkspace,
    getTaskByWorkspace,
    setDefaultWorkspace,
    onEditWorkspace,
    onDeleteWorkspace,
    onDeleteMemberWorkspace
}