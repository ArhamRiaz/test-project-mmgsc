import axios from 'axios';


export const parseLogs = (logs) => {

    const lines = logs.split('\n');

    return lines[0];
  };

  export const getDatesInRange = (startDate, endDate) => {
    if (!startDate || !endDate) return [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) return [];
    
    const dates = [];
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
      dates.push(new Date(currentDate).getTime());
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  export const fetchLogs = async (atmId, datetime) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {

        const {data} = await axios.get(`${apiUrl}/getTransactionLog/${atmId}/${datetime}`)
        return data

    } catch (error) {
        console.log("error fetching atm logs: " + error)
    }
}

export const getAtmTransacs = async (atmId, dateRange, apiUrl) => {
    try {

      const datePromises = dateRange.map(date => 
        axios.get(`${apiUrl}/getAtmPastFutureTransactions/${atmId}/${date}`)
      );
      
      const dateResponses = await Promise.all(datePromises);
      console.log(dateResponses)
      const transactionPromises = dateResponses
        .filter(response => response.data?.txn?.length > 0)
        .flatMap(response => 
          response.data.txn.map(async transaction => {
            console.log(typeof(response.data.d))
            try {
              const logs = await fetchLogs(atmId, transaction.devTime);
              return {
                ...transaction,
                description: typeof logs === 'object' ? JSON.stringify(parseLogs(logs)) : parseLogs(logs),
                date: new Date(response.data.d).toLocaleDateString(),
                code: transaction.ttp.descr
              };
            } catch (error) {
              //console.error(`Error fetching logs for transaction ${transaction.devTime}:`, error);
              return {
                ...transaction,
                description: "Error loading logs",
                date: new Date(response.data.d).toLocaleDateString()
              };
            }
          })
        );
  

      const transactionsWithLogs = await Promise.all(transactionPromises);
      return transactionsWithLogs.filter(t => t); 
  
    } catch (error) {
      console.error("Error in getAtmTransacs:", error);
      return []; 
    }
  };