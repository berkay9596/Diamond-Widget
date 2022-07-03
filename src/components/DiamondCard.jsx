import React, { useState, useEffect } from "react";
import loginthick from "../assets/loginthick.svg";
import diamond from "../assets/diamond.svg";
import unlem from "../assets/unlem.svg";
import Confetti from "./Confetti";
import Deso from "deso-protocol";
import DesoApi from "../libs/desoApi";
// import { SpinnerCircular } from "spinners-react";
const DiamondCard = () => {
  const amounts = ["1", "2", "4", "20", "50", "100"];
  const [value, setValue] = useState(0);
  const [style, setStyle] = useState({ display: "none" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState();
  const [username, setUsername] = useState();
  const [loading, setLoading] = useState(false);
  const [publicKeyFromUrl, setPublicKeyFromUrl] = useState();
  const [desoApi, setDesoApi] = useState();

  useEffect(() => {
    const da = new DesoApi();
    setDesoApi(da);
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const desoLogin = async () => {
    const deso = new Deso();
    const request = 3;
    const response = await deso.identity.login(request);
    console.log("response", response);
    setPublicKey(response.key);
    setIsLoggedIn(true);
  };
  const desoLogout = () => {
    const deso = new Deso();
    const request = null;
    const response = deso.identity.logout(request);
    console.log("logout resp", response);
    setIsLoggedIn(false);
  };
  const getUsername = async () => {
    const deso = new Deso();
    const request = {
      PublicKeyBase58Check: publicKey,
    };
    const response = await deso.user.getSingleProfile(request);
    setUsername(response?.Profile?.Username);
  };

  const sendDeso = async (index) => {
    setLoading(true);
    const deso = new Deso();
    const responseForExchange = await desoApi.getExchangeRate();
    let convertedUsd =
      (1 / responseForExchange.USDCentsPerBitCloutExchangeRate) * 100;
    if (index === 0) {
      convertedUsd = 1 * convertedUsd;
    } else if (index === 1) {
      convertedUsd = 2 * convertedUsd;
    } else if (index === 2) {
      convertedUsd = 4 * convertedUsd;
    } else if (index === 3) {
      convertedUsd = 20 * convertedUsd;
    } else if (index === 4) {
      convertedUsd = 50 * convertedUsd;
    } else if (index === 5) {
      convertedUsd = 100 * convertedUsd;
    }
    console.log("convertedUsd", Math.round(100 * (convertedUsd * 10000000)));
    const request = {
      SenderPublicKeyBase58Check: publicKey,
      AmountNanos: Math.round(100 * (convertedUsd * 10000000)),
      RecipientPublicKeyOrUsername: publicKeyFromUrl,
    };
    const response = await desoApi.sendBitclout(
      request.SenderPublicKeyBase58Check,
      request.AmountNanos,
      request.RecipientPublicKeyOrUsername
    );
    if (response) {
      setValue((value) => value + 1);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsername();
  }, [isLoggedIn]);

  const catchUrl = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    setPublicKeyFromUrl(url.pathname.substring(1));
  };

  useEffect(() => {
    catchUrl();
  }, []);

  return (
    <>
      {/* {loading && (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            dipslay: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          <SpinnerCircular />{" "}
        </div>
      )} */}
      <button
        className="reward-button"
        onMouseEnter={(e) => {
          setStyle({ display: "block" });
        }}
        onMouseLeave={(e) => {
          setStyle({ display: "none" });
        }}
      >
        <img src={diamond} />
        Reward
      </button>
      <Confetti value={value} />
      <div
        className="card-main"
        onMouseEnter={(e) => {
          setStyle({ display: "block" });
        }}
        onMouseLeave={(e) => {
          setStyle({ display: "none" });
        }}
        style={{
          backgroundColor: "black",
          width: "450px",
          // height: "175px",
          height: `${isLoggedIn ? "175px" : "100px"}`,
          borderRadius: "1.5rem",
          display: `${style.display}`,
        }}
      >
        {isLoggedIn && (
          <div className="d-flex align-items-center mx-2 p-2">
            <img src={loginthick} style={{ marginRight: "0.6rem" }}></img>
            <p
              style={{
                color: "#FFF",
                fontSize: "14px",
                margin: 0,
                marginTop: "1rem",
              }}
            >
              Logged in as {username} -
              <a
                className="logout"
                style={{ color: "red" }}
                onClick={desoLogout}
              >
                {" "}
                Logout{" "}
              </a>{" "}
              <br />
              <span style={{ fontSize: "11px" }}>
                {" "}
                Tipping designed by
                <span style={{ textDecoration: "underline" }}> Apolleo.</span>
              </span>
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "1rem",
            padding: "0.7rem",
          }}
        >
          {amounts.map((elem, index) => {
            return (
              <div key={index}>
                <div
                  className="card-diamond"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="diamond-amount"
                    style={{
                      color: "#CCCCCC",
                      border: "3px solid #CCCCCC",
                      borderRadius: "10px",
                      padding: "0.4rem",
                      width: "3rem",
                      height: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.7rem",
                      marginBottom: "4px",
                      fontSize: "14px",
                    }}
                  >
                    ${elem}
                  </div>
                  <img
                    src={diamond}
                    className="diamond-image"
                    style={{ color: "CCCCCC", padding: "0.4rem" }}
                    onClick={() => {
                      if (isLoggedIn) {
                        sendDeso(index);
                      } else {
                        desoLogin();
                        console.log("index", index);
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}

          <img src={unlem}></img>
        </div>
      </div>
    </>
  );
};

export default DiamondCard;
