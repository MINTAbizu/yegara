import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./telegramPrice.css

const telegramData = [
  { year: "2015", price: 7.0 },
  { year: "2024(07~07)", price: 0.8 },
  { year: "2024(06~06)", price: 2.0 },
  { year: "2024(05~05)", price: 5.0 },
  { year: "2024(04~04)", price: 5.0 },
  { year: "2024(03~03)", price: 5.0 },
  { year: "2024(02~02)", price: 5.0 },
  { year: "2024(01~01)", price: 5.0 },
  { year: "2023", price: 5.5 },
  { year: "2022", price: 7.0 },
  { year: "2021", price: 7.0 },
  { year: "2020", price: 7.0 },
  { year: "2019", price: 7.0 },
  { year: "2018", price: 7.0 },
  { year: "2017", price: 7.0 },
  { year: "2016", price: 7.0 },
];

const TelegramPrice = () => {
  return (
    <div className="container mt-4 mb-5 telegram-price-wrapper">
      <h2 className="text-center mb-4 tg-title">Telegram Price History</h2>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Year</th>
              <th>Price (USDT)</th>
            </tr>
          </thead>

          <tbody>
            {telegramData.map((item, index) => (
              <tr key={index}>
                <td className="fw-bold">{index + 1}</td>
                <td>{item.year}</td>
                <td className="text-success fw-semibold">
                  ${item.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TelegramPrice;
