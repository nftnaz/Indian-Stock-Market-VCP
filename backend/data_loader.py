import yfinance as yf

def load_data(symbol, period="1y"):
    df = yf.download(symbol, period=period, auto_adjust=True)
    df.dropna(inplace=True)
    return df
