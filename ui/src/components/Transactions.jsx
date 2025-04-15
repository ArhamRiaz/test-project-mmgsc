import { useState, useEffect} from "react";
import { parseLogs } from "./TransactionsHelpers";
import Divider from '@mui/material/Divider';
import axios from 'axios';

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
    const [filters, setFilters] = useState({
        date: '',
        atmId: '',
        pan: '',
        aid: '',
        serial:''
    })
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
                datetime: filters.date ? new Date(filters.date).getTime() : '',
                atmId: filters.atmId || '',
                pan: filters.pan || '',
                aid: filters.aid || '',
                serial: filters.serialNumber || ''
            };
            
            const  data  = await axios.get(`${apiUrl}/getAtmPastFutureTransactions/${params.atmId}/${params.datetime}`);

            for (let i = 0; i <data.data.txn.length; i++){
                const d2 = await fetchLogs(params.atmId, (data.data.txn)[i].devTime)
                //console.log(d2)
                data.data.txn[i].description =d2
                console.log(parseLogs(d2));
            }
            //const d2 = await fetchLogs(params.atmId, (data.txn)[0].devtime)
            
            setTransactions(data.data.txn);
            console.log(data.data.txn[0])
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
              <div  className="flex items- p-6 overflow-auto ml-64">
                <div style={styles.rowy} className="flex justify-between items-center mb-4 w-full" >
                  <h4 className="text-2xl font-bold">All Transactions</h4>
                  <div className="flex space-x-20">
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
                        <input 
                            type="date" 
                            className="border p-2 rounded" 
                            name="date"
                            value={filters.date}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* ATM ID Dropdown */}
                    <div style={styles.field}>
                        <label>ATM ID</label>
                        <select 
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
                        <label>Customer PAN Number</label>
                        <input 
                            placeholder="Partial or full card number" 
                            name="pan"
                            value={filters.pan}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* EMV Chip AID Dropdown */}
                    <div style={styles.field}>
                        <label>EMV Chip AID</label>
                        <select 
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
                        <label>Transaction Serial Number</label>
                        <input 
                            placeholder="4 digit number" 
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
                    <tr ></tr>
                    <tbody>
                        {transactions.map((txn) => (
                        <tr key={txn.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">{txn.date}</td>
                            <td className="px-4 py-2 border-b">{txn.atm?.txt}</td>
                            <td className="px-4 py-2 border-b">{txn.pan}</td>
                            <td className="px-4 py-2 border-b">{txn.description}</td>
                            <td className="px-4 py-2 border-b">{txn.code}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          );

};
