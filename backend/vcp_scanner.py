import pandas as pd
import numpy as np
from data_loader import load_data
from universe import STOCKS
import config

def ema_trend(df):
    df["ema20"] = df["Close"].ewm(span=config.EMA_FAST).mean()
    df["ema50"] = df["Close"].ewm(span=config.EMA_MID).mean()
    df["ema200"] = df["Close"].ewm(span=config.EMA_SLOW).mean()

    return (
        df["Close"].iloc[-1] > df["ema20"].iloc[-1] >
        df["ema50"].iloc[-1] > df["ema200"].iloc[-1]
    )

def volatility_contraction(df):
    df["range"] = df["High"] - df["Low"]
    recent = df["range"].rolling(config.LOOKBACK_VOL).mean()
    return recent.iloc[-1] < recent.iloc[-config.LOOKBACK_VOL]

def volume_contraction(df):
    vol = df["Volume"]
    return vol.iloc[-1] < vol.rolling(config.VOLUME_LOOKBACK).mean().iloc[-1] * config.VOLUME_CONTRACTION_RATIO

def scan():
    results = []

    for stock in STOCKS:
        try:
            df = load_data(stock)
            if len(df) < 250:
                continue

            if ema_trend(df) and volatility_contraction(df) and volume_contraction(df):
                results.append({
                    "Stock": stock,
                    "Close": round(df["Close"].iloc[-1], 2),
                    "VCP": "YES"
                })
        except Exception as e:
            print(stock, e)

    return pd.DataFrame(results)

if __name__ == "__main__":
    out = scan()
    out.to_csv("../output/vcp_results.csv", index=False)
