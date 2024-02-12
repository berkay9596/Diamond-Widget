import React, { useState, useEffect } from "react";
import loginthick from "../assets/loginthick.svg";
import diamond from "../assets/diamond.svg";
import Confetti from "./Confetti";
import DesoApi from "../libs/desoApi";
import DesoIdentity from "../libs/desoIdentity";
import { SpinnerCircular } from "spinners-react";
const DiamondCard = () => {
  const amounts = ["1", "2", "4", "20", "50", "100"];
  const [value, setValue] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState();
  const [username, setUsername] = useState();
  const [usernameReciever, setUsernameReciever] = useState();
  const [loading, setLoading] = useState(false);
  const [desoApi, setDesoApi] = useState();
  const [desoIdentity, setDesoIdentity] = useState();
  const [isCardVisible, setIsCardVisible] = useState(false);

  useEffect(() => {
    const da = new DesoApi();
    setDesoApi(da);
    const di = new DesoIdentity();
    setDesoIdentity(di);
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  const desoLogin = async () => {
    const response = await desoIdentity.loginAsync(1);
    setPublicKey(response.publicKey);
    setIsLoggedIn(true);
  };
  const desoLogout = () => {
    setIsLoggedIn(false);
  };
  const getUsernameFromPublicKey = async () => {
    const response = await desoApi.getSingleProfileFromPublicKey(publicKey);
    setUsername(response?.Profile?.Username);
  };
  const getPublicKeyFromUserName = async (urlString) => {
    const response = await desoApi.getSingleProfileFromUserName(urlString);
    if (response === null) {
      setIsCardVisible(false);
      alert("Profile name you entered is wrong");
    }
    setUsernameReciever(response?.Profile?.Username);
  };

  const sendDesoMiddleWare = async (index) => {
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
    const request = {
      SenderPublicKeyBase58Check: publicKey,
      AmountNanos: Math.round(100 * (convertedUsd * 10000000)),
      // AmountNanos: 1,
      RecipientPublicKeyOrUsername: usernameReciever,
    };

    for (let i = 0; i < 2; i++) {
      if (i === 0) {
        const response = await desoApi.sendBitclout(
          request.SenderPublicKeyBase58Check,
          request.AmountNanos,
          request.RecipientPublicKeyOrUsername
        );
        const transactionHex = await response.TransactionHex;
        const signedTransactionHex = await desoIdentity.signTxAsync(
          transactionHex
        );
        const rtnSubmitTransaction = await desoApi.submitTransaction(
          signedTransactionHex
        );
      }
    }
  };

  const sendDeso = async (index) => {
    setLoading(true);

    const resp = sendDesoMiddleWare(index);
    resp
      .then((r) => {
        setValue((value) => value + 1);
        setLoading(false);
        return true;
      })
      .catch((err) => setLoading(false));
  };

  useEffect(() => {
    getUsernameFromPublicKey();
  }, [isLoggedIn]);

  const catchUrl = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    getPublicKeyFromUserName(url.pathname.substring(1));
  };

  useEffect(() => {
    if (isCardVisible) catchUrl();
  }, [isCardVisible]);

  return (
    <>
      <iframe
        title="desoidentity"
        id="identity"
        frameBorder="0"
        src="https://identity.deso.org/embed?v=2"
        style={{
          height: "100vh",
          width: "100vw",
          display: "none",
          position: "fixed",
          zIndex: 1000,
          left: 0,
          top: 0,
        }}
      ></iframe>
      {!isCardVisible ? (
        <button
          className="reward-button"
          onClick={() => setIsCardVisible(true)}
        >
          <div
            style={{
              marginRight: "11px",
              display: "flex",
              alignItems: "center !important",
            }}
          >
            <img src={diamond} className="diamond-reward" />

            <p className="reward"> Reward</p>
          </div>
        </button>
      ) : (
        <div
          style={{
            marginLeft: "0.1rem",
            marginTop: "0.1rem",
          }}
        >
          <div className="rectangle"></div>
          <div
            className="card-main"
            style={{
              backgroundColor: "black",
              width: "450px",
              height: "200px",
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {" "}
                <SpinnerCircular />{" "}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  src={loginthick}
                  style={{
                    width: "19.64px",
                    margin: "1rem auto",
                  }}
                ></img>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: "17px",
                    color: "white",
                    display: "flex",
                    justifyContent: "start",
                    marginLeft: "3rem",
                    fontWeight: "0 !important",
                    flexWrap: "wrap",
                  }}
                >
                  {isLoggedIn && username !== undefined ? (
                    <>
                      <span
                        style={{
                          fontWeight: 0,
                          lineHeight: "16.94px !important",
                        }}
                      >
                        {" "}
                        Logged in as @{username}
                      </span>
                      <span
                        style={{
                          borderTop: " 1px solid white",
                          width: "12px",
                          position: "relative",
                          top: "0.5rem",
                          left: "0.2rem",
                        }}
                      ></span>
                      <a
                        style={{
                          color: "#fe3537",
                          marginLeft: "0.4rem",
                          cursor: "pointer",
                        }}
                        onClick={desoLogout}
                      >
                        Logout
                      </a>
                      <span
                        style={{
                          borderTop: " 0.8px solid #fe3537",
                          width: "2.47rem",
                          position: "relative",
                          top: "1rem",
                          right: "2.47rem",
                        }}
                      ></span>
                      <span style={{ fontSize: "9.85px", fontWeight: 0 }}>
                        {" "}
                        $DESO Tipping widget by{" "}
                        <span
                          style={{
                            color: "#4da3ff",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            window.open(
                              "https://diamondapp.com/u/berkayuksel",
                              "_blank"
                            )
                          }
                        >
                          Berkayuksel
                        </span>
                        .
                      </span>
                      <span
                        style={{
                          borderTop: " 0.8px solid #4da3ff",
                          width: "3.37rem",
                          position: "relative",
                          top: "0.9rem",
                          right: "3.57rem",
                        }}
                      ></span>
                    </>
                  ) : (
                    <>
                      Send a Super Diamond. @{usernameReciever} will receive the
                      amount <br />
                      shown as a tip from you.
                    </>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "1rem 2.7rem 0rem 2.7rem",
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
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            className="diamond-amount"
                            style={{
                              color: "#CCCCCC",
                              border: "2px solid",
                              borderImageSource:
                                " linear-gradient(to right,#ED283E, #F802C9) ",
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
                            style={{
                              filter: "brightness(0) invert(1)",
                              padding: "0.4rem",
                              width: "45.29px",
                              height: "42.1px",
                            }}
                            onClick={() => {
                              if (isLoggedIn) {
                                sendDeso(index);
                              } else {
                                desoLogin();
                              }
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Confetti value={value} />
    </>
  );
};

export default DiamondCard;
