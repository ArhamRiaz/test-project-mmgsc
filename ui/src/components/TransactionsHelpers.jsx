export const parseLogs = (logs) => {
    const transactions = [];
    const lines = logs.split('\n');
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i++];
      
      if (line.includes('TRANSACTION START')) {
        const transaction = {
          date: '',
          atmId: '',
          description: [],
          code: ''
        };
        
        // Process until TRANSACTION END
        while (i < lines.length && !lines[i].includes('TRANSACTION END')) {
          const currentLine = lines[i++];
          
          // Extract timestamp (code)
          const timeMatch = currentLine.match(/\[(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2})\]/);
          if (timeMatch) transaction.code = timeMatch[1];
          

          
          // Description events
          if (currentLine.includes('PIN ENTERED')) {
            transaction.description.push('PIN Verified, host approved');
          } 
          else if (currentLine.includes('WITHDRAWAL')) {
            const amountMatch = currentLine.match(/AMOUNT: (\d+\.\d{2})/);
            transaction.description.push(amountMatch ? `Withdrawal $${amountMatch[1]}` : 'Withdrawal');
          }
          
        }
        
        // Format final transaction
        if (transaction.pan) {
          transaction.date = new Date(transaction.code).toLocaleDateString();
          transaction.description = transaction.description.join('\n');
          transactions.push(transaction);
        }
      }
    }
    
    return transactions;
  };