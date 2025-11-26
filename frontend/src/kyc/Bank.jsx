import React from 'react'
import { useState } from 'react';

function Bank() {
    const ETHIOPIA_REGIONS = [
  "Cbe", "Oromia", "Amhara", "Awash", "BoA",
  "Dashen", "Lion", "Buna", "Sidama", "Sinqee",
  "Global", 
];
  const [region, setRegion] = useState("");

  return (
    <div>
         <div className="mb-3">
            <label className="form-label">Banks</label>
            <select
              className="form-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">Select Bank</option>
              {ETHIOPIA_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="accountnumber">
            <input type="number" placeholder='Enter Bank Account'/>
             <button type='submit'>Submit</button>
          </div>
      
    </div>
  )
}

export default Bank
