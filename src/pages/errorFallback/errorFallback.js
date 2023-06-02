import React from "react";
import "./errorFallback.css";

function ErrorFallback() {
  return (
    <div className="error-fallback">
<img src="https://i.ibb.co/b6PSzcb/No-data-bro.png" alt="No-data-bro" border="0" className="fallback-img"/>
          <h1>Oops!</h1>
      <p>Something went wrong. Please try again later.</p>
    </div>
  );
}

export default ErrorFallback;
