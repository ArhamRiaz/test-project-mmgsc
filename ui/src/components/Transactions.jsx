
const styles = {
    container: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      padding: "1rem",
    },
    field: {
      display: "flex",
      flexDirection: "column",
      minWidth: "200px",
    },
    rowy: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
        
    }

  };


export const Transactions = ({  }) => {
    return (
        
            <div style={styles.container}>

              {/* Headers */}
              <div  className="flex items- p-6 overflow-auto ml-64">
                <div style={styles.rowy} className="flex justify-between items-center mb-4 w-full" >
                  <h4 className="text-2xl font-bold">All Transactions</h4>
                  <div className="flex space-x-2">
                    <button className="bg-gray-200 text-right px-4 py-1 rounded">Print</button>
                    <button className="bg-blue-600 text-right text-white px-4 py-1 rounded">Export</button>
                  </div>
                </div>
        
                {/* Filter section */}
                {/* I think I may make these into separate components in the future, I'll see how I'm going to send requests to the backend*/}
                <div style={styles.container}>
                    {/* Date  */}
                    <div className="flex items-center gap-2">
                        <p className="whitespace-nowrap">Date</p>
                        <input type="date" className="border p-2 rounded" />
                    </div>

                    {/* ATM ID Dropdown */}
                    <div style={styles.field}>
                        <label>ATM ID</label>
                        <select>
                                <option>All ATMS</option>
                        </select>
                    </div>

                    {/* Customer PAN Number */}
                    <div style={styles.field}>
                        <label>Customer PAN Number</label>
                        <input placeholder="Partial or full card number" />
                    </div>

                    {/* EMV Chip AID Dropdown */}
                    <div style={styles.field}>
                        <label>EMV Chip AID</label>
                        <select>
                            <option>All applications</option>
                            <option>AID1</option>
                            <option>AID2</option>
                        </select>
                    </div>

                    {/* Transaction Serial Number */}
                    <div style={styles.field}>
                        <label>Transaction Serial Number</label>
                        <input placeholder="4 digit number" maxLength={4} />
                    </div>
                </div>

        
                {/* Transaction Table */}
                <div className="border rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">ATM ID</th>
                        <th className="text-left p-2">Customer PAN</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Code</th>
                      </tr>
                    </thead>
                    <tbody>
    {/* here is where you will display the data after fetching it from the backend*/}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );

};
