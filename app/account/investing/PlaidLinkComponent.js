import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";

import {useState, useEffect} from 'react';
export default function PlaidLinkComponent() {

  const [linkToken, setLinkToken] = useState();
 

  async function transferPlaidLink(publicToken) {
    await fetch("/api/plaid/public-token-exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_token: publicToken,
        }),
      });
  }


  useEffect( () => {
    async function generateLinkToken() {
        await fetch('/api/plaid/generate-link-token',  {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },  
        }).then(async (response) => {
            const data = await response.json();
            console.log("Data: " + data);
            console.log(data.stringify)
            setLinkToken(data.link_token);
        })
      }
      generateLinkToken();
  }, []) 

  
  var config = {
    onSuccess: function (publicToken, metadata) {
        console.log("SUCCESS PLAID");      
        transferPlaidLink(publicToken, metadata);  
    },
    onExit: function (err, metadata) {
        console.log("EXITED PLAID")

    },
    onEvent: function (eventName, metadata) {
        console.log("EVENT PLAID")
        
    },
    token: linkToken,
  };

  const { open, exit, ready } = usePlaidLink(config);

  return <btn className="btn outline" onClick={open}>Link Account</btn>;
}
