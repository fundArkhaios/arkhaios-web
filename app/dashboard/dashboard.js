'use client'
import useFetch from "../hooks/useFetch";
import { useState, useEffect } from 'react';


export default function Dashboard() {

    const { error, isLoading, responseJSON } = useFetch(
        "/api/fund/history?symbol=" + fundSymbol + "&period=1m"
    );

    const { error: positionsError, isLoading: positionsIsLoading, responseJSON: positionsResponseJSON } = useFetch("/api/positions?fund=" + fundID);

    


}