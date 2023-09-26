const sqlite3 = require('sqlite3');


module.exports = class ServiceDatabase {

	initialize(fill_fake = false) {
        // Memory will need to be a file. Check for its existence only when pulling Service Index from BRIDGE fails.
        this.db = new sqlite3.Database(':memory:');

        return Promise.all([
            this.create_entries_table(fill_fake)
        ])
	}


    create_entries_table(fill_fake = false) {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE Entries (
                entryID NUMBER PRIMARY KEY, 
                userID TEXT, 
                entryType NUMBER, 
                contents TEXT, 
                timeAdded NUMBER)`, (create_table_error) => {
                    if(create_table_error) reject(create_table_error);
                    if(!fill_fake) { resolve(); return; }

                    this.db.run("INSERT INTO Entries VALUES(?, ?, ?, ?, ?)", 
                        [1, "Alameda", 0, "Test Entry Body", 1692470416845],
                        (insert_phony_error) => {
                            if(insert_phony_error) { 
                                reject(insert_phony_error); 
                            } else {
                                resolve();
                            }
                        }
                    );
            });

        });
    }

	find_entry(number) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT * FROM Entries WHERE entryID = ? ORDER BY timeAdded ASC LIMIT 1", [number], (get_err, result) => {
				if(result) {
					resolve(`${result}`)
				} else {
					reject(get_err);
				}
			});
		});
	}


	insert(body) {
		return new Promise((resolve, reject) => {
			var query = "INSERT INTO Entries (entryID, userID, entryType, contents, unix_clock_in) VALUES(?, ?, ?, ?, ?)";
			var values = [body.entryID, body.userID, body.entryType, body.contents, Date.now()]

			/*
				Check if this node is already in the table. If it is, we'll just try to update its time.
			*/
			this.db.get("SELECT * FROM Entries WHERE entryID = ?", [body.entryID], (get_err, result) => {
				if(result) {
					if(result.timeAdded < Date.now()-1000*10) {
						query = "UPDATE Entries SET timeAdded = ? WHERE entryID = ? "
						values = [Date.now(), body.entryID]
					} else if(result.entryID == body.entryID) { 
						resolve(body); return; 
					}
				}

				this.db.run(query, 
					values,
				    (query_err) => {
				    	console.log(query);
				    	if(query_err) { console.error(query, body, query_err); reject(query_err); }
				    	resolve(body);

				    	// Show all service nodes when a change has been made
						this.get_all_entries()
						.then((entries) => {
							console.log(entries);
						});

				    }
				);
			})
		})
	}

	get_all_entries() {
		return new Promise((resolve, reject) => {
		    this.db.all("SELECT * FROM Entries", (error, rows) => {
		    	if(error) { console.error("Could not view", error); reject(error); }
		    	resolve(rows);
			});
		});
	}
}
