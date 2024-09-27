import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Excel Data Extractor</h1>  
    <input type="file" id="file-input" accept=".xlsx, .xls" />
    <pre id="output"><code></code></pre>
  
  </div>
`
document.getElementById('file-input').addEventListener('change', handleFile, false);

function handleFile(event) {
  const file = event.target.files[0]; // Get the selected file
  if (!file) {
      return;
  }

  const reader = new FileReader(); // Create a FileReader instance
  reader.onload = function (e) {
      const arrayBuffer = e.target.result; // Get the result from FileReader

      // Read the workbook
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Get the first sheet name
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName]; // Access the first sheet

      // Convert the sheet to JSON format
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false }); // Set raw to false for text

      // Extract only the first 5 columns
      const extractedData = jsonData.map(row => ({
          tktnbr: row["tktnbr"], // First column
          pax: row["pax"], // First column
          pnr: row["pnr"], // First column
          Issuer: row["Issuer"], // First column
          agent: row["agent"], // Third column
          IssueDate: row["Issue Date"], // Third column
          ScheduledFlightDate: row["Scheduled Flight Date"], // Third column
          OperatedFlightDate: row["Operated Flight Date"], // Third column
          origin: row["origin"], // Third column
          amount: row["cons_amount"], // Fourth column
          YQ: row["YQ"]  // Fifth column
      }))// Filter out empty rows

      // Display the extracted data in the output element
      document.getElementById('output').textContent = JSON.stringify(extractedData, null, 2);

      axios.post('http://localhost:3000/api/endpoint', extractedData)
      .then(response => {
          console.log('Data sent successfully:', response.data);
      })
      .catch(error => {
          console.error('Error sending data:', error);
      });
  };

  reader.readAsArrayBuffer(file);  
 
  //reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
}

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
