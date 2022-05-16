import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import StripeCheckout from 'react-stripe-checkout';

function App() {

  const [product, setProduct] = useState({
    name: "My producc",
    price: 10,
    owner: "Test Owner"
  })

  const makePayment = token => {
    const body = {
      token,
      product
    }
    const headers = {
      "Content-Type": "application/json"
    }

    return fetch(`http://localhost:5000/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    })
    .then( response => {
      console.log("RESPONSE", response)
      const { status } = response;
      console.log("STATUS", status);
    })
    .catch(error => console.log(error));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <StripeCheckout 
      stripeKey = {process.env.REACT_APP_STRIPE_SECRET_KEY}
      token={makePayment}
      name="Buy this product"
      amount={product.price * 100}
      />

    </div>
  );
}

export default App;
