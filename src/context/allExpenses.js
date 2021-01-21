import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useAuth0 } from '@auth0/auth0-react'
import { config } from '../config'
import { showToast } from '../utils'
import { useLoading } from 'hooks'

const getQuery = () => {
    return {
        query: `
            query {
                expenses {
                    _id
                    date
                    place
                    price
                    budget(populate: true) {
                    _id
                    name
                    amount
                    }
                }
            }
        `,
    }
}

const AllExpensesContext = createContext()

const AllExpensesProvider = ({ children }) => {
    const { getAccessTokenSilently } = useAuth0()
    const [allExpenses, setAllExpenses] = useState([])
    const [refetchAllExpenseData, setRefetchAllExpenseData] = useState(0)
    const { setIsLoading } = useLoading()

    useEffect(async () => {
        const fetchAllExpenses = async () => {
            setIsLoading(true)
            const token = await getAccessTokenSilently()
            const query = getQuery()
            const response = await fetch(config.backend.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(query),
            })
            const result = await response.json()
            if (result.errors) {
                showToast(result)
                return []
            }
            const { expenses } = result.data
            setIsLoading(false)
            return expenses
        }

        const data = await fetchAllExpenses()
        setAllExpenses(data)
    }, [refetchAllExpenseData])

    const context = {
        allExpenses,
        setAllExpenses,
        refetchAllExpenseData,
        setRefetchAllExpenseData,
    }

    return (
        <AllExpensesContext.Provider value={context}>
            {children}
        </AllExpensesContext.Provider>
    )
}

AllExpensesProvider.propTypes = {
    children: PropTypes.node,
}

export { AllExpensesContext, AllExpensesProvider }