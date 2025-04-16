import { useState, useEffect} from "react";
import { parseLogs, getDatesInRange } from "./TransactionsHelpers";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


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
    
    const [atms, setAtms] = useState([])
    const [aids, setAids] = useState([])
    const [transactions, setTransactions] = useState([]);
    const [serialPlace, setSerialPlace] = useState('4 digit number')
    const [panPlace, setPanPlace] = useState('Partial or full card number')
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        atmId: 'All ATMS',
        pan: '',
        aid: '',
        serial:''
    })
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchATMS = async () => {
        try {
            const {data} = await axios.get(`${apiUrl}/getAtmList`)
            setAtms(data)
            //console.log(data);
        } catch (error) {
            console.log("Error fetching ATMS: " + error)
        }
    }

    const fetchAids = async () => {
        try {
            const {data} = await axios.get(`${apiUrl}/getAidList`)
            setAids(data)
            //console.log(data);
        } catch (error) {
            console.log("Error fetching Aids: " + error)
        }
    }

    const fetchAtmTransacs = async () => {
        try {

            const data = await axios.get(`${apiUrl}/getAtmPastFutureTransactions/${38}/${1681851159000}`)
            
            console.log( data.data.txn);
            console.log(data)
        } catch (error) {
            console.log("error fetching atm transactions: " + error)
        }
    }

    const fetchLogs = async (atmId, datetime) => {
        try {

            const {data} = await axios.get(`${apiUrl}/getTransactionLog/${atmId}/${datetime}`)
            return data
            //console.log(data);
        } catch (error) {
            console.log("error fetching atm logs: " + error)
        }
    }

    const fetchTransactions = async () => {

        try {
            
            const params = {
                startDate: filters.startDate ? new Date(filters.startDate).getTime() : '',
                endDate: filters.endDate ? new Date(filters.endDate).getTime() : '',
                atmId: filters.atmId || '',
                pan: filters.pan || '',
                aid: filters.aid || '',
                serial: filters.serialNumber || ''
            };
            
            if (params.startDate != '' & params.atmId != '' & params.endDate != ''){

                const dateRange = getDatesInRange(params.startDate, params.endDate);
                
                if (params.atmId == "All ATMS"){
                    
                }
                const datePromises = dateRange.map(date => 
                    axios.get(`${apiUrl}/getAtmPastFutureTransactions/${params.atmId}/${date}`)
                  );
                  
                  const dateResponses = await Promise.all(datePromises);
                  
                  const transactionsWithLogs = await Promise.all(
                    dateResponses.flatMap(response => 
                      response.data.txn.map(async transaction => {
                        const logs = await fetchLogs(params.atmId, transaction.devTime);
                        return {
                          ...transaction,
                          description: logs,
                          date: new Date(transaction.devTime).toLocaleDateString()
                        };
                      })
                    )
                  );
                  
                  setTransactions(transactionsWithLogs);
            }
        } catch (error) {

            console.log("Error fetching transactions: " + error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
      fetchATMS();
      fetchAids();
      fetchAtmTransacs();
      //fetchLogs();
    
    }, [])

    useEffect(() => {
      fetchTransactions();
    }, [filters])
    
    
    return (
        
            <div style={styles.container}>

              {/* Headers */}
              <div  >
                <div style={styles.rowy}  >
                  <h4 >All Transactions</h4>
                  <div >
                    <button >Print</button>
                    <button >Export</button>
                  </div>
                </div>
        
                <div style={styles.container}>
                    {/* Date  */}
                    <div >
                        <p className=" text-left">Date</p>
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(dates) => {
                                const [start, end] = dates;
                                setStartDate(start);
                                setEndDate(end);
                                setFilters(prev => ({
                                ...prev,
                                startDate: start ? start.toISOString() : '',
                                endDate: end ? end.toISOString() : ''
                                }));
                            }}
                            isClearable={true}
                            placeholderText="Select date range"
                            className="bg-white shadow-md rounded px-4 py-3 mb-4 w-64 h-12 hover:bg-gray-50 transition-colors duration-200"
                            />  
                        {/* <input 
                            type="date" 
                            className="bg-white shadow-md rounded px-4 py-3 mb-4 w-52 h-12
                                       hover:bg-gray-50 transition-colors duration-200" 
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        /> */}
                    </div>

                    {/* ATM ID Dropdown */}
                    <div style={styles.field}>
                        <label className=" text-left">ATM ID</label>
                        <select className="bg-white shadow-md rounded px-4 py-3 mb-4 w-52 h-12
                                           hover:bg-gray-50 transition-colors duration-200"
                            name="atmId"
                            value={filters.atmId}
                            onChange={handleFilterChange}
                        >
                            <option value="">All ATMS</option>
                            {atms.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Customer PAN Number */}
                    <div style={styles.field}>
                        <label className=" text-left">Customer PAN Number</label>
                        <input className="bg-white shadow-md rounded text-center px-4 py-3 mb-4 w-52 h-12
                                          hover:bg-gray-50 transition-colors duration-200"
                            placeholder={panPlace}
                            onFocus={() => setPanPlace('')}
                            onBlur={() => setPanPlace('Partial or full card number')}
                            name="pan"
                            value={filters.pan}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* EMV Chip AID Dropdown */}
                    <div style={styles.field}>
                        <label className=" text-left">EMV Chip AID</label>
                        <select className="bg-white shadow-md rounded px-4 py-3 mb-4 w-52 h-12
                                           hover:bg-gray-50 transition-colors duration-200"
                            name="aid"
                            value={filters.aid}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Applications</option>
                            {aids.map((item) => (
                                <option key={item.aid} value={item.aid}>
                                    {item.aid}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Transaction Serial Number */}
                    <div style={styles.field}>
                        <label className=" text-left">Transaction Serial Number</label>
                        <input className="bg-white shadow-md rounded text-center px-4 py-3 mb-4 w-52 h-12
                                          hover:bg-gray-50 transition-colors duration-200"
                            placeholder={serialPlace}
                            onFocus={() => setSerialPlace('')}
                            onBlur={() => setSerialPlace('4 digit number')}
                            maxLength={4} 
                            name="serialNumber"
                            value={filters.serialNumber}
                            onChange={handleFilterChange}
                        />
                    </div>
                    
                </div>

                            
                {/* Transaction Table */}
                <div className="overflow-auto bg-white rounded shadow">
                    <table className="my-table">
                    <thead className="bg-gray-100 text-left font-semibold">
                        <tr>
                        <th className="px-4 py-3 border-b">Date</th>
                        <th className="px-4 py-3 border-b">ATM ID</th>
                        <th className="px-4 py-3 border-b">Customer PAN</th>
                        <th className="px-4 py-3 border-b">Description</th>
                        <th className="px-4 py-3 border-b">Code</th>
                        
                        </tr>
                        
                    </thead>
                    
                    <tbody>
                    {transactions.map((txn, index) => (
                        <tr key={`${txn.devTime}-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{txn.date}</td>
                        <td className="px-4 py-2 border-b">{txn.atm?.txt || 'N/A'}</td>
                        <td className="px-4 py-2 border-b">{txn.pan || 'N/A'}</td>
                        <td className="px-4 py-2 border-b">{txn.description || 'N/A'}</td>
                        <td className="px-4 py-2 border-b">{txn.code || 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          );

};
