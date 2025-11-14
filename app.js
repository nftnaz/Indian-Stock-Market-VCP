

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { marked } from 'marked';

const { useState, useMemo, useCallback, Fragment } = React;
const e = React.createElement;

// --- Data Services ---
const STOCKS = [
  // (Full stock list remains unchanged, truncated for brevity)
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'INFY.NS', name: 'Infosys', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'SBIN.NS', name: 'State Bank of India', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'ITC.NS', name: 'ITC Limited', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'LICI.NS', name: 'Life Insurance Corporation of India', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'WIPRO.NS', name: 'Wipro', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'TITAN.NS', name: 'Titan Company', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'HCLTECH.NS', name: 'HCL Technologies', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'AXISBANK.NS', name: 'Axis Bank', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'ADANIPORTS.NS', name: 'Adani Ports & SEZ', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'NTPC.NS', name: 'NTPC', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'POWERGRID.NS', name: 'Power Grid Corporation', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'ONGC.NS', name: 'ONGC', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'COALINDIA.NS', name: 'Coal India', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'INDUSINDBK.NS', name: 'IndusInd Bank', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'GRASIM.NS', name: 'Grasim Industries', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'EICHERMOT.NS', name: 'Eicher Motors', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'CIPLA.NS', name: 'Cipla', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'NESTLEIND.NS', name: 'Nestle India', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'DIVISLAB.NS', name: 'Divi\'s Laboratories', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'BRITANNIA.NS', name: 'Britannia Industries', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'LT.NS', name: 'Larsen & Toubro', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'TECHM.NS', name: 'Tech Mahindra', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'DRREDDY.NS', name: 'Dr. Reddy\'s Laboratories', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'BPCL.NS', name: 'Bharat Petroleum', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'SHREECEM.NS', name: 'Shree Cement', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'UPL.NS', name: 'UPL Limited', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'SBILIFE.NS', name: 'SBI Life Insurance', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'HDFCLIFE.NS', name: 'HDFC Life Insurance', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'TATASTEEL.NS', name: 'Tata Steel', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'IOC.NS', name: 'Indian Oil Corporation', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'GAIL.NS', name: 'GAIL (India)', exchange: 'NSE', marketCap: 'Large' },
    { symbol: 'PAGEIND.NS', name: 'Page Industries', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'VOLTAS.NS', name: 'Voltas', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'DEEPAKNTR.NS', name: 'Deepak Nitrite', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'ASTRAL.NS', name: 'Astral', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'TATACHEM.NS', name: 'Tata Chemicals', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'CUMMINSIND.NS', name: 'Cummins India', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'POLYCAB.NS', name: 'Polycab India', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'BALKRISIND.NS', name: 'Balkrishna Industries', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'AUROPHARMA.NS', name: 'Aurobindo Pharma', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'PIDILITIND.NS', name: 'Pidilite Industries', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'INDIGO.NS', name: 'InterGlobe Aviation', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'TRENT.NS', name: 'Trent', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'MRF.NS', name: 'MRF', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'SIEMENS.NS', name: 'Siemens', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'ADANIGREEN.NS', name: 'Adani Green Energy', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'BAJAJHLDNG.NS', name: 'Bajaj Holdings', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'BOSCHLTD.NS', name: 'Bosch', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'PNB.NS', name: 'Punjab National Bank', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'BANKBARODA.NS', name: 'Bank of Baroda', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'ZOMATO.NS', name: 'Zomato', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'HAVELLS.NS', name: 'Havells India', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'SRF.NS', name: 'SRF Limited', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'ICICIPRULI.NS', name: 'ICICI Prudential Life', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'INDUSTOWER.NS', name: 'Indus Towers', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'LTIM.NS', name: 'LTIMindtree', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'BERGEPAINT.NS', name: 'Berger Paints', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'CANBK.NS', name: 'Canara Bank', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'AMBUJACEM.NS', name: 'Ambuja Cements', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'GODREJCP.NS', name: 'Godrej Consumer Products', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'TATAPOWER.NS', name: 'Tata Power', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'BEL.NS', name: 'Bharat Electronics', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'IRCTC.NS', name: 'IRCTC', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'MUTHOOTFIN.NS', name: 'Muthoot Finance', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'CHOLAFIN.NS', name: 'Cholamandalam Investment', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'COLPAL.NS', name: 'Colgate-Palmolive', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'DABUR.NS', name: 'Dabur India', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'MARICO.NS', name: 'Marico', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'ALKEM.NS', name: 'Alkem Laboratories', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'PIIND.NS', name: 'PI Industries', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'HAL.NS', name: 'Hindustan Aeronautics', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'SAIL.NS', name: 'Steel Authority of India', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'NMDC.NS', name: 'NMDC', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'VEDL.NS', name: 'Vedanta', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'DLF.NS', name: 'DLF', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'GLAND.NS', name: 'Gland Pharma', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'TORNTPOWER.NS', name: 'Torrent Power', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'LICHSGFIN.NS', name: 'LIC Housing Finance', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'JSWENERGY.NS', name: 'JSW Energy', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'BHARATFORG.NS', name: 'Bharat Forge', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'CONCOR.NS', name: 'Container Corporation', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'ESCORTS.NS', name: 'Escorts Kubota', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'GODREJPROP.NS', name: 'Godrej Properties', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'HINDZINC.NS', name: 'Hindustan Zinc', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'IBULHSGFIN.NS', name: 'Indiabulls Housing Finance', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'IDBI.NS', name: 'IDBI Bank', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'LUPIN.NS', name: 'Lupin', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'MPHASIS.NS', name: 'Mphasis', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'OFSS.NS', name: 'Oracle Financial Services', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'PETRONET.NS', name: 'Petronet LNG', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'RAMCOCEM.NS', name: 'Ramco Cements', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'SHRIRAMFIN.NS', name: 'Shriram Finance', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'TATACONSUM.NS', name: 'Tata Consumer Products', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'UBL.NS', name: 'United Breweries', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'IDEA.NS', name: 'Vodafone Idea', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'ZEEL.NS', name: 'Zee Entertainment', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'MCDOWELL-N.NS', name: 'United Spirits', exchange: 'NSE', marketCap: 'Mid' },
    { symbol: 'KEI.NS', name: 'KEI Industries', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'IEX.NS', name: 'Indian Energy Exchange', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'CAMS.NS', name: 'Computer Age Management Services', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'ANGELONE.NS', name: 'Angel One', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'TEJASNET.NS', name: 'Tejas Networks', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'AFFLE.NS', name: 'Affle (India)', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'CENTURYPLY.NS', name: 'Century Plyboards', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'WELSPUNIND.NS', name: 'Welspun India', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'IRCON.NS', name: 'Ircon International', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'TRITURBINE.NS', name: 'Triveni Turbine', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'DIXON.NS', name: 'Dixon Technologies', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'APLAPOLLO.NS', name: 'APL Apollo Tubes', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'IDFCFIRSTB.NS', name: 'IDFC First Bank', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'LUXIND.NS', name: 'Lux Industries', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'FINOLEXIND.NS', name: 'Finolex Industries', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'JKLAKSHMI.NS', name: 'JK Lakshmi Cement', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'VGUARD.NS', name: 'V-Guard Industries', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'JUSTDIAL.NS', name: 'Just Dial', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'PVR.NS', name: 'PVR', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'RADICO.NS', name: 'Radico Khaitan', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'PHOENIXLTD.NS', name: 'Phoenix Mills', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'JUBILANT.NS', name: 'Jubilant Foodworks', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'NATCOPHARM.NS', name: 'Natco Pharma', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'ZENSARTECH.NS', name: 'Zensar Technologies', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'BSE.NS', name: 'BSE Limited', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'CDSL.NS', name: 'Central Depository Services', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'LAURUSLABS.NS', name: 'Laurus Labs', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'ROUTE.NS', name: 'Route Mobile', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'GREENCITY.NS', name: 'Godrej Properties', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'HFCL.NS', name: 'HFCL', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'MASTEK.NS', name: 'Mastek', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'NBCC.NS', name: 'NBCC (India)', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'NCC.NS', name: 'NCC', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'NHPC.NS', name: 'NHPC', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'PFC.NS', name: 'Power Finance Corporation', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'RBLBANK.NS', name: 'RBL Bank', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'RVNL.NS', name: 'Rail Vikas Nigam', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'SUNTV.NS', name: 'Sun TV Network', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'SYNGENE.NS', name: 'Syngene International', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'TEAMLEASE.NS', name: 'TeamLease Services', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'TRIDENT.NS', name: 'Trident', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'TTML.NS', name: 'Tata Teleservices', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'UJJIVANSFB.NS', name: 'Ujjivan Small Finance Bank', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'UNIONBANK.NS', name: 'Union Bank of India', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'WELCORP.NS', name: 'Welspun Corp', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'YESBANK.NS', name: 'Yes Bank', exchange: 'NSE', marketCap: 'Small' },
    { symbol: 'ASIANPAINT.BO', name: 'Asian Paints', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'BAJFINANCE.BO', name: 'Bajaj Finance', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'AXISBANK.BO', name: 'Axis Bank', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'LT.BO', name: 'Larsen & Toubro', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'ULTRACEMCO.BO', name: 'UltraTech Cement', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'SUNPHARMA.BO', name: 'Sun Pharmaceutical Industries', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'M&M.BO', name: 'Mahindra & Mahindra', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'DRREDDY.BO', name: 'Dr. Reddy\'s Laboratories', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'WIPRO.BO', name: 'Wipro', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'HCLTECH.BO', name: 'HCL Technologies', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'TITAN.BO', name: 'Titan Company', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'ITC.BO', name: 'ITC Limited', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'RELIANCE.BO', name: 'Reliance Industries', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'TCS.BO', name: 'Tata Consultancy Services', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'HDFCBANK.BO', name: 'HDFC Bank', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'INFY.BO', name: 'Infosys', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'ICICIBANK.BO', name: 'ICICI Bank', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'HINDUNILVR.BO', name: 'Hindustan Unilever', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'KOTAKBANK.BO', name: 'Kotak Mahindra Bank', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'SBIN.BO', name: 'State Bank of India', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'BHARTIARTL.BO', name: 'Bharti Airtel', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'BAJAJFINSV.BO', name: 'Bajaj Finserv', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'MARUTI.BO', name: 'Maruti Suzuki', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'HDFCLIFE.BO', name: 'HDFC Life Insurance', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'TATASTEEL.BO', name: 'Tata Steel', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'POWERGRID.BO', name: 'Power Grid Corporation', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'NTPC.BO', name: 'NTPC', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'ONGC.BO', name: 'ONGC', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'INDUSINDBK.BO', name: 'IndusInd Bank', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'TECHM.BO', name: 'Tech Mahindra', exchange: 'BSE', marketCap: 'Large' },
    { symbol: 'BATAINDIA.BO', name: 'Bata India', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'VINATIORGA.BO', name: 'Vinati Organics', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'ABFRL.BO', name: 'Aditya Birla Fashion and Retail', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'MFSL.BO', name: 'Max Financial Services', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'GLAND.BO', name: 'Gland Pharma', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'CASTROLIND.BO', name: 'Castrol India', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'ENDURANCE.BO', name: 'Endurance Technologies', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: '3MINDIA.BO', name: '3M India', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'GODREJIND.BO', name: 'Godrej Industries', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'APOLLOTYRE.BO', name: 'Apollo Tyres', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'TATAPOWER.BO', name: 'Tata Power', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'NMDC.BO', name: 'NMDC', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'ACC.BO', name: 'ACC', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'BANKINDIA.BO', name: 'Bank of India', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'FEDERALBNK.BO', name: 'Federal Bank', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'UNIONBANK.BO', name: 'Union Bank of India', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'JINDALSTEL.BO', name: 'Jindal Steel & Power', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'SAIL.BO', name: 'Steel Authority of India', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'ADANIPOWER.BO', name: 'Adani Power', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'PETRONET.BO', name: 'Petronet LNG', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'GODREJPROP.BO', name: 'Godrej Properties', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'TRENT.BO', name: 'Trent', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'SIEMENS.BO', name: 'Siemens', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'SRF.BO', name: 'SRF Limited', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'HAVELLS.BO', name: 'Havells India', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'LTIM.BO', name: 'LTIMindtree', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'PNB.BO', name: 'Punjab National Bank', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'ICICIPRULI.BO', name: 'ICICI Prudential Life', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'BANKBARODA.BO', name: 'Bank of Baroda', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'AMBUJACEM.BO', name: 'Ambuja Cements', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'BERGEPAINT.BO', name: 'Berger Paints', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'BEL.BO', name: 'Bharat Electronics', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'CHOLAFIN.BO', name: 'Cholamandalam Investment', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'COLPAL.BO', name: 'Colgate-Palmolive', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'DABUR.BO', name: 'Dabur India', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'DLF.BO', name: 'DLF', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'HAL.BO', name: 'Hindustan Aeronautics', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'HINDZINC.BO', name: 'Hindustan Zinc', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'ICICIGI.BO', name: 'ICICI Lombard', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'INDIGO.BO', name: 'InterGlobe Aviation', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'LUPIN.BO', name: 'Lupin', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'MARICO.BO', name: 'Marico', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'MPHASIS.BO', name: 'Mphasis', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'MUTHOOTFIN.BO', name: 'Muthoot Finance', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'OFSS.BO', name: 'Oracle Financial Services', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'PIDILITIND.BO', name: 'Pidilite Industries', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'SHRIRAMFIN.BO', name: 'Shriram Finance', exchange: 'BSE', marketCap: 'Mid' },
    { symbol: 'TATACONSUM.BO', name: 'Tata Consumer Products', exchange: 'BSE', marketCap: 'Mid' },
    { 'symbol': 'LAURUSLABS.BO', 'name': 'Laurus Labs', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'CDSL.BO', 'name': 'Central Depository Services', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'RAJESHEXPO.BO', 'name': 'Rajesh Exports', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'ITI.BO', 'name': 'ITI Limited', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'BLS.BO', 'name': 'BLS International Services', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'ROUTE.BO', 'name': 'Route Mobile', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'EQUITASBNK.BO', 'name': 'Equitas Small Finance Bank', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'VAIBHAVGBL.BO', 'name': 'Vaibhav Global', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'SPICEJET.BO', 'name': 'SpiceJet', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'IDFC.BO', 'name': 'IDFC Limited', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'RBLBANK.BO', 'name': 'RBL Bank', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'UCOBANK.BO', 'name': 'UCO Bank', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'IOB.BO', 'name': 'Indian Overseas Bank', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'CENTRALBK.BO', 'name': 'Central Bank of India', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'HFCL.BO', 'name': 'HFCL', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'NCC.BO', 'name': 'NCC', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'RVNL.BO', 'name': 'Rail Vikas Nigam', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'PNBHOUSING.BO', 'name': 'PNB Housing Finance', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'SOUTHBANK.BO', 'name': 'South Indian Bank', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'DISHTV.BO', 'name': 'Dish TV India', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'AARTIDRUGS.BO', 'name': 'Aarti Drugs', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'AAVAS.BO', 'name': 'Aavas Financiers', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'AFFLE.BO', 'name': 'Affle (India)', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'AIAENG.BO', 'name': 'AIA Engineering', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'APLAPOLLO.BO', 'name': 'APL Apollo Tubes', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'ASTERDM.BO', 'name': 'Aster DM Healthcare', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'BALAMINES.BO', 'name': 'Balaji Amines', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'BSE.BO', 'name': 'BSE Limited', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'CAMS.BO', 'name': 'Computer Age Management', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'CENTURYPLY.BO', 'name': 'Century Plyboards', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'CHEMCON.BO', 'name': 'Chemcon Speciality', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'CIGNITITEC.BO', 'name': 'Cigniti Technologies', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'COCHINSHIP.BO', 'name': 'Cochin Shipyard', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'DIXON.BO', 'name': 'Dixon Technologies', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'ECLERX.BO', 'name': 'eClerx Services', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'FINCABLES.BO', 'name': 'Finolex Cables', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'GATEWAY.BO', name: 'Gateway Distriparks', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'GRINFRA.BO', name: 'G R Infraprojects', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'HAPPSTMNDS.BO', name: 'Happiest Minds', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'IEX.BO', name: 'Indian Energy Exchange', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'IIFL.BO', name: 'IIFL Finance', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'IRCON.BO', name: 'Ircon International', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'J&KBANK.BO', name: 'Jammu & Kashmir Bank', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'JUBILANT.BO', name: 'Jubilant Foodworks', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'JUSTDIAL.BO', name: 'Just Dial', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'KEI.BO', name: 'KEI Industries', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'LUXIND.BO', name: 'Lux Industries', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'MASTEK.BO', name: 'Mastek', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'NATCOPHARM.BO', name: 'Natco Pharma', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'NBCC.BO', name: 'NBCC (India)', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'PVRINOX.BO', name: 'PVR Inox', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'RADICO.BO', name: 'Radico Khaitan', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'RENUKA.BO', name: 'Shree Renuka Sugars', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'SOBHA.BO', name: 'Sobha', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'TANLA.BO', name: 'Tanla Platforms', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'TEJASNET.BO', name: 'Tejas Networks', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'TRITURBINE.BO', name: 'Triveni Turbine', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'VGUARD.BO', name: 'V-Guard Industries', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'WELSPUNIND.BO', name: 'Welspun India', 'exchange': 'BSE', 'marketCap': 'Small' },
    { 'symbol': 'ZENSARTECH.BO', name: 'Zensar Technologies', 'exchange': 'BSE', 'marketCap': 'Small' },
];
const VCP_CANDIDATES = [
    'POLYCAB.NS', 'KEI.NS', 'ASTRAL.NS', 'PAGEIND.NS', 'TRENT.NS', 'DIXON.NS',
    'DEEPAKNTR.NS', 'CAMS.NS', 'APLAPOLLO.NS', 'BALKRISIND.NS', 'VINATIORGA.BO',
    'IEX.NS', 'IRCON.NS', 'TRITURBINE.NS', 'ZENSARTECH.NS', 'AFFLE.NS', 'ROUTE.BO',
    'LAURUSLABS.BO', 'HAPPSTMNDS.BO', 'CDSL.BO', 'TEJASNET.NS', 'ENDURANCE.BO',
    'ANGELONE.NS', 'PERSISTENT.NS', 'TATAPOWER.BO', 'JINDALSTEL.BO', 'TATAELXSI.NS',
    'HAL.NS', 'JSWENERGY.NS', 'BEL.NS', 'HINDZINC.BO', 'RVNL.BO'
];

const getStocks = () => STOCKS;
const getVcpCandidates = () => VCP_CANDIDATES;

async function getVcpAnalysis(stock) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
        You are a seasoned technical analyst specializing in the Volatility Contraction Pattern (VCP), a concept popularized by Mark Minervini.
        A user has identified ${stock.name} (${stock.symbol}) as a potential VCP candidate.
        
        Based on a simulated chart showing a classic VCP setup for this stock, provide a brief, professional analysis. Your analysis should:
        1. Briefly explain that VCP is characterized by tightening price volatility over several weeks.
        2. Mention the "tell-tale" sign of volume drying up as the pattern consolidates.
        3. Speculate on what a potential breakout might look like (e.g., a sharp increase in price on high volume).
        4. Conclude with a reminder that this is a textbook pattern and real-world trading requires further confirmation.
        
        Keep the tone professional and educational. Do not give financial advice or make any price predictions. The analysis is for educational purposes based on a simulated pattern.
        Format your response using markdown for clarity. Use headings for "Pattern Overview", "Volume Analysis", and "Potential Breakout", and use bullet points or bold text where appropriate.
    `;
    try {
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Error generating VCP analysis:", error);
        throw new Error("Failed to communicate with the AI model. Please check your API key and network connection.");
    }
}


// --- UI Components ---

const ChartBarIcon = () => e('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-primary", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, e('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }));
const LoadingIcon = () => e('svg', { className: "animate-spin h-5 w-5 text-current", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" }, e('circle', { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), e('path', { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" }));
const CloseIcon = () => e('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, e('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }));

const Header = () => {
    return e('header', { className: "bg-surface/80 backdrop-blur-sm shadow-md sticky top-0 z-20" },
        e('div', { className: "container mx-auto px-4 md:px-6 py-4 flex items-center justify-between" },
            e('div', { className: "flex items-center gap-3" },
                e(ChartBarIcon),
                e('h1', { className: "text-xl font-bold text-text tracking-wider" }, "AI VCP Stock Scanner")
            ),
            e('a', {
                href: "https://github.com/google/generative-ai-docs/tree/main/app-development/web",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "px-4 py-2 text-sm font-medium text-subtle hover:text-text transition-colors duration-200 rounded-md bg-overlay hover:bg-opacity-75"
            }, "View Source")
        )
    );
};

const ScanFilters = ({ onScan }) => {
    const [filters, setFilters] = useState({ exchange: 'ALL', marketCap: 'ALL' });
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        onScan(filters);
    };

    const selectClasses = "w-full px-3 py-2 bg-overlay border border-muted/50 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-focus transition-all";
    
    return e('form', { onSubmit: handleSubmit, className: "bg-surface p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto border border-overlay animate-slide-up" },
        e('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-end" },
            e('div', { className: "flex flex-col gap-2" },
                e('label', { htmlFor: "exchange", className: "text-sm font-medium text-subtle" }, "Exchange"),
                e('select', { id: "exchange", name: "exchange", value: filters.exchange, onChange: handleFilterChange, className: selectClasses },
                    e('option', { value: "ALL" }, "All Exchanges"),
                    e('option', { value: "NSE" }, "NSE"),
                    e('option', { value: "BSE" }, "BSE")
                )
            ),
            e('div', { className: "flex flex-col gap-2" },
                e('label', { htmlFor: "marketCap", className: "text-sm font-medium text-subtle" }, "Market Cap"),
                e('select', { id: "marketCap", name: "marketCap", value: filters.marketCap, onChange: handleFilterChange, className: selectClasses },
                    e('option', { value: "ALL" }, "All Market Caps"),
                    e('option', { value: "Large" }, "Large-Cap"),
                    e('option', { value: "Mid" }, "Mid-Cap"),
                    e('option', { value: "Small" }, "Small-Cap")
                )
            ),
            e('button', { type: "submit", className: "flex items-center justify-center gap-3 w-full px-6 py-2 bg-primary text-text font-bold text-base rounded-lg shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105" }, "Apply Filters")
        )
    );
};

const StockListItem = ({ stock, onSelect }) => {
    const marketCapColor = stock.marketCap === 'Large' ? 'bg-blue-500/20 text-blue-300' :
                           stock.marketCap === 'Mid' ? 'bg-yellow-500/20 text-yellow-300' :
                           'bg-purple-500/20 text-purple-300';
    return e('button', {
        onClick: onSelect,
        className: "w-full text-left p-4 flex items-center justify-between bg-overlay/50 rounded-lg hover:bg-overlay transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-glow/20",
        'aria-label': `View details for ${stock.name}`
    },
        e('div', { className: "flex items-center gap-4" },
            e('div', { className: "flex-shrink-0 w-12 h-12 bg-surface rounded-full flex items-center justify-center font-bold text-primary" }, stock.symbol.charAt(0)),
            e('div', null,
                e('p', { className: "font-bold text-text text-lg" }, stock.symbol),
                e('p', { className: "text-sm text-subtle" }, stock.name)
            )
        ),
        e('div', { className: "text-right flex items-center gap-4" },
            e('p', { className: "text-sm font-medium text-text px-3 py-1 rounded-full bg-surface" }, stock.exchange),
            e('p', { className: `text-xs font-bold px-3 py-1 rounded-full ${marketCapColor}` }, `${stock.marketCap}-Cap`)
        )
    );
};

const StockChartModal = ({ stock, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [error, setError] = useState('');

    const handleGenerateAnalysis = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setAnalysis('');
        try {
            const result = await getVcpAnalysis(stock);
            setAnalysis(result);
        } catch (e) {
            setError(e.message || 'Failed to generate analysis. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [stock]);

    // Dummy data for chart simulation
    const chartData = useMemo(() => [{ name: 'Wk 1', price: 100, vol: 30 }, { name: 'Wk 2', price: 110, vol: 28 }, { name: 'Wk 3', price: 105, vol: 25 }, { name: 'Wk 4', price: 115, vol: 22 }, { name: 'Wk 5', price: 112, vol: 18 }, { name: 'Wk 6', price: 118, vol: 15 }, { name: 'Wk 7', price: 116, vol: 10 }, { name: 'Wk 8', price: 120, vol: 8 }, { name: 'Wk 9', price: 119, vol: 5 }, { name: 'Wk 10', price: 121, vol: 3 }], []);

    return e('div', {
        className: "fixed inset-0 bg-base/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in",
        onClick: onClose, role: "dialog", 'aria-modal': "true", 'aria-labelledby': "stock-modal-title"
    },
        e('div', {
            className: "bg-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-overlay",
            onClick: e => e.stopPropagation()
        },
            e('header', { className: "p-4 flex items-center justify-between border-b border-overlay flex-shrink-0" },
                e('div', null,
                    e('h2', { id: "stock-modal-title", className: "text-xl font-bold text-text bg-gradient-to-r from-primary-focus to-primary bg-clip-text text-transparent" }, stock.symbol),
                    e('p', { className: "text-sm text-subtle" }, stock.name)
                ),
                e('button', { onClick: onClose, className: "p-2 rounded-full text-subtle hover:bg-overlay hover:text-text transition-colors", 'aria-label': "Close modal" }, e(CloseIcon))
            ),
            e('main', { className: "p-6 flex-grow overflow-y-auto space-y-6" },
                e('section', null,
                    e('h3', { className: "text-lg font-semibold text-subtle mb-4" }, "VCP Chart Simulation"),
                    e('div', { className: "h-64 w-full" },
// FIX: Pass children as a prop to ResponsiveContainer as its type definition requires it.
                        e(ResponsiveContainer, {
                            width: "100%",
                            height: "100%",
                            children: e(LineChart, { data: chartData, margin: { top: 5, right: 20, left: -10, bottom: 5 } },
                                e(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                                e(XAxis, { dataKey: "name", stroke: "#9ca3af", tickLine: false, axisLine: false }),
                                e(YAxis, { stroke: "#9ca3af", tickLine: false, axisLine: false }),
                                e(Tooltip, { contentStyle: { backgroundColor: '#111827', borderColor: '#374151', color: '#f9fafb', borderRadius: '0.5rem' } }),
                                e(Line, { type: "monotone", dataKey: "price", stroke: "#3b82f6", strokeWidth: 2, dot: false })
                            )
                        })
                    )
                ),
                e('section', { className: "" },
                    e('div', { className: "flex items-center justify-between mb-4" },
                        e('h3', { className: "text-lg font-semibold text-subtle" }, "AI-Powered Analysis"),
                        e('button', { onClick: handleGenerateAnalysis, disabled: isLoading, className: "px-4 py-2 text-sm font-medium bg-primary text-text rounded-lg shadow hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary-focus disabled:bg-muted disabled:cursor-not-allowed flex items-center gap-2 transition-all" },
                            isLoading && e(LoadingIcon),
                            isLoading ? 'Generating...' : analysis ? 'Regenerate' : 'Generate Analysis'
                        )
                    ),
                    e('div', { className: "prose prose-sm prose-invert p-4 bg-overlay rounded-lg min-h-[120px] text-subtle leading-relaxed" },
                        isLoading && e('p', { className: "text-center animate-pulse" }, "Contacting Gemini for analysis..."),
                        error && e('p', { className: "text-negative text-center font-semibold" }, error),
                        analysis && e('div', { dangerouslySetInnerHTML: { __html: marked(analysis) } }),
                        !analysis && !isLoading && !error && e('p', null, "Click \"Generate Analysis\" to get AI-powered insights on this simulated VCP setup.")
                    )
                )
            )
        )
    );
};

const StockList = ({ stocks }) => {
    const [selectedStock, setSelectedStock] = useState(null);
    return e(Fragment, null,
        e('div', { className: "bg-surface/50 rounded-xl shadow-lg animate-fade-in border border-overlay/50" },
            e('header', { className: "p-4 border-b border-overlay" },
                e('h3', { className: "text-lg font-semibold text-text" }, "Screener Results"),
                e('p', { className: "text-sm text-subtle" }, `${stocks.length} potential VCP candidate(s) found.`)
            ),
            e('div', { className: "p-4 space-y-3" },
                stocks.map(stock => e(StockListItem, { key: stock.symbol, stock: stock, onSelect: () => setSelectedStock(stock) }))
            )
        ),
        selectedStock && e(StockChartModal, { stock: selectedStock, onClose: () => setSelectedStock(null) })
    );
};

// FIX: Moved EmptyState outside of App component to prevent re-declaration on every render and to potentially fix a type inference issue.
const EmptyState = ({ icon, title, message }) => e('div', { className: "h-full flex flex-col items-center justify-center text-center text-muted p-8 bg-surface/50 rounded-xl shadow-inner animate-fade-in border border-overlay/30" },
    e('div', { className: "text-6xl mb-4" }, icon),
    e('p', { className: "mt-4 text-xl font-semibold text-subtle" }, title),
    e('p', { className: "text-sm text-muted max-w-sm mt-2" }, message)
);

const App = () => {
    const [scanResults, setScanResults] = useState([]);
    const [hasScanned, setHasScanned] = useState(false);
    const allStocks = useMemo(() => getStocks(), []);
    const vcpCandidateSymbols = useMemo(() => new Set(getVcpCandidates()), []);
    const vcpStocks = useMemo(() => {
        return allStocks.filter(stock => vcpCandidateSymbols.has(stock.symbol));
    }, [allStocks, vcpCandidateSymbols]);
    
    const handleScan = useCallback((filters) => {
        setHasScanned(true);
        const results = vcpStocks.filter(stock => {
            const exchangeMatch = filters.exchange === 'ALL' || stock.exchange === filters.exchange;
            const marketCapMatch = filters.marketCap === 'ALL' || stock.marketCap === filters.marketCap;
            return exchangeMatch && marketCapMatch;
        });
        setScanResults(results);
    }, [vcpStocks]);

    return e('div', { className: "min-h-screen flex flex-col" },
        e(Header),
        e('main', { className: "flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col" },
            e('div', { className: "text-center mb-10 animate-fade-in" },
                e('h2', { className: "text-3xl md:text-5xl font-bold text-text mb-3 leading-tight" }, "Trade Smarter with ", e('span', {className: 'bg-gradient-to-r from-primary-focus to-primary bg-clip-text text-transparent'}, "AI-Powered Insights")),
                e('p', { className: "text-subtle max-w-3xl mx-auto" }, "Instantly filter our pre-analyzed list of Volatility Contraction Pattern (VCP) candidates from a database of over 450 NSE/BSE stocks. The results reflect a comprehensive daily scan.")
            ),
            e(ScanFilters, { onScan: handleScan }),
            e('div', { className: "flex-grow mt-8" },
                hasScanned && scanResults.length === 0 && e(EmptyState, { icon: "😕", title: "No VCP Patterns Found", message: "No pre-analyzed VCP candidates match your filter criteria. Try adjusting the filters." }),
                scanResults.length > 0 && e(StockList, { stocks: scanResults }),
                !hasScanned && e(EmptyState, { icon: "🔎", title: "Ready to Screen", message: "Choose your filters and press \"Apply Filters\" to see the potential VCP candidates." })
            )
        ),
        e('footer', { className: "text-center p-4 text-muted text-sm mt-8" },
            e('p', null, "Disclaimer: This is an educational tool for analyzing market patterns. Not financial advice.")
        )
    );
};

// --- Mount Application ---
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Fatal: Could not find root element to mount the application.");
}
const root = ReactDOM.createRoot(rootElement);
root.render(e(React.StrictMode, null, e(App)));