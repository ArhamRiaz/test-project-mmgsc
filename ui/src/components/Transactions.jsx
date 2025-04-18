import { useState, useEffect} from "react";
import { parseLogs, getDatesInRange, getAtmTransacs } from "./TransactionsHelpers";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosSearch } from "react-icons/io";


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
    const [mastertransactions, setMasterTransactions] = useState([]);
    const [serialPlace, setSerialPlace] = useState('4 digit number')
    const [panPlace, setPanPlace] = useState('Partial or full card number')
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        atmId: '',
        pan: '',
        aid: '',
        serial:''
    })
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchATMS = async () => {
        try {
            const {data} = await axios.get(`${apiUrl}/getAtmList`)
            //data.unshift({name: "All ATMS", id: 567})
            setAtms(data)
          
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
                    const transactionsWithLogs = []
                    console.log(atms)
                    for (let i of atms){
                        const dateBuffer = dateRange
                        const tLog = await getAtmTransacs(i.id, dateBuffer, apiUrl)
                        transactionsWithLogs.push(tLog)
                    }

                    const t2 = transactionsWithLogs.flat()
                    const t3 = t2.filter(n => n)
                    console.log(t3)

                    setTransactions(t3);
                    setMasterTransactions(t3)
                } else {
                        
                  const transactionsWithLogs = await getAtmTransacs(params.atmId, dateRange, apiUrl)
                  console.log(transactionsWithLogs)
                  setTransactions(transactionsWithLogs);
                  setMasterTransactions(transactionsWithLogs)
                }
                
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

    const handleSearch = (term) => {
        console.log(term.target.value);
        setSearchTerm(term.target.value);
        const filteredTransactions = mastertransactions.filter((txn) =>
        txn.description.toLowerCase().includes(searchTerm)
              );
      console.log(filteredTransactions);
      if (filteredTransactions.length == 0){
        setTransactions(mastertransactions)
      } else {
        setTransactions(filteredTransactions)
      }
      
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
                  <h4 className="font-bold text-xl">All Transactions</h4>
                  <div >
                    <button >Print</button>
                    <button >Export</button>
                  </div>
                </div>
        
                <div style={styles.container}>
                    {/* Date  */}
                    <div >
                        <p className="text-left">Date</p>
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
                    </div>

                    {/* ATM ID Dropdown */}
                    <div style={styles.field}>
                        <label className="text-left">ATM ID</label>
                        <select className="bg-white shadow-md rounded px-4 py-3 mb-4 w-52 h-12
                                           hover:bg-gray-50 transition-colors duration-200"
                            name="atmId"
                            value={filters.atmId}
                            onChange={handleFilterChange}
                        >
                            <option value="All ATMS">All ATMS</option>
                            {atms.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Customer PAN Number */}
                    <div style={styles.field}>
                        <label className="text-left">Customer PAN Number</label>
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
                    <thead className="bg-gray-100 text-left font-semibold ">
                        <tr>
                        <th className="w-[10%] px-4 py-3 border-b">Date</th>
                        <th className="w-[10%] px-4 py-3 border-b">ATM ID</th>
                        <th className="w-[25%]px-4 py-3 border-b">Customer PAN</th>
                        <th className="w-[40%] px-4 py-3 border-b">Description</th>
                        <th className="w-[15%] px-4 py-3 border-b">Code</th>
                        <th className="border-b p-0" colSpan={0}>
                            <div className="flex items-center justify-end px-4 py-2">
                                <div className="relative">
                                    <input 
                                    type="text"
                                    placeholder="Search in results"
                                    className="bg-white shadow-md rounded text-center px-4 py-3 mb-4 w-52 h-8
                                                hover:bg-gray-50 transition-colors duration-200"
                                    onChange={handleSearch}
                                    />
                                    <div class="absolute inset-y-0 left-0 pl-3 
                                        flex items-center 
                                        pointer-events-none">
                                        <IoIosSearch  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4000 h-5 w-5"/>
                                    </div>
                                </div>
                            </div>
                        </th>
                        
                        
                        </tr>
                        
                    </thead>
                    
                    <tbody>
                    {transactions.map((txn, index) => (
                        <tr key={`${txn.devTime}-${index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b text-left">{txn.date}</td>
                        <td className="px-4 py-2 border-b text-left ">{txn.atm?.txt || 'N/A'}</td>
                        <td className="px-4 py-2 border-b text-left">{txn.pan || 'N/A'}</td>
                        <td className="px-4 py-2 border-b text-left">{txn.description || 'N/A'}</td>
                        <td className="px-4 py-2 border-b text-left">{txn.code || 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          );

};
